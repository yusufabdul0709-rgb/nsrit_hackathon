const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const QRGenerator = require('./QRGenerator');
const prisma = new PrismaClient();

class PaymentService {
  static async generateQRPayment(ticketId, amount) {
    // Check if Razorpay is configured
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_API_SECRET;

    let orderId = `MOCK-ORDER-${Date.now()}`;
    
    if (key_id && key_secret && key_id !== 'your_razorpay_key_id') {
      try {
        const razorpay = new Razorpay({ key_id, key_secret });
        const options = {
          amount: amount * 100, // amount in smallest currency unit (paise)
          currency: "INR",
          receipt: `rcpt_${ticketId}`
        };
        const order = await razorpay.orders.create(options);
        orderId = order.id;
      } catch (error) {
        console.error("Razorpay order creation failed, falling back to mock.", error);
      }
    }

    const qrDetails = QRGenerator.generateDynamicQR(ticketId, amount);

    await prisma.payment.create({
      data: {
        ticketId,
        orderId,
        amount,
        status: 'PENDING'
      }
    });

    return {
      dynamicQR: qrDetails.qrData,
      encryptedPaymentToken: qrDetails.encryptedToken,
      expiry: qrDetails.expiryTime,
      orderId
    };
  }
}

module.exports = PaymentService;
