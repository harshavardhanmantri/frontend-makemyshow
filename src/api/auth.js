import api from './axiosConfig.js';

// User registration - customer role
const registerCustomer = async (userData) => {
  try {
    const response = await api.post('/auth/register/customer', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'An error occurred during registration',
    };
  }
};

// User registration - theater owner role
const registerTheaterOwner = async (userData) => {
  try {
    const response = await api.post('/auth/register/theater-owner', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'An error occurred during registration',
    };
  }
};

// User login
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, refreshToken, id, email, roles } = response.data;

    // Store tokens and user info in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify({ id, email, roles }));

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Login failed. Please check your credentials.',
    };
  }
};

// Logout - clear localStorage
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Verify email with OTP
const verifyEmail = async (email, otp) => {
  try {
    const response = await api.post(`/auth/verify-email?email=${email}&otp=${otp}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Email verification failed',
    };
  }
};

// Resend OTP
const resendOtp = async (email) => {
  try {
    const response = await api.post(`/auth/resend-otp?email=${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to resend OTP',
    };
  }
};

// Refresh token
const refreshToken = async (token) => {
  try {
    const response = await api.post(`/auth/refresh-token?refreshToken=${token}`);
    const { token: newToken, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return response.data;
  } catch (error) {
    // If refresh fails, force logout
    logout();
    throw error.response?.data || {
      message: 'Session expired. Please login again.',
    };
  }
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    return null;
  }
};

// Check if user has specific role
const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.roles.includes(role) || false;
};

export {
  registerCustomer,
  registerTheaterOwner,
  login,
  logout,
  verifyEmail,
  resendOtp,
  refreshToken,
  getCurrentUser,
  hasRole
};