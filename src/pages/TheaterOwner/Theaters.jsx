import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaTheaterMasks, FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import TheaterOwnerSidebar from  '../../components/theaters/TheaterOwnerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getMyTheaters, addTheater, updateTheater, deleteTheater } from '../../api/theaters';
import '../../styles/pages/theater-owner.css';

const OwnerTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTheater, setEditTheater] = useState(null);
  
  useEffect(() => {
    fetchTheaters();
  }, []);
  
  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await getMyTheaters();
      setTheaters(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load theaters. Please try again.');
      setLoading(false);
      console.error('Error fetching theaters:', err);
    }
  };
  
  const handleAddTheater = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      await addTheater(values);
      resetForm();
      setShowAddModal(false);
      await fetchTheaters();
    } catch (err) {
      setError('Failed to add theater. Please try again.');
      setLoading(false);
      console.error('Error adding theater:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditTheater = (theater) => {
    setEditTheater(theater);
    setShowAddModal(true);
  };
  
  const handleUpdateTheater = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await updateTheater(editTheater.id, values);
      setShowAddModal(false);
      setEditTheater(null);
      await fetchTheaters();
    } catch (err) {
      setError('Failed to update theater. Please try again.');
      setLoading(false);
      console.error('Error updating theater:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteTheater = async (theaterId) => {
    if (!window.confirm('Are you sure you want to delete this theater?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteTheater(theaterId);
      await fetchTheaters();
    } catch (err) {
      setError('Failed to delete theater. Please try again.');
      setLoading(false);
      console.error('Error deleting theater:', err);
    }
  };
  
  const TheaterSchema = Yup.object().shape({
    name: Yup.string().required('Theater name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
    contactNumber: Yup.string()
      .matches(/^\d{10}$/, 'Contact number must be 10 digits')
  });
  
  if (loading && theaters.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="theater-owner-page">
      <div className="theater-owner-container">
        <TheaterOwnerSidebar />
        
        <div className="theater-owner-content">
          <div className="theater-owner-header">
            <h1><FaTheaterMasks /> My Theaters</h1>
            
            <button 
              className="btn btn-primary add-btn"
              onClick={() => {
                setEditTheater(null);
                setShowAddModal(true);
              }}
            >
              <FaPlus /> Add Theater
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {theaters.length === 0 ? (
            <div className="empty-state">
              <FaTheaterMasks className="empty-icon" />
              <h2>No Theaters Found</h2>
              <p>You haven't added any theaters yet. Click the "Add Theater" button to get started.</p>
            </div>
          ) : (
            <div className="theaters-grid">
              {theaters.map(theater => (
                <div key={theater.id} className="theater-card">
                  <div className="theater-card-header">
                    <h2>{theater.name}</h2>
                    <div className="status-badge">{theater.active ? 'Active' : 'Inactive'}</div>
                  </div>
                  
                  <div className="theater-card-body">
                    <div className="theater-info">
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>{theater.address}, {theater.city}, {theater.state} - {theater.pincode}</span>
                      </div>
                      {theater.contactNumber && (
                        <div className="info-item">
                          <FaPhone />
                          <span>{theater.contactNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="theater-stats">
                      <div className="stat-item">
                        <span className="stat-value">{theater.screens?.length || 0}</span>
                        <span className="stat-label">Screens</span>
                      </div>
                      
                      <div className="stat-item">
                        <span className="stat-value">{theater.shows?.length || 0}</span>
                        <span className="stat-label">Shows</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="theater-card-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleEditTheater(theater)}
                    >
                      <FaEdit /> Edit
                    </button>
                    
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteTheater(theater.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Theater Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editTheater ? 'Edit Theater' : 'Add New Theater'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditTheater(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <Formik
              initialValues={editTheater ? {
                name: editTheater.name,
                address: editTheater.address,
                city: editTheater.city,
                state: editTheater.state,
                pincode: editTheater.pincode,
                contactNumber: editTheater.contactNumber || ''
              } : {
                name: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                contactNumber: ''
              }}
              validationSchema={TheaterSchema}
              onSubmit={editTheater ? handleUpdateTheater : handleAddTheater}
            >
              {({ isSubmitting }) => (
                <Form className="modal-form">
                  <div className="form-group">
                    <label htmlFor="name">Theater Name</label>
                    <Field type="text" name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <Field type="text" name="address" className="form-control" />
                    <ErrorMessage name="address" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <Field type="text" name="city" className="form-control" />
                      <ErrorMessage name="city" component="div" className="form-error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <Field type="text" name="state" className="form-control" />
                      <ErrorMessage name="state" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pincode">Pincode</label>
                      <Field type="text" name="pincode" className="form-control" />
                      <ErrorMessage name="pincode" component="div" className="form-error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="contactNumber">Contact Number</label>
                      <Field type="text" name="contactNumber" className="form-control" />
                      <ErrorMessage name="contactNumber" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditTheater(null);
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editTheater ? 'Update' : 'Save')}
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

export default OwnerTheaters;