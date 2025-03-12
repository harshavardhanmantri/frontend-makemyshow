import api from './axiosConfig.js';

// Get all movies with pagination
const getAllMovies = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/public/movies?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch movies',
    };
  }
};

// Get movie details by ID
const getMovieById = async (id) => {
  try {
    const response = await api.get(`/public/movies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch movie details',
    };
  }
};

// Get now showing movies
const getNowShowingMovies = async () => {
  try {
    const response = await api.get('/public/movies/now-showing');
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch now showing movies',
    };
  }
};

// Get upcoming movies
const getUpcomingMovies = async () => {
  try {
    const response = await api.get('/public/movies/coming-soon');
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch upcoming movies',
    };
  }
};

// Search movies by title, genre, language
const searchMovies = async (title, genre, language) => {
  try {
    let url = '/public/search/movies?';
    
    if (title) url += `title=${encodeURIComponent(title)}&`;
    if (genre) url += `genre=${encodeURIComponent(genre)}&`;
    if (language) url += `language=${encodeURIComponent(language)}&`;
    
    // Remove trailing & if exists
    url = url.endsWith('&') ? url.slice(0, -1) : url;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to search movies',
    };
  }
};

// ADMIN ENDPOINTS

// Add a new movie (admin only)
const addMovie = async (movieData) => {
  try {
    const response = await api.post('/admin/movies', movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to add movie',
    };
  }
};

// Update a movie (admin only)
const updateMovie = async (id, movieData) => {
  try {
    const response = await api.put(`/admin/movies/${id}`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to update movie',
    };
  }
};

// Delete a movie (admin only)
const deleteMovie = async (id) => {
  try {
    const response = await api.delete(`/admin/movies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to delete movie',
    };
  }
};

// Get all movies for admin with pagination
const getAllMoviesForAdmin = async (page = 0, size = 10) => {
  try {
    const response = await api.get(`/admin/movies?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch movies',
    };
  }
};

export {
  getAllMovies,
  getMovieById,
  getNowShowingMovies,
  getUpcomingMovies,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMoviesForAdmin
};