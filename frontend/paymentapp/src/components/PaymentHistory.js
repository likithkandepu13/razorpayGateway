import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${API_BASE_URL}/api/payment/history`);
        setPayments(data.payments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to fetch payment history');
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Roboto', sans-serif", color: '#333' }}>Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {payments.map((payment) => (
            <li
              key={payment._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p><strong>Order ID:</strong> {payment.razorpay_order_id}</p>
              <p><strong>Payment ID:</strong> {payment.razorpay_payment_id || 'N/A'}</p>
              <p><strong>Signature:</strong> {payment.razorpay_signature || 'N/A'}</p>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Status:</strong> {payment.status}</p>
              <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;