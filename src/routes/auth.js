const express = require('express');
const { register } = require('../controllers/authControllers');
const router = express.Router();

// Register Route
router.post('/register', register);

module.exports = router;

