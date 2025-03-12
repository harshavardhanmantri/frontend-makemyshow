import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../../styles/components/movies.css';

const MovieFilter = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  onSearch,
  onClear
}) => {
  // Sample genres and languages - in a real app, these would likely come from the API
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
    'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 
    'Science Fiction', 'Thriller', 'War'
  ];
  
  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Punjabi', 'Bengali'
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };
  
  return (
    <div className="movie-filter">
      <form onSubmit={handleSubmit}>
        <div className="filter-form">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </div>
          
          <div className="filter-selects">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-actions">
            <button 
              type="button" 
              className="btn btn-outline clear-btn"
              onClick={onClear}
            >
              <FaTimes /> Clear
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary search-submit"
            >
              <FaSearch /> Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MovieFilter;