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
<<<<<<< HEAD
    default: 'PENDING'
  },
  isApproved: {
    type: Boolean,
    default: false
=======
    default: 'VERIFIED'
>>>>>>> a8fa34e010060dd44d2595f0e95ac7d45f17bcd2
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
