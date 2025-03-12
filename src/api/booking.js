import api from './axiosConfig.js';

// Create a new booking
const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/customer/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to create booking',
    };
  }
};

// Get all bookings for the current user
const getUserBookings = async () => {
  try {
    const response = await api.get('/customer/bookings');
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch bookings',
    };
  }
};

// Get booking details by ID
const getBookingById = async (id) => {
  try {
    const response = await api.get(`/customer/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch booking details',
    };
  }
};

// Cancel a booking
const cancelBooking = async (id) => {
  try {
    const response = await api.post(`/customer/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to cancel booking',
    };
  }
};

export {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};