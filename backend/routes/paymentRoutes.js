const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const razorpayInstance = require('../config/razorpay');

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/getkey', (req, res) => {
  console.log('Fetching Razorpay key:', razorpayInstance.options.key_id);
  res.status(200).json({ key: razorpayInstance.options.key_id });
});

module.exports = router;