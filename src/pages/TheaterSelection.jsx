import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ShowTimings from '../components/theaters/ShowTimings.jsx';
import { getMovieById } from '../api/movies.js';
import { getShowsForMovie, getAllCities } from '../api/theaters.js';
import '../styles/pages/theater-selection.css';

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
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
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
    navigate(`/booking/${showId}`);
  };
  
  const goBack = () => {
    navigate(-1);
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
      </div>
    </div>
  );
};

export default TheaterSelection;