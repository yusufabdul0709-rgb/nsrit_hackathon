const crypto = require('crypto');

const SECRET_KEY = process.env.QR_SECRET_KEY || 'BUSONE_SECRET_KEY_SUPER_SECURE_2026';

class QRService {
  /**
   * Generates a dynamic QR payload and signature for a specific trip and current stop.
   */
  static generateDynamicQR({ tripId, busNumber, currentStop, routeId }) {
    const timestamp = Date.now();
    const expiryTime = timestamp + 5 * 60 * 1000; // 5 minutes validity window

    const payloadObj = {
      tripId,
      busNumber,
      currentStop,
      routeId,
      timestamp,
      expiryTime,
    };

    const payloadString = JSON.stringify(payloadObj);
    
    // AES Encryption of payload
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(SECRET_KEY, 'salt', 32), Buffer.alloc(16, 0));
    let encryptedToken = cipher.update(payloadString, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    // HMAC Digital Signature
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(encryptedToken);
    const digitalSignature = hmac.digest('hex');

    return {
      tripId,
      busNumber,
      currentStop,
      routeId,
      timestamp,
      expiryTime,
      encryptedToken,
      digitalSignature,
      qrRawString: JSON.stringify({
        t: tripId,
        b: busNumber,
        cs: currentStop,
        r: routeId,
        token: encryptedToken,
        sig: digitalSignature,
        exp: expiryTime,
      }),
    };
  }

  /**
   * Verifies the authenticity, freshness, signature, and payload of a scanned QR token.
   */
  static verifyQR(qrDataStr) {
    try {
      let parsed;
      if (typeof qrDataStr === 'object') {
        parsed = qrDataStr;
      } else {
        parsed = JSON.parse(qrDataStr);
      }

      const { t: tripId, b: busNumber, cs: currentStop, r: routeId, token, sig, exp } = parsed;

      if (!token || !sig) {
        return { valid: false, reason: 'Missing encryption token or digital signature' };
      }

      // Verify HMAC Digital Signature
      const hmac = crypto.createHmac('sha256', SECRET_KEY);
      hmac.update(token);
      const expectedSignature = hmac.digest('hex');

      if (sig !== expectedSignature) {
        return { valid: false, reason: 'Invalid Digital Signature - Potential Tampering Detected' };
      }

      // Verify Expiration
      if (exp && Date.now() > exp) {
        return { valid: false, reason: 'QR Code has expired. Conductor will display refreshed QR.' };
      }

      // Decrypt Payload
      const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(SECRET_KEY, 'salt', 32), Buffer.alloc(16, 0));
      let decrypted = decipher.update(token, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const payload = JSON.parse(decrypted);

      return {
        valid: true,
        data: payload,
      };
    } catch (err) {
      return { valid: false, reason: `QR Verification Error: ${err.message}` };
    }
  }
}

module.exports = QRService;
