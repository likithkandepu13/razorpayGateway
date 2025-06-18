const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log('Creating order with amount:', amount);
    if (!amount || isNaN(amount)) {
      throw new Error('Invalid amount provided');
    }
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);
    console.log('Order created successfully:', order);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayInstance.options.key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ success: false, error: 'Error verifying payment' });
  }
};