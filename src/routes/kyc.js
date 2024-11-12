const express = require('express');
const router = express.Router();

const { saveStoreOnwerInfo, saveStoreInfo, saveBankInfo, saveUploadDocs } = require('../controllers/kycControllers');

// Register Route
router.post('/store-owner-info', saveStoreOnwerInfo);
router.post('/store-info', saveStoreInfo);
router.post('/bank-info', saveBankInfo);
router.post('/upload-docs', saveUploadDocs);

module.exports = router;

