const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, deleteUserAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.delete('/me', protect, deleteUserAccount);

module.exports = router;
