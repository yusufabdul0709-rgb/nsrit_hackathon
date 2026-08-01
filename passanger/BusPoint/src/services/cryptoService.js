import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import * as Crypto from 'expo-crypto';

// Conductor's public key (hardcoded for prototype, normally fetched dynamically or embedded)
const conductorKeyPair = nacl.sign.keyPair.fromSeed(
  naclUtil.decodeUTF8('apsrtc-conductor-secret-seed-1234').slice(0, 32)
);

// Passenger's own keypair
const passengerKeyPair = nacl.sign.keyPair.fromSeed(
  naclUtil.decodeUTF8('apsrtc-passenger-secret-seed-5678').slice(0, 32)
);

export const verifyPaymentRequest = (payloadString) => {
  try {
    const payload = JSON.parse(payloadString);
    if (!payload.signature) {
      throw new Error('No signature found on payment request.');
    }

    // Verify Conductor's signature
    const signatureUint8 = naclUtil.decodeBase64(payload.signature);
    
    // Create a copy without the signature to reconstruct original message
    const { signature, ...originalPayload } = payload;
    const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(originalPayload));

    const isValid = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      conductorKeyPair.publicKey
    );

    if (!isValid) {
      throw new Error('Invalid Conductor Signature! Possible spoofing attempt.');
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt < now) {
      throw new Error('Payment Request has expired.');
    }

    return { success: true, request: originalPayload };
  } catch (error) {
    return { success: false, error: error.message || 'Invalid QR Format' };
  }
};

export const generatePassengerToken = (request) => {
  const token = {
    version: 1,
    transactionId: 'TXN-' + Crypto.randomUUID().substring(0, 6).toUpperCase(),
    requestId: request.requestId,
    walletReference: 'PASSENGER_WALLET_8832', // In real app, load actual user ID
    amount: request.amount,
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 60,
    nonce: Crypto.randomUUID(),
  };
  
  const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(token));
  const signature = nacl.sign.detached(messageUint8, passengerKeyPair.secretKey);
  
  token.signature = naclUtil.encodeBase64(signature);

  return naclUtil.encodeBase64(naclUtil.decodeUTF8(JSON.stringify(token)));
};
