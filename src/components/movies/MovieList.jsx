import React, { useState, useEffect } from 'react';
import { getAllMovies } from '../../api/movies';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("movie list ")
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data.content);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Movie List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}> {movie.title} {movie.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default MovieList;