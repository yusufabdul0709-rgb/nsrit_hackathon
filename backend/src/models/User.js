const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['passenger', 'conductor', 'admin'],
    default: 'passenger'
  },
  walletId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  walletBalance: {
    type: Number,
    default: 0.0
  },
  kycStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'VERIFIED'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
