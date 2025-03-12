import React, { createContext, useState } from 'react';

const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  // Selected movie
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Selected show
  const [selectedShow, setSelectedShow] = useState(null);
  
  // Selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Booking details
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Total amount
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Reset all booking data
  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setBookingDetails(null);
    setTotalAmount(0);
  };
  
  // Calculate total amount based on selected seats and show
  const calculateTotalAmount = () => {
    if (!selectedShow || selectedSeats.length === 0) {
      setTotalAmount(0);
      return;
    }
    
    let total = 0;
    selectedSeats.forEach(seat => {
      const seatPrice = selectedShow.seatPrices[seat.seatType] || 0;
      total += seatPrice;
    });
    
    setTotalAmount(total);
    return total;
  };
  
  // Add or remove a seat from selection
  const toggleSeatSelection = (seat) => {
    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSeatSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedShow,
        setSelectedShow,
        selectedSeats,
        setSelectedSeats,
        toggleSeatSelection,
        bookingDetails,
        setBookingDetails,
        totalAmount,
        calculateTotalAmount,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export {BookingContext};

export default BookingProvider;