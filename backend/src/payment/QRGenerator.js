const crypto = require('crypto');

class QRGenerator {
  static generateDynamicQR(ticketId, amount) {
    const timestamp = Date.now();
    const expiry = timestamp + 15 * 60 * 1000; // 15 mins expiry
    
    // Creating a custom payload, representing what would be encoded in the QR
    const payload = JSON.stringify({
      ticketId,
      amount,
      timestamp,
      expiry,
    });

    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET || 'default_secret')
      .update(payload)
      .digest('hex');

    // In a real environment, you'd generate a UPI Intent String or a Razorpay Payment Link
    const upiLink = `upi://pay?pa=apsrtc@razorpay&pn=APSRTC&tr=${ticketId}&am=${amount}&cu=INR`;
    
    return {
      qrData: upiLink,
      encryptedToken: signature,
      expiryTime: new Date(expiry).toISOString()
    };
  }
}

module.exports = QRGenerator;
