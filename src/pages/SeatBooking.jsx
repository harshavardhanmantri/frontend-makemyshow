import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SeatLayout from '../components/booking/SeatLayout';
import BookingSummary from '../components/booking/BookingSummary';
import useBooking from '../hooks/useBooking';
import { getShowById } from '../api/theaters';
// import '../styles/pages/seat-booking.css';

const SeatBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  
  const { 
    selectedSeats, 
    setSelectedSeats, 
    setSelectedShow, 
    setSelectedMovie,
    calculateTotalAmount,
    totalAmount
  } = useBooking();
  
  const [show, setShow] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get show details
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const showData = await getShowById(showId);
        
        setShow(showData);
        setSelectedShow(showData);
        setSelectedMovie(showData.movie);
        
        // Usually we would fetch already booked seats from the backend
        // But for now, let's simulate some booked seats
        const simulatedBookedSeats = [];
        const screenSeats = [];
        
        // We'll assume the backend would send us the screen's seats with availability info
        // For now, let's create a mock seat layout
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const seatsPerRow = 12;
        
        rows.forEach(row => {
          for (let i = 1; i <= seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            const isBooked = Math.random() < 0.3; // Randomly mark some seats as booked
            
            if (isBooked) {
              simulatedBookedSeats.push(seatId);
            }
            
            screenSeats.push({
              id: seatId,
              row: row,
              number: i,
              type: row < 'C' ? 'PREMIUM' : row < 'F' ? 'STANDARD' : 'RECLINER',
              price: showData.seatPrices[row < 'C' ? 'PREMIUM' : row < 'F' ? 'STANDARD' : 'RECLINER'],
              isBooked: isBooked
            });
          }
        });
        
        setAvailableSeats(screenSeats);
        setBookedSeats(simulatedBookedSeats);
        setLoading(false);
      } catch (err) {
        setError('Failed to load show details. Please try again.');
        setLoading(false);
        console.error('Error fetching show details:', err);
      }
    };
    
    fetchShowDetails();
  }, [showId, setSelectedMovie, setSelectedShow]);
  
  // Handle seat selection
  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  // Calculate total amount when selected seats change
  useEffect(() => {
    calculateTotalAmount();
  }, [selectedSeats, calculateTotalAmount]);
  
  // Handle continue to payment
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    navigate('/payment');
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !show) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Show not found'}</p>
          <button onClick={goBack} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    );
  }
  
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      weekday: 'short'
    });
  };
  
  return (
    <div className="seat-booking-page">
      <div className="container">
        {/* Show Info Bar */}
        <div className="show-info-bar">
          <button className="back-button" onClick={goBack}>
            <FaArrowLeft /> Back
          </button>
          
          <div className="show-details">
            <h1>{show.movie.title}</h1>
            
            <div className="show-meta">
              <div className="meta-item">
                <FaRegClock /> {formatDate(show.startTime)}, {formatTime(show.startTime)}
              </div>
              
              <div className="meta-item">
                <FaMapMarkerAlt /> {show.theater.name}, {show.screenName}
              </div>
            </div>
          </div>
        </div>
        
        <div className="booking-container">
          <div className="seat-selection-container">
            <h2>Select Seats</h2>
            
            <div className="seat-map-container">
              <div className="screen">Screen</div>
              
              <SeatLayout 
                availableSeats={availableSeats} 
                selectedSeats={selectedSeats} 
                bookedSeats={bookedSeats}
                onSeatSelect={handleSeatSelect} 
              />
              
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="seat-icon available"></div>
                  <span>Available</span>
                </div>
                
                <div className="legend-item">
                  <div className="seat-icon selected"></div>
                  <span>Selected</span>
                </div>
                
                <div className="legend-item">
                  <div className="seat-icon booked"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="booking-summary-container">
            <BookingSummary 
              show={show} 
              selectedSeats={selectedSeats} 
              totalAmount={totalAmount}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;