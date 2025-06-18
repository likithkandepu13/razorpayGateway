
import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [product] = useState({
    name: 'Sample Product',
    price: 500,
    img: 'https://images.pexels.com/photos/3490360/pexels-photo-3490360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  });

  const handlePayment = async () => {
    try {
      // Fetch Razorpay key
      const { data: { key } } = await axios.get('http://localhost:5000/api/payment/getkey');

      // Create order
      const { data: { order } } = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: product.price,
      });

      // Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Basic Payment App',
        description: 'Purchase of ' + product.name,
        image: product.img,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert(verifyResponse.data.message);
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed');
    }
  };

  return (
    <div className="product-container">
      <img src={product.img} alt="Product" className="product-img" />
      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>
      <button className="buy-btn" onClick={handlePayment}>
        Buy Now
      </button>
    </div>
  );
};

export default PaymentForm;