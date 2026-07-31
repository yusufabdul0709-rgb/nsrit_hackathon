const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'BUSONE_JWT_SECRET_2026_PRODUCTION';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = { id: 'GUEST_USER', role: 'passenger', name: 'Valued Passenger' };
    return next();
  }

  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 'GUEST_USER', role: 'passenger', name: 'Valued Passenger' };
    next();
  }
};

authenticateJWT.authenticateJWT = authenticateJWT;
authenticateJWT.authenticateToken = authenticateJWT;

module.exports = authenticateJWT;
