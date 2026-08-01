let nacl: any = null;
let naclUtil: any = null;

try {
  nacl = require('tweetnacl');
  naclUtil = require('tweetnacl-util');
} catch (e) {
  console.log('tweetnacl fallback active');
}

let conductorKeyPair: any = null;
let passengerKeyPair: any = null;

if (nacl && naclUtil) {
  try {
    conductorKeyPair = nacl.sign.keyPair.fromSeed(
      naclUtil.decodeUTF8('apsrtc-conductor-secret-seed-1234').slice(0, 32)
    );
    passengerKeyPair = nacl.sign.keyPair.fromSeed(
      naclUtil.decodeUTF8('apsrtc-passenger-secret-seed-5678').slice(0, 32)
    );
  } catch (e) {}
}

export const verifyPaymentRequest = (payloadString: string) => {
  try {
    const payload = JSON.parse(payloadString);
    if (!payload.signature) {
      return { success: true, request: payload };
    }

    if (nacl && naclUtil && conductorKeyPair) {
      const signatureUint8 = naclUtil.decodeBase64(payload.signature);
      const { signature, ...originalPayload } = payload;
      const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(originalPayload));

      const isValid = nacl.sign.detached.verify(
        messageUint8,
        signatureUint8,
        conductorKeyPair.publicKey
      );

      if (!isValid) {
        return { success: false, error: 'Invalid Conductor Signature!' };
      }

      return { success: true, request: originalPayload };
    }

    const { signature, ...originalPayload } = payload;
    return { success: true, request: originalPayload };
  } catch (error: any) {
    return { success: false, error: error.message || 'Invalid QR Format' };
  }
};

export const generatePassengerToken = (request: any) => {
  const token: any = {
    version: 1,
    transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
    requestId: request?.requestId || `REQ-${Date.now()}`,
    walletReference: 'PASSENGER_WALLET_8832',
    amount: request?.amount || 45.0,
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 60,
    nonce: `NONCE-${Date.now()}`
  };

  if (nacl && naclUtil && passengerKeyPair) {
    try {
      const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(token));
      const signature = nacl.sign.detached(messageUint8, passengerKeyPair.secretKey);
      token.signature = naclUtil.encodeBase64(signature);
      return naclUtil.encodeBase64(naclUtil.decodeUTF8(JSON.stringify(token)));
    } catch (e) {}
  }

  return JSON.stringify(token);
};
