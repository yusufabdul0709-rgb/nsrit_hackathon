const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/profile', authenticateJWT, authController.getProfile);

module.exports = router;
