import React, { useState } from 'react';
import api from '../api/axiosConfig';


const OTPVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const requestOTP = async () => {
    try {
      console.log(email);
      const response = await api.post(`/auth/otp/send?email=${email}`);
      setMessage(response.data);
    } catch (error) {
      setMessage('Error requesting OTP');
    }
  };

  const verifyOTP = async () => {

    try {
      const response = await api.post(`/auth/verify-email?email=${email}&otp=${otp}`);
      setMessage(response.data);
    } catch (error) {
      setMessage('Error verifying OTP');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={requestOTP}>Request OTP</button>
      <br />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOTP}>Verify OTP</button>
      <p>{message}</p>
    </div>
  );
};

export default OTPVerification;