import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
// import SeatSelection from '../components/customer/SeatSelection';
// import Checkout from '../components/customer/Checkout.';
import { createBooking } from '../api/booking.js';
import axios from '../api/axiosConfig.js'

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [currentStep, setCurrentStep] = useState('seat-selection');
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`/showtimes/${showId}`);
        setShowDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load show details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchShowDetails();
  }, [showId]);
  
  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };
  
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    
    setCurrentStep('checkout');
  };
  
  const handleConfirmBooking = async (paymentDetails) => {
    try {
      setLoading(true);
      
      const bookingData = {
        showtimeId: showId,
        userId: currentUser.id,
        seats: selectedSeats,
        paymentDetails
      };
      
      const response = await createBooking(bookingData);
      
      // Navigate to booking confirmation
      navigate(`/booking-confirmation/${response.id}`);
    } catch (error) {
      setError('Failed to complete booking. Please try again.');
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    if (currentStep === 'checkout') {
      setCurrentStep('seat-selection');
    } else {
      navigate(-1);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !showDetails) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p>{error || 'Show details not found'}</p>
            <button 
              onClick={() => navigate('/movies')}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Back to Movies
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <button 
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              Back
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 text-white p-4">
              <h1 className="text-xl font-bold">{showDetails.movie.title}</h1>
              <div className="flex items-center text-sm text-gray-300 mt-1">
                <span>{showDetails.theatre.name}</span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(showDetails.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {new Date(`2000-01-01T${showDetails.startTime}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {currentStep === 'seat-selection' ? (
                // <SeatSelection 
                //   showDetails={showDetails} 
                //   onSeatSelect={handleSeatSelect} 
                //   selectedSeats={selectedSeats}
                //   onProceed={handleProceedToCheckout}
                // />
                <p>Seat Selection</p>
              ) : (
                // <Checkout 
                //   showDetails={showDetails} 
                //   selectedSeats={selectedSeats}
                //   onConfirm={handleConfirmBooking}
                //   onBack={handleBack}
                // />
                <p>Checkout</p>

              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;