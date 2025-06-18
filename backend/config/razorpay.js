const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_FmhSMoagxjdqsj', // Replace with your actual Razorpay Test Mode key_id
  key_secret: 'Aw5vNsHur5csQLKhJssAiJzf', // Replace with your actual Razorpay Test Mode key_secret
});

module.exports = razorpayInstance;