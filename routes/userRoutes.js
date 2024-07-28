const express = require('express');
const { registerUser, loginUser, getUser, getAllUsers, authMiddleware } = require('../controllers/authHandler');
const router = express.Router();

router.get('/user', authMiddleware, getUser);
router.get('/users', authMiddleware, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
