import React from 'react';
import '../../styles/components/booking.css';

const SeatLayout = ({ availableSeats, selectedSeats, bookedSeats, onSeatSelect }) => {
  // Group seats by row
  const seatsByRow = availableSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});
  
  // Sort rows
  const rows = Object.keys(seatsByRow).sort();
  
  const isSeatSelected = (seat) => {
    return selectedSeats.some(s => s.id === seat.id);
  };
  
  return (
    <div className="seat-layout">
      {rows.map(row => (
        <div key={row} className="seat-row">
          <div className="row-label">{row}</div>
          <div className="seats">
            {seatsByRow[row].map(seat => (
              <div
                key={seat.id}
                className={`seat ${seat.isBooked ? 'booked' : ''} ${isSeatSelected(seat) ? 'selected' : ''} ${seat.type.toLowerCase()}`}
                onClick={() => onSeatSelect(seat)}
                title={`${seat.row}${seat.number} - ${seat.type} - ₹${seat.price}`}
              >
                <span className="seat-number">{seat.number}</span>
              </div>
            ))}
          </div>
          <div className="row-label">{row}</div>
        </div>
      ))}
    </div>
  );
};

export default SeatLayout;