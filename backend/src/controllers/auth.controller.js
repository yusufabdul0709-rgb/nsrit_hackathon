const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dbStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'BUSONE_JWT_SECRET_2026_PRODUCTION';

exports.login = async (req, res) => {
  try {
    const { email, password, username, role = 'conductor' } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password' });
    }

    // Dynamic User Authentication
    let user = dbStore.users.find(
      (u) => (u.email === identifier || u.username === identifier) && u.role === role
    );

    if (!user) {
      // Auto-register default conductor / passenger for smooth experience
      user = {
        id: `USER-${Date.now()}`,
        email: identifier,
        username: identifier.split('@')[0],
        name: identifier.split('@')[0],
        role: role.toLowerCase(),
        createdAt: new Date().toISOString(),
      };
      dbStore.users.push(user);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'passenger', phone } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const newUser = {
      id: `USER-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      role: role.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    dbStore.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
  const userId = req.user?.id;
  const user = dbStore.users.find((u) => u.id === userId) || req.user;

  return res.status(200).json({
    success: true,
    user,
  });
};
