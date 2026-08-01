const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  walletId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['TOPUP', 'DEBIT_TICKET', 'REFUND'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    default: 'RAZORPAY_ONLINE'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'SUCCESS'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
