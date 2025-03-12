import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaLanguage, FaTag, FaTicketAlt, FaPlay } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { getMovieById } from '../api/movies.js';
import '../styles/pages/movie-details.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
    useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(id);
        setMovie(movieData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        setLoading(false);
        console.error('Error fetching movie:', err);
      }
    };
    
    fetchMovie();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !movie) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Movie not found'}</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="movie-details-page">
      <div className="movie-hero" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="movie-hero-content">
            <div className="movie-poster">
              <img src={movie.posterUrl || '/assets/images/placeholder.jpg'} alt={movie.title} />
            </div>
            
            <div className="movie-info">
              <h1>{movie.title}</h1>
              
              <div className="movie-meta">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <div className="meta-item">
                  <FaClock />
                  <span>{movie.durationMinutes} mins</span>
                </div>
                
                <div className="meta-item">
                  <FaLanguage />
                  <span>{movie.language}</span>
                </div>
                
                <div className="meta-item">
                  <FaTag />
                  <span>{movie.genre}</span>
                </div>
              </div>
              
              <div className="movie-actions">
                <Link to={`/movies/${id}/theaters`} className="btn btn-primary action-btn">
                  <FaTicketAlt /> Book Tickets
                </Link>
                
                {movie.trailerUrl && (
                  <a 
                    href={movie.trailerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline action-btn"
                  >
                    <FaPlay /> Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="movie-content">
        <div className="container">
          <div className="movie-section">
            <h2>Synopsis</h2>
            <p>{movie.description || 'No description available for this movie.'}</p>
          </div>
          
          {/* You can add more sections here like cast, crew, reviews, etc. */}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;