const express = require('express');
const { registerUser, loginUser } = require('../Controllers/authcontroller');
const authMiddleware = require('../Middleware/authmiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protect the following routes with authMiddleware
router.get('/user', authMiddleware, async (req, res) => {
  // Get user logic here
});

router.get('/users', authMiddleware, async (req, res) => {
  // Get all users logic here
});

module.exports = router;
