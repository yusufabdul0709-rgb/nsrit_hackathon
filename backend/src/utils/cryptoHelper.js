const crypto = require('crypto');

/**
 * Verifies the ECDSA signature of a payload.
 * 
 * @param {string} payload The original string payload.
 * @param {string} signatureBase64 The base64 encoded signature from the offline token.
 * @param {string} publicKeyBase64 The base64 encoded public key of the user.
 * @returns {boolean} True if the signature is valid.
 */
function verifySignature(payload, signatureBase64, publicKeyBase64) {
    try {
        const publicKey = crypto.createPublicKey({
            key: Buffer.from(publicKeyBase64, 'base64'),
            format: 'der',
            type: 'spki'
        });

        const verify = crypto.createVerify('SHA256');
        verify.update(payload);
        verify.end();

        return verify.verify(publicKey, Buffer.from(signatureBase64, 'base64'));
    } catch (err) {
        console.error("Signature verification error:", err);
        return false;
    }
}

/**
 * Validates if the token timestamp is within limits to prevent replay.
 */
function validateTimestamp(timestamp, expiry) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= timestamp && currentTime <= expiry;
}

module.exports = {
    verifySignature,
    validateTimestamp
};
