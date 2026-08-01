const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dbStore } = require('../config/db');

let User = null;
let mongoose = null;
try {
  mongoose = require('mongoose');
  User = require('../models/User');
} catch (e) {
  // Model not available, fallback to in-memory
}

const JWT_SECRET = process.env.JWT_SECRET || 'BUSONE_JWT_SECRET_2026_PRODUCTION';

// Check if MongoDB is actually connected
const isMongoConnected = () => {
  return mongoose && mongoose.connection && mongoose.connection.readyState === 1;
};

// ─── REGISTER ───
exports.register = async (req, res) => {
  try {
    const { name, phone, password, email, role = 'passenger' } = req.body;
    const identifier = phone || email;

    if (!name || !identifier || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone/email, and password are required' });
    }

    // MongoDB path — only if connection is alive
    if (User && isMongoConnected()) {
      const existingUser = await User.findOne({ phone: identifier });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'An account with this phone number already exists. Please login instead.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const generatedWalletId = `WAL-APSRTC-${Math.floor(100000 + Math.random() * 900000)}`;

      const newUser = await User.create({
        name,
        phone: identifier,
        password: hashedPassword,
        role: role.toLowerCase(),
        walletId: generatedWalletId,
        walletBalance: 0
      });

      const token = jwt.sign(
        { id: newUser._id.toString(), role: newUser.role, phone: newUser.phone, name: newUser.name, walletId: generatedWalletId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log(`✅ Passenger registered in MongoDB: ${name} (Wallet: ${generatedWalletId})`);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          phone: newUser.phone,
          role: newUser.role,
          walletId: generatedWalletId,
          walletBalance: newUser.walletBalance || 0
        }
      });
    }

    // Fallback: in-memory store
    const existing = dbStore.users.find(u => u.phone === identifier);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this phone number already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `USER-${Date.now()}`,
      name,
      phone: identifier,
      password: hashedPassword,
      role: role.toLowerCase(),
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };
    dbStore.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, phone: newUser.phone, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Passenger registered (in-memory): ${name} (${identifier})`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        walletBalance: 0
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGIN ───
exports.login = async (req, res) => {
  try {
    const { phone, email, username, password } = req.body || {};
    const identifier = (phone || email || username || '').toString().trim();
    const cleanPassword = (password || '').toString().trim();

    if (!identifier || !cleanPassword) {
      return res.status(400).json({ success: false, message: 'Phone number and password are required' });
    }

    // MongoDB path — only if connection is alive
    if (User && isMongoConnected()) {
      let user = await User.findOne({ phone: identifier });

      if (!user) {
        // Auto-provision passenger user account with unique walletId
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPassword, salt);
        const generatedWalletId = `WAL-APSRTC-${Math.floor(100000 + Math.random() * 900000)}`;
        user = await User.create({
          name: `Passenger (${identifier.slice(-4)})`,
          phone: identifier,
          password: hashedPassword,
          role: 'passenger',
          walletId: generatedWalletId,
          walletBalance: 0
        });
      }

      if (!user.walletId) {
        user.walletId = `WAL-APSRTC-${Math.floor(100000 + Math.random() * 900000)}`;
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role, phone: user.phone, name: user.name, walletId: user.walletId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
          walletId: user.walletId,
          walletBalance: user.walletBalance !== undefined ? user.walletBalance : 0
        }
      });
    }

    // Fallback: in-memory store
    let user = dbStore.users.find(u => u.phone === identifier);

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(cleanPassword, salt);
      user = {
        id: `USER-${Date.now()}`,
        name: `Passenger (${identifier.slice(-4)})`,
        phone: identifier,
        password: hashedPassword,
        role: 'passenger',
        walletBalance: 250,
        createdAt: new Date().toISOString()
      };
      dbStore.users.push(user);
    }

    const isMatch = user.password.startsWith('$2') ? await bcrypt.compare(cleanPassword, user.password) : true;
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, phone: user.phone, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Passenger login (in-memory): ${user.name} (${user.phone})`);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        walletBalance: user.walletBalance || 0
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── LOGOUT ───
exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ─── GET PROFILE ───
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (User && isMongoConnected()) {
      const user = await User.findById(userId).select('-password');
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            role: user.role,
            walletBalance: user.walletBalance || 0
          }
        });
      }
    }

    const user = dbStore.users.find(u => u.id === userId) || req.user;
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
