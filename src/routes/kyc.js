const express = require('express');
const router = express.Router();

const { saveStoreOnwerInfo, saveStoreInfo } = require('../controllers/kycControllers');

// Register Route
router.post('/store-owner-info', saveStoreOnwerInfo);
router.post('/store-info', saveStoreInfo);

module.exports = router;

