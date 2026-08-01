import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import * as Crypto from 'expo-crypto';

// For prototype purposes, we hardcode a pair of keys. 
// In a real system, the conductor app would securely store its own keypair,
// and have the public key of the passenger (or fetch it during sync).
const conductorKeyPair = nacl.sign.keyPair.fromSeed(
  naclUtil.decodeUTF8('apsrtc-conductor-secret-seed-1234').slice(0, 32)
);

/**
 * Generate the Offline Payment Request object for the QR code.
 */
export const generatePaymentRequest = (details: {
  amount: number;
  journey: string;
  passengerType: string;
}) => {
  const requestId = 'REQ-' + Crypto.randomUUID().substring(0, 8).toUpperCase();
  const nonce = Crypto.randomUUID();
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 60; // 60 seconds expiry
  
  const payload = {
    type: "APSRTC_OFFLINE_PAYMENT_REQUEST",
    version: 1,
    requestId,
    tripId: "TRIP-001",
    deviceReference: "ETM-5532",
    amount: details.amount,
    currency: "INR",
    journey: details.journey,
    passengerType: details.passengerType,
    issuedAt,
    expiresAt,
    nonce,
  };

  // Sign the payload
  const messageUint8 = naclUtil.decodeUTF8(JSON.stringify(payload));
  const signature = nacl.sign.detached(messageUint8, conductorKeyPair.secretKey);
  
  return {
    ...payload,
    signature: naclUtil.encodeBase64(signature)
  };
};

/**
 * Verifies and decrypts the incoming passenger token.
 * We simulate an Authenticated Encryption token from the Passenger app.
 */
export const verifyPassengerToken = (encryptedTokenBase64: string, expectedRequestId: string) => {
  try {
    // In a real system, the encrypted token will contain the nonce and the ciphertext.
    // For our prototype, let's assume it's just JSON wrapped in base64 if encryption fails for some reason, 
    // or we properly decrypt it.
    
    let token;
    if (encryptedTokenBase64.trim().startsWith('{')) {
      token = JSON.parse(encryptedTokenBase64);
    } else {
      const decoded = naclUtil.decodeBase64(encryptedTokenBase64);
      const jsonString = naclUtil.encodeUTF8(decoded);
      token = JSON.parse(jsonString);
    }

    // 1. Verify Request ID
    if (token.requestId !== expectedRequestId) {
      throw new Error(`Mismatch! Expected ${expectedRequestId} but got ${token.requestId}`);
    }

    // 2. Verify Expiry
    const now = Math.floor(Date.now() / 1000);
    if (token.expiresAt < now) {
      throw new Error('Passenger authorization token has expired.');
    }

    return {
      success: true,
      transactionId: token.transactionId,
      walletReference: token.walletReference,
      amount: token.amount,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Invalid passenger token',
    };
  }
};

/**
 * A mock function to generate a passenger token for testing purposes, 
 * since we don't have the separate Passenger App running.
 */
export const mockPassengerResponse = (request: any) => {
  const token = {
    version: 1,
    transactionId: 'TXN-' + Crypto.randomUUID().substring(0, 6).toUpperCase(),
    requestId: request.requestId,
    walletReference: 'PASSENGER_WALLET_8832',
    amount: request.amount,
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + 60,
    nonce: Crypto.randomUUID(),
    signature: 'mock_passenger_signature_xyz'
  };
  
  return naclUtil.encodeBase64(naclUtil.decodeUTF8(JSON.stringify(token)));
};
