const PaymentService = require('./PaymentService');

class PaymentController {
  static async generateQR(req, res) {
    try {
      const { ticketId, fare } = req.body;
      
      if (!ticketId || !fare) {
        return res.status(400).json({ error: 'Missing ticketId or fare' });
      }

      const qrResult = await PaymentService.generateQRPayment(ticketId, fare);
      
      return res.json(qrResult);
    } catch (error) {
      console.error('QR Generation Error:', error);
      return res.status(500).json({ error: 'Failed to generate QR', details: error.message });
    }
  }
}

module.exports = PaymentController;
