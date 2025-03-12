import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaTicketAlt, FaCreditCard } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import '../styles/pages/profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile validation schema
  const profileSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name is too long')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required')
  });
  
  // Password validation schema
  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });
  
  const handleProfileSubmit = (values, { setSubmitting }) => {
    // In a real app, this would call an API to update the user's profile
    console.log('Profile values:', values);
    setTimeout(() => {
      alert('Profile updated successfully!');
      setSubmitting(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (values, { setSubmitting, resetForm }) => {
    // In a real app, this would call an API to update the user's password
    console.log('Password values:', values);
    setTimeout(() => {
      alert('Password updated successfully!');
      setSubmitting(false);
      resetForm();
    }, 1000);
  };
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="user-profile">
              <div className="user-avatar">
                <span>{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="user-info">
                <h3>{user?.email || 'User'}</h3>
                <p>Customer</p>
                {console.log(user)}
              </div>
            </div>
            
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser /> Profile
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <FaLock /> Change Password
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <FaTicketAlt /> Booking History
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <FaCreditCard /> Payment Methods
              </button>
            </div>
          </div>
          
          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2><FaEdit /> Edit Profile</h2>
                
                <Formik
                  initialValues={{
                    fullName: 'John Doe', // Normally this would come from user profile
                    email: user?.email || '',
                    phoneNumber: '9876543210' // Example
                  }}
                  validationSchema={profileSchema}
                  onSubmit={handleProfileSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="profile-form">
                      <div className="form-group">
                        <label htmlFor="fullName" className="form-label">
                          <FaUser /> Full Name
                        </label>
                        <Field
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control"
                        />
                        <ErrorMessage name="fullName" component="div" className="form-error" />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <FaEnvelope /> Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          disabled={true} // Email can't be changed
                        />
                        <ErrorMessage name="email" component="div" className="form-error" />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">
                          <FaPhone /> Phone Number
                        </label>
                        <Field
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          className="form-control"
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="form-error" />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary profile-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div className="profile-section">
                <h2><FaLock /> Change Password</h2>
                
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }}
                  validationSchema={passwordSchema}
                  onSubmit={handlePasswordSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="profile-form">
                      <div className="form-group">
                        <label htmlFor="currentPassword" className="form-label">
                          Current Password
                        </label>
                        <Field
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className="form-control"
                        />
                        <ErrorMessage name="currentPassword" component="div" className="form-error" />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                          New Password
                        </label>
                        <Field
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className="form-control"
                        />
                        <ErrorMessage name="newPassword" component="div" className="form-error" />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm New Password
                        </label>
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="form-control"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary profile-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="profile-section">
                <h2><FaTicketAlt /> Booking History</h2>
                <p>This would show the booking history, but is already implemented in the MyBookings page.</p>
                <p>You can redirect users to <a href="/my-bookings">My Bookings</a> for detailed booking history.</p>
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div className="profile-section">
                <h2><FaCreditCard /> Payment Methods</h2>
                <p>This section would allow users to save and manage their payment methods.</p>
                
                <div className="saved-cards">
                  <h3>Saved Cards</h3>
                  
                  <div className="card-item">
                    <div className="card-info">
                      <div className="card-type">VISA ending in 4242</div>
                      <div className="card-expiry">Expires 12/25</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-danger btn-sm">Remove</button>
                    </div>
                  </div>
                  
                  <button className="btn btn-outline add-card-btn">
                    <FaCreditCard /> Add New Card
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;