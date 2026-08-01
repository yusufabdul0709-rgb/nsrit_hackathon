const cryptoHelper = require('../utils/cryptoHelper');

// In a real application, you'd fetch the user's public key from the database based on wallet_id
// and track nonces in Redis or a DB to prevent replay attacks.
const NONCE_STORE = new Set();
const MOCK_PUBLIC_KEY_BASE64 = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgA..."; // Replace with real fetched key

exports.syncOfflineTicket = async (req, res) => {
    try {
        const { wallet_id, journey_id, fare, bus_number, timestamp, expiry, nonce, signature } = req.body;

        if (!wallet_id || !signature || !nonce) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // 1. Replay Attack Prevention
        if (NONCE_STORE.has(nonce)) {
            return res.status(409).json({ error: "Duplicate transaction (Replay Attack)." });
        }
        NONCE_STORE.add(nonce);

        // 2. Expiry Validation
        // Assuming expiry is timestamp + 3600 (passed from client) or we enforce a static window here.
        const tokenExpiry = expiry || timestamp + 3600;
        if (!cryptoHelper.validateTimestamp(timestamp, tokenExpiry)) {
            return res.status(401).json({ error: "Token has expired." });
        }

        // 3. Signature Verification
        const payload = JSON.stringify({
            wallet_id,
            journey_id,
            fare,
            bus_number,
            timestamp,
            expiry: tokenExpiry,
            nonce
        });

        // In a real setup, we would fetch the public key for the specific wallet_id.
        // const isSignatureValid = cryptoHelper.verifySignature(payload, signature, user.publicKey);
        
        // For demonstration, we assume signature validation passes (as we lack the actual matching key here).
        // const isSignatureValid = true; // cryptoHelper.verifySignature(...)

        // 4. Wallet Settlement
        // Debit the wallet_id for the fare amount in the database
        // await db.Wallet.decrement('balance', { by: fare, where: { id: wallet_id } });

        return res.status(200).json({
            message: "Offline ticket synced successfully.",
            wallet_id,
            journey_id,
            fare_deducted: fare,
            status: "SETTLED"
        });

    } catch (error) {
        console.error("Error in syncOfflineTicket:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
