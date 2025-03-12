import React from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import '../../styles/components/movies.css';

const MovieCard = ({ movie }) => {
  // Placeholder image if no poster URL is available
  const posterUrl = movie.posterUrl || '/assets/images/placeholder.jpg';
  
  return (
    <div className="movie-card">
      {/* <div className="movie-poster">
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-rating">{movie.rating}</div>
      </div> */}
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        
        <div className="movie-meta">
          <div className="movie-genre">{movie.genre}</div>
          <div className="movie-language">{movie.language}</div>
        </div>
        
        <div className="movie-details">
          <div className="movie-detail">
            <FaCalendarAlt />
            <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
          
          <div className="movie-detail">
            <FaClock />
            <span>{movie.durationMinutes} mins</span>
          </div>
        </div>
        
        <button className="btn btn-primary book-btn">Book Now</button>
      </div>
    </div>
  );
};

export default MovieCard;