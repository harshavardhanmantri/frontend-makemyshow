import api from './axiosConfig.js';

// PUBLIC ENDPOINTS

// Get theaters by city
const getTheatersByCity = async (city) => {
  try {
    const response = await api.get(`/public/search/theaters?city=${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch theaters',
    };
  }
};

// Get all available cities
const getAllCities = async () => {
  try {
    const response = await api.get('/public/search/cities');
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch cities',
    };
  }
};

// Get shows for a movie on a specific date
const getShowsForMovie = async (movieId, date, city = null) => {
  try {
    console.log(movieId,date,city);
    let url = `/public/search/shows?movieId=${movieId}&date=${date}`;
    if (city) {
      url += `&city=${encodeURIComponent(city)}`;
    }
    
    const response = await api.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch shows',
    };
  }
};

// THEATER OWNER ENDPOINTS

// Get all theaters owned by the current user
const getMyTheaters = async () => {
  try {
    const response = await api.get('/theater/theaters');
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch your theaters',
    };
  }
};

// Get theater details by ID
const getTheaterById = async (id) => {
  try {
    const response = await api.get(`/theater/theaters/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch theater details',
    };
  }
};

// Add a new theater
const addTheater = async (theaterData) => {
  try {
    const response = await api.post('/theater/theaters', theaterData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to add theater',
    };
  }
};

// Update theater
const updateTheater = async (id, theaterData) => {
  try {
    const response = await api.put(`/theater/theaters/${id}`, theaterData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to update theater',
    };
  }
};

// Delete theater
const deleteTheater = async (id) => {
  try {
    const response = await api.delete(`/theater/theaters/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to delete theater',
    };
  }
};

// SCREEN MANAGEMENT

// Get all screens for a theater
const getScreensByTheater = async (theaterId) => {
  try {
    const response = await api.get(`/theater/screens/theater/${theaterId}`);
    console.log("hi")
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch screens',
    };
  }
};

// Get screen details by ID
const getScreenById = async (id) => {
  try {
    const response = await api.get(`/theater/screens/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch screen details',
    };
  }
};

// Add a new screen
const addScreen = async (screenData) => {
  try {
    const response = await api.post('/theater/screens', screenData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to add screen',
    };
  }
};

// Update screen
const updateScreen = async (id, screenData) => {
  try {
    const response = await api.put(`/theater/screens/${id}`, screenData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to update screen',
    };
  }
};

// Delete screen
const deleteScreen = async (id) => {
  try {
    const response = await api.delete(`/theater/screens/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to delete screen',
    };
  }
};

// SHOW MANAGEMENT

// Get all shows for a theater on a specific date
const getShowsByTheaterAndDate = async (theaterId, date) => {
  try {
    const response = await api.get(`/theater/shows/theater/${theaterId}?date=${date}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch shows',
    };
  }
};

// Get show details by ID
const getShowById = async (id) => {
  try {
    console.log(id)
    const response = await api.get(`/theater/shows/${id}`);
    console.log(re)
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to fetch show details',
    };
  }
};

// Add a new show
const addShow = async (showData) => {
  try {
    console.log(showData);
    const response = await api.post('/theater/shows', showData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to add show',
    };
  }
};

// Update show
const updateShow = async (id, showData) => {
  try {
    const response = await api.put(`/theater/shows/${id}`, showData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to update show',
    };
  }
};

// Delete show
const deleteShow = async (id) => {
  try {
    const response = await api.delete(`/theater/shows/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: 'Failed to delete show',
    };
  }
};

export {
  // Public endpoints
  getTheatersByCity,
  getAllCities,
  getShowsForMovie,
  
  // Theater owner endpoints
  getMyTheaters,
  getTheaterById,
  addTheater,
  updateTheater,
  deleteTheater,
  
  // Screen management
  getScreensByTheater,
  getScreenById,
  addScreen,
  updateScreen,
  deleteScreen,
  
  // Show management
  getShowsByTheaterAndDate,
  getShowById,
  addShow,
  updateShow,
  deleteShow
};