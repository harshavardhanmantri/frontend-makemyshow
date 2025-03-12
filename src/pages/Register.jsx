import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserPlus, FaTheaterMasks } from 'react-icons/fa';
import { registerCustomer, registerTheaterOwner } from '../api/auth.js';
import '../styles/components/auth.css';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()    
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
    
  accountType: Yup.string()
    .oneOf(['customer', 'theater-owner'], 'Please select a valid account type')
    .required('Account type is required')
});
const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      const { confirmPassword, accountType, ...userData } = values;
      
      if (accountType === 'customer') {
        await registerCustomer(userData);
      } else if (accountType === 'theater-owner') {
        await registerTheaterOwner(userData);
      }
      
      setSuccess(true);
      
      // Redirect to OTP verification page
      setTimeout(() => {
        navigate('/verify-email', { state: { email: values.email }});
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card register-card">
            <div className="auth-header">
              <h2><FaUserPlus /> Create a New Account</h2>
              <p>Join BookShow and start booking movie tickets!</p>
            </div>
            
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}
            
            {success && (
              <div className="auth-success">
                Registration successful! Redirecting to verification page...
              </div>
            )}
            
            <Formik
              initialValues={{
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
                accountType: 'customer'
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => (
                <Form className="auth-form">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      <FaUser /> Full Name
                    </label>
                    <Field
                      type="text"
                      name="fullName"
                      id="fullName"
                      className="form-control"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="fullName" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope /> Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <FaLock /> Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="Create a password"
                    />
                    <ErrorMessage name="password" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock /> Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      <FaPhone /> Phone Number
                    </label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="form-control"
                      placeholder="Enter your 10-digit phone number"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <div className="account-type-selector">
                      <label className={`account-type ${values.accountType === 'customer' ? 'selected' : ''}`}>
                        <Field
                          type="radio"
                          name="accountType"
                          value="customer"
                          className="account-type-radio"
                        />
                        <FaUser />
                        <span>Customer</span>
                      </label>
                      
                      <label className={`account-type ${values.accountType === 'theater-owner' ? 'selected' : ''}`}>
                        <Field
                          type="radio"
                          name="accountType"
                          value="theater-owner"
                          className="account-type-radio"
                        />
                        <FaTheaterMasks />
                        <span>Theater Owner</span>
                      </label>
                    </div>
                    <ErrorMessage name="accountType" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <div className="terms-checkbox">
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        id="acceptTerms"
                      />
                      <label htmlFor="acceptTerms">
                        I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary auth-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Register;