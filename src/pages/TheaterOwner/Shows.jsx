import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaFilm, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaTheaterMasks, FaDesktop, FaDollarSign } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TheaterOwnerSidebar from  '../../components/theaters/TheaterOwnerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getMyTheaters, getScreensByTheater, getShowsByTheaterAndDate } from '../../api/theaters';
import { getAllMovies } from '../../api/movies';
import { addShow, updateShow, deleteShow } from '../../api/theaters';
import '../../styles/pages/theater-owner.css';

const OwnerShows = () => {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editShow, setEditShow] = useState(null);
  
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    if (selectedTheater && selectedDate) {
      fetchScreens(selectedTheater);
      fetchShows(selectedTheater, selectedDate);
    }
  }, [selectedTheater, selectedDate]);
  
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch theaters
      const theatersResponse = await getMyTheaters();
      setTheaters(theatersResponse);
      
      // Set first theater as selected if available
      if (theatersResponse.length > 0) {
        setSelectedTheater(theatersResponse[0].id);
      }
      
      // Fetch all movies
      const moviesResponse = await getAllMovies();
      setMovies(moviesResponse.content || moviesResponse);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load initial data. Please try again.');
      setLoading(false);
      console.error('Error fetching initial data:', err);
    }
  };
  
  const fetchScreens = async (theaterId) => {
    try {
      const response = await getScreensByTheater(theaterId);
      setScreens(response);
    } catch (err) {
      setError('Failed to load screens. Please try again.');
      console.error('Error fetching screens:', err);
    }
  };
  
  const fetchShows = async (theaterId, date) => {
    try {
      setLoading(true);
      
      // Format date to ISO format (YYYY-MM-DD)
      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await getShowsByTheaterAndDate(theaterId, formattedDate);
      setShows(response);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load shows. Please try again.');
      setLoading(false);
      console.error('Error fetching shows:', err);
    }
  };
  
  const handleAddShow = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      
      // Convert seatPrices from form to the format expected by the API
      const seatPrices = {};
      values.seatTypes.forEach(seatType => {
        seatPrices[seatType.type] = seatType.price;
      });
      
      // Create show object
      const showData = {
        movieId: values.movieId,
        screenId: values.screenId,
        startTime: values.startTime.toISOString(),
        seatPrices: seatPrices
      };
      console.log(showData);
      await addShow(showData);
      resetForm();
      setShowAddModal(false);
      
      // Refresh shows list
      fetchShows(selectedTheater, selectedDate);
    } catch (err) {
      setError('Failed to add show. Please try again.');
      setLoading(false);
      console.error('Error adding show:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditShow = (show) => {
    // Convert seatPrices to array format for form
    const seatTypes = Object.entries(show.seatPrices).map(([type, price]) => ({
      type,
      price
    }));
    
    // Convert startTime string to Date object
    const startTime = new Date(show.startTime);
    
    const formattedShow = {
      ...show,
      startTime,
      seatTypes
    };
    
    setEditShow(formattedShow);
    setShowAddModal(true);
  };
  
  const handleUpdateShow = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      
      // Convert seatPrices from form to the format expected by the API
      const seatPrices = {};
      values.seatTypes.forEach(seatType => {
        seatPrices[seatType.type] = seatType.price;
      });
      
      // Create show object
      const showData = {
        movieId: values.movieId,
        screenId: values.screenId,
        startTime: values.startTime.toISOString(),
        seatPrices: seatPrices
      };
      
      await updateShow(editShow.id, showData);
      setShowAddModal(false);
      setEditShow(null);
      
      // Refresh shows list
      fetchShows(selectedTheater, selectedDate);
    } catch (err) {
      setError('Failed to update show. Please try again.');
      setLoading(false);
      console.error('Error updating show:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Are you sure you want to delete this show?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteShow(showId);
      
      // Refresh shows list
      fetchShows(selectedTheater, selectedDate);
    } catch (err) {
      setError('Failed to delete show. Please try again.');
      setLoading(false);
      console.error('Error deleting show:', err);
    }
  };
  
  const handleTheaterChange = (e) => {
    setSelectedTheater(e.target.value);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const getScreenSeatTypes = (screenId) => {
    const screen = screens.find(s => s.id === parseInt(screenId));
    if (!screen) return [];
    
    // Get unique seat types from all rows
    const seatTypesSet = new Set();
    screen.seatRows.forEach(row => {
      row.seats.forEach(seat => {
        seatTypesSet.add(seat.seatType);
      });
    });
    
    return Array.from(seatTypesSet);
  };
  
  const formatTimeSlot = (startTime) => {
    const date = new Date(startTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Validation schema for add/edit show form
  const ShowSchema = Yup.object().shape({
    movieId: Yup.string().required('Movie is required'),
    screenId: Yup.string().required('Screen is required'),
    startTime: Yup.date().required('Start time is required'),
    seatTypes: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required('Seat type is required'),
        price: Yup.number()
          .required('Price is required')
          .positive('Price must be positive')
      })
    )
  });
  
  if (loading && theaters.length === 0) {
    return <LoadingSpinner />;
  }
  
  // If no theaters available, show message
  if (theaters.length === 0) {
    return (
      <div className="theater-owner-page">
        <div className="theater-owner-container">
          <TheaterOwnerSidebar />
          
          <div className="theater-owner-content">
            <div className="theater-owner-header">
              <h1><FaFilm /> Shows</h1>
            </div>
            
            <div className="empty-state">
              <FaTheaterMasks className="empty-icon" />
              <h2>No Theaters Found</h2>
              <p>You need to add a theater before you can manage shows. Please go to the Theaters page to add a theater first.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if selected theater has screens
  const hasScreens = screens.length > 0;
  
  return (
    <div className="theater-owner-page">
      <div className="theater-owner-container">
        <TheaterOwnerSidebar />
        
        <div className="theater-owner-content">
          <div className="theater-owner-header">
            <h1><FaFilm /> Shows</h1>
            
            <button 
              className="btn btn-primary add-btn"
              onClick={() => {
                setEditShow(null);
                setShowAddModal(true);
              }}
              disabled={!hasScreens}
            >
              <FaPlus /> Add Show
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="show-filters">
            <div className="theater-selector">
              <label htmlFor="theaterSelect">Select Theater:</label>
              <select 
                id="theaterSelect" 
                value={selectedTheater}
                onChange={handleTheaterChange}
                className="form-control"
              >
                {theaters.map(theater => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="date-selector">
              <label htmlFor="dateSelect">Select Date:</label>
              <div className="date-picker-container">
                <DatePicker 
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  minDate={new Date()}
                />
                <FaCalendarAlt className="date-picker-icon" />
              </div>
            </div>
          </div>
          
          {!hasScreens ? (
            <div className="empty-state">
              <FaDesktop className="empty-icon" />
              <h2>No Screens Found</h2>
              <p>You need to add screens to this theater before you can manage shows. Please go to the Screens page to add screens first.</p>
            </div>
          ) : shows.length === 0 ? (
            <div className="empty-state">
              <FaFilm className="empty-icon" />
              <h2>No Shows Found</h2>
              <p>There are no shows scheduled for this theater on the selected date. Click the "Add Show" button to schedule a show.</p>
            </div>
          ) : (
            <div className="shows-container">
              {screens.map(screen => {
                const screenShows = shows.filter(show => show.screenName === screen.name);
                
                if (screenShows.length === 0) return null;
                
                return (
                  <div key={screen.id} className="screen-shows">
                    <h2 className="screen-name">{screen.name}</h2>
                    
                    <div className="shows-timeline">
                      {screenShows.map(show => (
                        <div key={show.id} className="show-card">
                          <div className="show-time">
                            <span className="start-time">{formatTimeSlot(show.startTime)}</span>
                            <span className="end-time">{formatTimeSlot(show.endTime)}</span>
                          </div>
                          
                          <div className="show-details">
                            <h3 className="movie-title">{show.movie.title}</h3>
                            <div className="movie-meta">
                              <span>{show.movie.language}</span>
                              <span className="separator">•</span>
                              <span>{show.movie.durationMinutes} mins</span>
                            </div>
                          </div>
                          
                          <div className="show-actions">
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => handleEditShow(show)}
                            >
                              <FaEdit /> Edit
                            </button>
                            
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteShow(show.id)}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Show Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editShow ? 'Edit Show' : 'Add New Show'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditShow(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <Formik
              initialValues={editShow ? {
                movieId: editShow.movie.id.toString(),
                screenId: screens.find(s => s.name === editShow.screenName)?.id.toString() || '',
                startTime: editShow.startTime,
                seatTypes: editShow.seatTypes
              } : {
                movieId: '',
                screenId: '',
                startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
                seatTypes: []
              }}
              validationSchema={ShowSchema}
              onSubmit={editShow ? handleUpdateShow : handleAddShow}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => {
                // When screen changes, update seat types
                React.useEffect(() => {
                  if (values.screenId) {
                    const seatTypes = getScreenSeatTypes(values.screenId);
                    const existingPrices = values.seatTypes.reduce((acc, st) => {
                      acc[st.type] = st.price;
                      return acc;
                    }, {});
                    
                    const newSeatTypes = seatTypes.map(type => ({
                      type,
                      price: existingPrices[type] || 0
                    }));
                    
                    setFieldValue('seatTypes', newSeatTypes);
                  }
                }, [values.screenId]);
                
                return (
                  <Form className="modal-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="movieId">Movie</label>
                        <Field as="select" name="movieId" className="form-control">
                          <option value="">Select Movie</option>
                          {movies.map(movie => (
                            <option key={movie.id} value={movie.id.toString()}>
                              {movie.title}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="movieId" component="div" className="form-error" />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="screenId">Screen</label>
                        <Field as="select" name="screenId" className="form-control">
                          <option value="">Select Screen</option>
                          {screens.map(screen => (
                            <option key={screen.id} value={screen.id.toString()}>
                              {screen.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="screenId" component="div" className="form-error" />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="startTime">Start Time</label>
                      <div className="date-time-picker">
                        <DatePicker
                          selected={values.startTime}
                          onChange={date => setFieldValue('startTime', date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="form-control"
                          minDate={new Date()}
                        />
                        <FaClock className="date-picker-icon" />
                      </div>
                      <ErrorMessage name="startTime" component="div" className="form-error" />
                    </div>
                    
                    {values.seatTypes.length > 0 && (
                      <div className="form-group">
                        <label>Seat Prices</label>
                        <div className="seat-prices">
                          {values.seatTypes.map((seatType, index) => (
                            <div key={seatType.type} className="seat-price-input">
                              <label htmlFor={`seatTypes.${index}.price`}>
                                {seatType.type}
                              </label>
                              <div className="price-field">
                                <FaDollarSign className="price-icon" />
                                <Field
                                  type="number"
                                  name={`seatTypes.${index}.price`}
                                  className="form-control"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <ErrorMessage 
                                name={`seatTypes.${index}.price`} 
                                component="div" 
                                className="form-error" 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="modal-actions">
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => {
                          setShowAddModal(false);
                          setEditShow(null);
                        }}
                      >
                        Cancel
                      </button>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting || values.seatTypes.length === 0}
                      >
                        {isSubmitting ? 'Saving...' : (editShow ? 'Update' : 'Save')}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerShows;