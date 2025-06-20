
// import React, { useState } from 'react';
// import axios from 'axios';

// const PaymentForm = () => {
//   const [product] = useState({
//     name: 'Sample Product',
//     price: 500,
//     img: 'https://images.pexels.com/photos/3490360/pexels-photo-3490360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
//   });

//   const handlePayment = async () => {
//     try {
//       // Fetch Razorpay key
//       const { data: { key } } = await axios.get('http://localhost:5000/api/payment/getkey');

//       // Create order
//       const { data: { order } } = await axios.post('http://localhost:5000/api/payment/create-order', {
//         amount: product.price,
//       });

//       // Razorpay options
//       const options = {
//         key,
//         amount: order.amount,
//         currency: 'INR',
//         name: 'Basic Payment App',
//         description: 'Purchase of ' + product.name,
//         image: product.img,
//         order_id: order.id,
//         handler: async (response) => {
//           try {
//             const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             });
//             alert(verifyResponse.data.message);
//           } catch (error) {
//             console.error('Payment verification failed:', error);
//             alert('Payment verification failed');
//           }
//         },
//         prefill: {
//           name: 'John Doe',
//           email: 'john.doe@example.com',
//           contact: '9999999999',
//         },
//         theme: {
//           color: '#3399cc',
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment initiation failed:', error);
//       alert('Payment initiation failed');
//     }
//   };

//   return (
//     <div className="product-container">
//       <img src={product.img} alt="Product" className="product-img" />
//       <h2>{product.name}</h2>
//       <p>Price: ₹{product.price}</p>
//       <button className="buy-btn" onClick={handlePayment}>
//         Buy Now
//       </button>
//     </div>
//   );
// };

// export default PaymentForm;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Optional: Customize toast styles globally


const PaymentForm = () => {
  const [product] = useState({
    name: 'Sample Product',
    price: 500, // Amount in INR
    img: 'https://images.pexels.com/photos/3490360/pexels-photo-3490360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  });

  const handlePayment = async () => {
    if (!product.price || isNaN(product.price) || product.price <= 0) {
      toast.error('Invalid product price');
      return;
    }

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

      const { data: { key } } = await axios.get(`${API_BASE_URL}/api/payment/getkey`);
      if (!key) throw new Error('Razorpay key not received');

      const { data: { order } } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
        amount: product.price, // Send amount in INR (e.g., 500)
      });
      if (!order?.id) throw new Error('Failed to create order');

      const options = {
        key,
        amount: order.amount, // Razorpay expects amount in paise (e.g., 50000)
        currency: 'INR',
        name: 'Basic Payment App',
        description: `Purchase of ${product.name}`,
        image: product.img,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success(verifyResponse.data.message);
          } catch (error) {
            console.error('Payment verification failed:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Payment verification failed');
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

      if (!window.Razorpay) {
        toast.error('Razorpay SDK not loaded');
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error.message);
      toast.error(error.message || 'Payment initiation failed');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f7fa',
        padding: '20px',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        className="product-container"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <img
          src={product.img}
          alt="Product"
          className="product-img"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        />
        <h2
          style={{
            fontSize: '24px',
            color: '#333',
            margin: '0 0 10px',
            fontWeight: '600',
          }}
        >
          {product.name}
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: '#555',
            margin: '0 0 20px',
            fontWeight: '400',
          }}
        >
          Price: ₹{product.price}
        </p>
        <button
          className="buy-btn"
          onClick={handlePayment}
          style={{
            backgroundColor: '#3399cc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            width: '100%',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#287aa3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3399cc')}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;