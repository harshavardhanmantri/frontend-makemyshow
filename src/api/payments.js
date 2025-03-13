import api from './axiosConfig.js';

// Process payment for a booking
const processPayment = async (paymentData) => {
  try {
    console.log(paymentData);
    const response = await api.post('/customer/payments/process', paymentData);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Payment processing failed',
    };
  }
};

// Get payment details by ID
const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/customer/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch payment details',
    };
  }
};

// Request refund for a payment
const requestRefund = async (id) => {
  try {
    const response = await api.post(`/customer/payments/${id}/refund`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to request refund',
    };
  }
};

export {
  processPayment,
  getPaymentById,
  requestRefund,
};