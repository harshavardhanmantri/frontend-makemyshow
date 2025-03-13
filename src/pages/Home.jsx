import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import MovieSlider from '../components/movies/MovieSlider.jsx';
import MovieFilter from '../components/movies/MovieFilter.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { getAllMovies, getNowShowingMovies, getUpcomingMovies, searchMovies } from '../api/movies.js';
import { getAllCities } from '../api/theaters.js';

const Home = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch now showing movies
        const nowShowing = await getNowShowingMovies();
        setNowShowingMovies(nowShowing);
        
        // Fetch upcoming movies
        const upcoming = await getUpcomingMovies();
        setUpcomingMovies(upcoming);
        
        // Fetch cities
        // const citiesData = await getAllCities();
        // setCities(citiesData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
        console.error('Error fetching movie data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchResults = await searchMovies(searchQuery, selectedGenre, selectedLanguage);
      setNowShowingMovies(searchResults);
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
      console.error('Error searching movies:', err);
    }
  };
  
  const clearFilters = async () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedLanguage('');
    
    try {
      setLoading(true);
      const nowShowing = await getNowShowingMovies();
      setNowShowingMovies(nowShowing);
      setLoading(false);
    } catch (err) {
      setError('Failed to reset movies. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Book Your Movie Tickets Online</h1>
            <p>Experience the best movies in theaters near you</p>
            
            <div className="movie-search">
              <MovieFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                onSearch={handleSearch}
                onClear={clearFilters}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Now Showing Section */}
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2><FaFilm /> Now Showing</h2>
            <Link to="/movies" className="view-all">View All</Link>
          </div>
          
          {error ? (
            <div className="error-message">{error}</div>
          ) : nowShowingMovies.length > 0 ? (
            <MovieSlider movies={nowShowingMovies} />
          ) : (
            <div className="no-movies">No movies found. Try adjusting your filters.</div>
          )}
        </div>
      </section>
      
      {/* Coming Soon Section */}
      <section className="movie-section">
        <div className="container">
          <div className="section-header">
            <h2><FaCalendarAlt /> Coming Soon</h2>
            <Link to="/movies?filter=upcoming" className="view-all">View All</Link>
          </div>
          
          {upcomingMovies.length > 0 ? (
            <MovieSlider movies={upcomingMovies} />
          ) : (
            <div className="no-movies">No upcoming movies available.</div>
          )}
        </div>
      </section>
      
      {/* Cities Section */}
      <section className="cities-section">
        <div className="container">
          <div className="section-header">
            <h2><FaMapMarkerAlt /> Explore Cities</h2>
          </div>
          
          <div className="cities-grid">
            {cities.map((city, index) => (
              <Link 
                to={`/theaters?city=${city}`} 
                className="city-card" 
                key={index}
              >
                <div className="city-name">{city}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Promotions Section */}
      <section className="promotions-section">
        <div className="container">
          <div className="promotion-card">
            <div className="promotion-content">
              <h3>Refer Friends & Earn Rewards</h3>
              <p>Get exclusive discounts when you refer friends to BookShow.</p>
              <button className="btn btn-primary">Learn More</button>
            </div>
            <div className="promotion-image">
              {/* Placeholder for promotion image */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;