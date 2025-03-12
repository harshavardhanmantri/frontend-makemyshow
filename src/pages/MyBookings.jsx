import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChair, FaEye, FaDownload, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getUserBookings, cancelBooking } from '../api/booking';
import '../styles/pages/my-bookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await getUserBookings();
        setBookings(bookingsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your bookings. Please try again.');
        setLoading(false);
        console.error('Error fetching bookings:', err);
      }
    };
    
    fetchBookings();
  }, []);
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      setLoading(true);
      await cancelBooking(bookingId);
      
      // Refresh bookings
      const updatedBookings = await getUserBookings();
      setBookings(updatedBookings);
      setLoading(false);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      setLoading(false);
      console.error('Error cancelling booking:', err);
    }
  };
  
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
  
  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const showDate = new Date(booking.showTime);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return showDate > now && booking.status !== 'CANCELLED';
    } else if (activeTab === 'past') {
      return showDate < now && booking.status !== 'CANCELLED';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'CANCELLED';
    }
    
    return true;
  });
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header">
          <h1><FaTicketAlt /> My Bookings</h1>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="booking-tabs">
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          
          <button
            className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
        
        <div className="bookings-container">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>No {activeTab} bookings found.</p>
              {activeTab === 'upcoming' && (
                <Link to="/" className="btn btn-primary">Book a Movie</Link>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-title">
                    <h3>{booking.movieTitle}</h3>
                    <span className={`booking-status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="booking-id">
                    Booking ID: {booking.bookingNumber}
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>{formatDate(booking.showTime)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaClock />
                    <span>{formatTime(booking.showTime)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <span>{booking.theaterName}, {booking.screenName}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaChair />
                    <span>Seats: {booking.seats.join(', ')}</span>
                  </div>
                </div>
                
                <div className="booking-footer">
                  <div className="booking-amount">
                    <span>Amount:</span>
                    <strong>₹{booking.totalAmount}</strong>
                  </div>
                  
                  <div className="booking-actions">
                    <Link to={`/confirmation/${booking.id}`} className="btn btn-outline action-btn">
                      <FaEye /> View
                    </Link>
                    
                    <button className="btn btn-outline action-btn">
                      <FaDownload /> Ticket
                    </button>
                    
                    {activeTab === 'upcoming' && (
                      <button 
                        className="btn btn-danger action-btn"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;