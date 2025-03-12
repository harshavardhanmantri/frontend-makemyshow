import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaFilm, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  getAllMoviesForAdmin, 
  addMovie, 
  updateMovie, 
  deleteMovie 
} from '../../api/movies';
import '../../styles/pages/admin.css';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  
  const fetchMovies = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getAllMoviesForAdmin(page, 10);
      setMovies(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      setLoading(false);
      console.error('Error fetching movies:', err);
    }
  };
  
  useEffect(() => {
    fetchMovies();
  }, []);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // In a real app, you would implement debounce and search functionality
  };
  
  const handleAddMovie = (values, { setSubmitting, resetForm }) => {
    const addNewMovie = async () => {
      try {
        setLoading(true);
        await addMovie(values);
        resetForm();
        setShowAddModal(false);
        fetchMovies();
      } catch (err) {
        setError('Failed to add movie. Please try again.');
        setLoading(false);
        console.error('Error adding movie:', err);
      } finally {
        setSubmitting(false);
      }
    };
    
    addNewMovie();
  };
  
  const handleEditMovie = (movie) => {
    setEditMovie(movie);
    setShowAddModal(true);
  };
  
  const handleUpdateMovie = (values, { setSubmitting }) => {
    const updateExistingMovie = async () => {
      try {
        setLoading(true);
        await updateMovie(editMovie.id, values);
        setShowAddModal(false);
        setEditMovie(null);
        fetchMovies();
      } catch (err) {
        setError('Failed to update movie. Please try again.');
        setLoading(false);
        console.error('Error updating movie:', err);
      } finally {
        setSubmitting(false);
      }
    };
    
    updateExistingMovie();
  };
  
  const handleDeleteMovie = (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }
    
    const deleteExistingMovie = async () => {
      try {
        setLoading(true);
        await deleteMovie(movieId);
        fetchMovies();
      } catch (err) {
        setError('Failed to delete movie. Please try again.');
        setLoading(false);
        console.error('Error deleting movie:', err);
      }
    };
    
    deleteExistingMovie();
  };
  
  const MovieSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().max(1000, 'Description must be less than 1000 characters'),
    language: Yup.string().required('Language is required'),
    genre: Yup.string().required('Genre is required'),
    durationMinutes: Yup.number()
      .required('Duration is required')
      .positive('Duration must be positive'),
    releaseDate: Yup.date().required('Release date is required'),
    posterUrl: Yup.string().url('Poster URL must be a valid URL'),
    trailerUrl: Yup.string().url('Trailer URL must be a valid URL')
  });
  
  const renderPagination = () => {
    return (
      <div className="pagination">
        <button 
          className="pagination-btn"
          disabled={currentPage === 0}
          onClick={() => fetchMovies(currentPage - 1)}
        >
          Previous
        </button>
        
        <span className="pagination-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        
        <button 
          className="pagination-btn"
          disabled={currentPage === totalPages - 1}
          onClick={() => fetchMovies(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };
  
  if (loading && !movies.length) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="admin-header">
            <h1><FaFilm /> Movies Management</h1>
            
            <div className="admin-actions">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button className="search-btn">
                  <FaSearch />
                </button>
              </div>
              
              <button 
                className="btn btn-primary add-btn"
                onClick={() => {
                  setEditMovie(null);
                  setShowAddModal(true);
                }}
              >
                <FaPlus /> Add Movie
              </button>
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Duration</th>
                  <th>Release Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.language}</td>
                    <td>{movie.durationMinutes} mins</td>
                    <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${movie.active ? 'active' : 'inactive'}`}>
                        {movie.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditMovie(movie)}
                        >
                          <FaEdit />
                        </button>
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {renderPagination()}
        </div>
      </div>
      
      {/* Add/Edit Movie Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditMovie(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <Formik
              initialValues={editMovie ? {
                title: editMovie.title,
                description: editMovie.description || '',
                language: editMovie.language || '',
                genre: editMovie.genre,
                durationMinutes: editMovie.durationMinutes,
                releaseDate: editMovie.releaseDate ? editMovie.releaseDate.substring(0, 10) : '',
                posterUrl: editMovie.posterUrl || '',
                trailerUrl: editMovie.trailerUrl || ''
              } : {
                title: '',
                description: '',
                language: '',
                genre: '',
                durationMinutes: '',
                releaseDate: '',
                posterUrl: '',
                trailerUrl: ''
              }}
              validationSchema={MovieSchema}
              onSubmit={editMovie ? handleUpdateMovie : handleAddMovie}
            >
              {({ isSubmitting }) => (
                <Form className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <Field type="text" name="title" className="form-control" />
                      <ErrorMessage name="title" component="div" className="form-error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="language">Language</label>
                      <Field type="text" name="language" className="form-control" />
                      <ErrorMessage name="language" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <Field as="textarea" name="description" className="form-control" rows="3" />
                    <ErrorMessage name="description" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="genre">Genre</label>
                      <Field type="text" name="genre" className="form-control" />
                      <ErrorMessage name="genre" component="div" className="form-error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="durationMinutes">Duration (mins)</label>
                      <Field type="number" name="durationMinutes" className="form-control" />
                      <ErrorMessage name="durationMinutes" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="releaseDate">Release Date</label>
                      <Field type="date" name="releaseDate" className="form-control" />
                      <ErrorMessage name="releaseDate" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="posterUrl">Poster URL</label>
                    <Field type="text" name="posterUrl" className="form-control" />
                    <ErrorMessage name="posterUrl" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="trailerUrl">Trailer URL</label>
                    <Field type="text" name="trailerUrl" className="form-control" />
                    <ErrorMessage name="trailerUrl" component="div" className="form-error" />
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditMovie(null);
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editMovie ? 'Update' : 'Save')}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;