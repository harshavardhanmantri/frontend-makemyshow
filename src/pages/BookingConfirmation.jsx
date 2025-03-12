import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChair, FaCheck, FaDownload, FaEnvelope } from 'react-icons/fa';
import useBooking from '../hooks/useBooking';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getBookingById } from '../api/booking';
import '../styles/pages/booking-confirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingDetails, setBookingDetails, resetBooking } = useBooking();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      // If booking details are already in context, use them
      if (bookingDetails && bookingDetails.id === parseInt(bookingId)) {
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from API
      try {
        setLoading(true);
        const fetchedBooking = await getBookingById(bookingId);
        setBookingDetails(fetchedBooking);
        setLoading(false);
      } catch (err) {
        setError('Failed to load booking details. Please try again.');
        setLoading(false);
        console.error('Error fetching booking details:', err);
      }
    };
    
    fetchBookingDetails();
    
    // Cleanup function - reset booking when navigating away
    return () => {
      resetBooking();
    };
  }, [bookingId, bookingDetails, setBookingDetails, resetBooking]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !bookingDetails) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Booking not found'}</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="booking-confirmation-page">
      <div className="container">
        <div className="confirmation-container">
          <div className="confirmation-header">
            <div className="success-icon">
              <FaCheck />
            </div>
            
            <h1>Booking Confirmed!</h1>
            
            <p className="booking-id">
              <FaTicketAlt />
              <span>Booking ID: {bookingDetails.bookingNumber}</span>
            </p>
            
            <p className="confirmation-message">
              Your booking has been confirmed and the tickets have been sent to your email.
            </p>
          </div>
          
          <div className="ticket-details-container">
            <div className="movie-details">
              <h2>{bookingDetails.movieTitle}</h2>
              
              <div className="meta-details">
                <div className="meta-item">
                  <FaMapMarkerAlt />
                  <span>{bookingDetails.theaterName}, {bookingDetails.screenName}</span>
                </div>
                
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{formatDate(bookingDetails.showTime)}</span>
                </div>
                
                <div className="meta-item">
                  <FaClock />
                  <span>{formatTime(bookingDetails.showTime)}</span>
                </div>
                
                <div className="meta-item">
                  <FaChair />
                  <span>Seats: {bookingDetails.seats.join(', ')}</span>
                </div>
              </div>
            </div>
            
            <div className="ticket-actions">
              <button className="btn btn-outline action-btn">
                <FaDownload /> Download Ticket
              </button>
              
              <button className="btn btn-outline action-btn">
                <FaEnvelope /> Email Ticket
              </button>
            </div>
            
            <div className="qr-container">
              <div className="qr-code">
                {/* In a real app, we would generate a QR code with the booking details */}
                <img src="/assets/images/placeholder-qr.png" alt="QR Code" />
              </div>
              <p>Scan this QR code at the theater entrance</p>
            </div>
          </div>
          
          <div className="payment-details">
            <h3>Payment Details</h3>
            
            <div className="payment-info">
              <div className="payment-item">
                <span>Payment Method</span>
                <span>{bookingDetails.payment?.paymentMethod.replace('_', ' ')}</span>
              </div>
              
              <div className="payment-item">
                <span>Amount Paid</span>
                <span>₹{bookingDetails.totalAmount}</span>
              </div>
              
              <div className="payment-item">
                <span>Transaction ID</span>
                <span>{bookingDetails.payment?.transactionId || 'N/A'}</span>
              </div>
              
              <div className="payment-item">
                <span>Payment Status</span>
                <span className="payment-status">
                  {bookingDetails.payment?.status || 'COMPLETED'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link to="/my-bookings" className="btn btn-outline">
              View All Bookings
            </Link>
            
            <Link to="/" className="btn btn-primary">
              Book Another Movie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;