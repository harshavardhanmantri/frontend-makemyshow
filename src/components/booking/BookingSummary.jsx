import React from 'react';
import { FaTicketAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';
// import '../../styles/components/booking.css';

const BookingSummary = ({ show, selectedSeats, totalAmount, onContinue }) => {
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
  
  // Group selected seats by type
  const seatsByType = selectedSeats.reduce((acc, seat) => {
    if (!acc[seat.type]) {
      acc[seat.type] = [];
    }
    acc[seat.type].push(seat);
    return acc;
  }, {});
  
  return (
    <div className="booking-summary">
      <h3>Booking Summary</h3>
      
      <div className="summary-section movie-info">
        <div className="movie-poster">
          <img src={show.movie.posterUrl || '/assets/images/placeholder.jpg'} alt={show.movie.title} />
        </div>
        
        <div className="movie-details">
          <h4>{show.movie.title}</h4>
          <p>{show.movie.language} • {show.movie.genre}</p>
          <p>{formatDate(show.startTime)}</p>
          <p>{formatTime(show.startTime)} • {show.screenName}</p>
          <p>{show.theater.name}</p>
        </div>
      </div>
      
      <div className="summary-section seats-info">
        <div className="summary-header">
          <FaChair />
          <h4>Selected Seats</h4>
        </div>
        
        {selectedSeats.length > 0 ? (
          <>
            <div className="selected-seats-list">
              {Object.entries(seatsByType).map(([type, seats]) => (
                <div key={type} className="seat-type-group">
                  <div className="seat-type">
                    {type} x {seats.length}
                  </div>
                  <div className="seat-ids">
                    {seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="ticket-count">
              <FaTicketAlt />
              <span>{selectedSeats.length} Ticket(s)</span>
            </div>
          </>
        ) : (
          <p className="no-seats">No seats selected</p>
        )}
      </div>
      
      <div className="summary-section payment-info">
        <div className="summary-header">
          <FaMoneyBillWave />
          <h4>Payment Summary</h4>
        </div>
        
        {selectedSeats.length > 0 ? (
          <div className="payment-breakdown">
            {Object.entries(seatsByType).map(([type, seats]) => (
              <div key={type} className="payment-item">
                <div className="item-name">
                  {type} Ticket x {seats.length}
                </div>
                <div className="item-price">
                  ₹{(seats[0].price * seats.length).toFixed(2)}
                </div>
              </div>
            ))}
            
            <div className="service-fee payment-item">
              <div className="item-name">
                Service Fee
              </div>
              <div className="item-price">
                ₹50.00
              </div>
            </div>
            
            <div className="total-amount">
              <div className="item-name">
                <strong>Total Amount</strong>
              </div>
              <div className="item-price">
                <strong>₹{(totalAmount + 50).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ) : (
          <p className="no-payment">Select seats to see payment details</p>
        )}
      </div>
      
      <button 
        className="btn btn-primary continue-btn" 
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default BookingSummary;