import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ShowTimings from '../components/theaters/ShowTimings.jsx';
import { getMovieById } from '../api/movies.js';
import { getShowsForMovie, getAllCities } from '../api/theaters.js';
import '../styles/pages/theater-selection.css';
import api from '../api/axiosConfig.js';
import { createBooking } from '../api/booking.js';

const TheaterSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showsByTheater, setShowsByTheater] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // New state for selected seats
  const [availableSeats, setAvailableSeats] = useState([]); // New state for available seats
  const [bookingShowId,setBookingShowId]=useState("");

  // Generate next 7 dates for date selection
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const next7Days = getNext7Days();

  // Log movie ID and selected date whenever selectedDate changes
  useEffect(() => {
    // Log movie ID and selected date
    console.log('Movie ID:', id);
    console.log('Selected Date:', selectedDate.toLocaleDateString('en-CA')); // Use local date format

    // Make API call to fetch shows for the selected movie and date
    const fetchShowsForSelectedDate = async () => {
      try {
        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // Format date as YYYY-MM-DD in local timezone
        console.log(formattedDate, "date selected");

        // Fetch shows for the selected movie, date, and city
        const response = await api.get('/public/search/shows', {
          params: {
            movieId: id, // Movie ID from the URL
            date: formattedDate, // Selected date
            city: selectedCity, // Selected city
          },
        });

        // Check if response.data is defined and not empty
        if (response.data && response.data.length > 0) {
          // Log the ID of the first show in the response
          console.log('First show ID:', response.data[0].id);
          setBookingShowId(response.data[0].id);
          // Call the API to get available seats for the first show
          try {
            const seatData = await api.get(`/customer/bookings/shows/${response.data[0].id}/available-seats`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Add authentication token
              },
            });
            console.log('Available seats:', seatData.data);
            setAvailableSeats(seatData.data); // Set available seats state
          } catch (seatError) {
            console.error('Error fetching available seats:', seatError);
            setError('Failed to fetch available seats. Please try again.');
          }
        } else {
          console.log('No shows found for the selected date and city.');
        }
      } catch (err) {
        console.error('Error fetching shows for selected date:', err);
        setError('Failed to fetch shows for the selected date. Please try again.');
      }
    };

    fetchShowsForSelectedDate();
  }, [selectedDate, id, selectedCity]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch movie details
        const movieData = await getMovieById(id);
        setMovie(movieData);

        // Fetch cities
        const citiesData = await getAllCities();
        setCities(citiesData);
        console.log(citiesData);

        // Set default city if available
        if (citiesData.length > 0) {
          setSelectedCity(citiesData[0]);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
        console.error('Error fetching initial data:', err);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    const fetchShows = async () => {
      if (!selectedCity || !selectedDate) return;

      try {
        setLoading(true);

        // Format date for API
        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // Use local date format

        // Fetch shows for selected movie, date and city
        const showsData = await getShowsForMovie(id, formattedDate, selectedCity);

        // Group shows by theater
        const groupedShows = [];
        const theaters = {};

        showsData.forEach(show => {
          const theaterId = show.theater.id;

          if (!theaters[theaterId]) {
            theaters[theaterId] = {
              id: theaterId,
              name: show.theater.name,
              address: show.theater.address,
              city: show.theater.city,
              shows: []
            };
            groupedShows.push(theaters[theaterId]);
          }

          theaters[theaterId].shows.push(show);
        });

        setShowsByTheater(groupedShows);
        setLoading(false);
      } catch (err) {
        setError('Failed to load shows. Please try again.');
        setLoading(false);
        console.error('Error fetching shows:', err);
      }
    };

    fetchShows();
  }, [id, selectedCity, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleShowSelect = (showId) => {
    const addNewMovie = async () => {
      try {
        // await createBooking(showId, values);
      } catch (err) {
        setError('Failed to add movie. Please try again.');
        console.error('Error adding movie:', err);
      }
    };
  };

  const goBack = () => {
    navigate(-1);
  };

  // Submit handler for selected seats
  const handleSubmit = async () => {
    try {
      // Ensure a show is selected
      if (!showsByTheater.length || !showsByTheater[0].shows.length) {
        alert('No show selected. Please select a show first.');
        return;
      }
  
      // Get the show ID (assuming the first show is selected)
      const bookingShowId = showsByTheater[0].shows[0].id;
  
      // Prepare the request payload
      const bookingRequest = {
        showId: bookingShowId, // Send the show ID
        seatIds: selectedSeats,  // Send the selected seats
      };
  
      // Make the API call to create a booking
      console.log(bookingRequest);
      const response = await api.post('/customer/bookings', bookingRequest);
  
      console.log('Booking created successfully:', response.data);
  
      // Clear selected seats after submission
      setSelectedSeats([]);
      alert('Seats submitted successfully!');
    } catch (err) {
      console.error('Error submitting seats:', err);
      setError('Failed to submit seats. Please try again.');
    }
  };

  if (loading && !movie) {
    return <LoadingSpinner />;
  }

  return (
    <div className="theater-selection-page">
      <div className="container">
        {/* Movie Info Bar */}
        <div className="movie-info-bar">
          <button className="back-button" onClick={goBack}>
            <FaArrowLeft /> Back
          </button>

          {movie && (
            <div className="movie-brief">
              <h1>{movie.title}</h1>
              <div className="movie-brief-details">
                <span>{movie.language}</span>
                <span>•</span>
                <span>{movie.genre}</span>
                <span>•</span>
                <span>{movie.durationMinutes} mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Selection Filters */}
        <div className="selection-filters">
          <div className="date-selector">
            <div className="selector-label">
              <FaCalendar /> <span>Select Date</span>
            </div>
            <div className="date-pills">
              {next7Days.map((date, index) => (
                <button
                  key={index}
                  className={`date-pill ${date.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="date">{date.getDate()}</span>
                  <span className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="city-selector">
            <div className="selector-label">
              <FaMapMarkerAlt /> <span>Select City</span>
            </div>
            <select value={selectedCity} onChange={handleCityChange}>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Theaters List */}
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : showsByTheater.length > 0 ? (
          <div className="theaters-list">
            {showsByTheater.map(theater => (
              <div key={theater.id} className="theater-card">
                <div className="theater-info">
                  <h3>{theater.name}</h3>
                  <p className="theater-address">
                    <FaMapMarkerAlt /> {theater.address}, {theater.city}
                  </p>
                </div>

                {/* Seat Number Input Field */}
                <div className="seat-number-input">
                  <label htmlFor={`seat-number-${theater.id}`}>Seat Number</label>
                  <input
                    type="number"
                    id={`seat-number-${theater.id}`}
                    placeholder="Enter seat number"
                    value={theater.seatNumberInput || ''}
                    onChange={(e) => {
                      const updatedTheaters = showsByTheater.map(t =>
                        t.id === theater.id ? { ...t, seatNumberInput: e.target.value } : t
                      );
                      setShowsByTheater(updatedTheaters);
                    }}
                  />
                  <button
                    onClick={() => {
                      const seatNumber = parseInt(theater.seatNumberInput, 10);
                      if (!isNaN(seatNumber)) {
                        const updatedTheaters = showsByTheater.map(t =>
                          t.id === theater.id
                            ? {
                              ...t,
                              seatNumberInput: '' // Clear input field
                            }
                            : t
                        );
                        setShowsByTheater(updatedTheaters);
                        setSelectedSeats([...selectedSeats, seatNumber]); // Add seat number to the array
                      }
                    }}
                  >
                    Add Seat
                  </button>
                </div>

                {/* Display Added Seat Numbers */}
                {selectedSeats.length > 0 && (
                  <div className="added-seats">
                    <strong>Selected Seats:</strong>
                    <ul>
                      {selectedSeats.map((seat, index) => (
                        <li key={index}>{seat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Display Available Seats */}
                {availableSeats.length > 0 && (
                  <div className="available-seats">
                    <strong>Available Seats:</strong>
                    <ul>
                      {availableSeats.map((seat, index) => (
                        <li key={index}>
                        seat no {seat.id} {seat.rowName}-{seat.seatNumber} ({seat.seatType} - ${seat.price})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ShowTimings shows={theater.shows} onShowSelect={handleShowSelect} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-shows">
            <h3>No shows available</h3>
            <p>There are no shows for this movie on the selected date in {selectedCity}.</p>
            <p>Please try a different date or city.</p>
          </div>
        )}

        {/* Submit Button */}
        {selectedSeats.length > 0 && (
          <div className="submit-button-container">
            <button className="submit-button" onClick={handleSubmit}>
              Submit Selected Seats
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheaterSelection;