import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaDesktop, FaEdit, FaTrash, FaPlus, FaTheaterMasks, FaChair } from 'react-icons/fa';
import TheaterOwnerSidebar from  '../../components/theaters/TheaterOwnerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getMyTheaters, getScreensByTheater, addScreen, updateScreen, deleteScreen } from '../../api/theaters';
import '../../styles/pages/theater-owner.css';

const OwnerScreens = () => {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editScreen, setEditScreen] = useState(null);
  
  useEffect(() => {
    fetchTheaters();
  }, []);
  
  useEffect(() => {
    if (selectedTheater) {
      fetchScreens(selectedTheater);
    }
  }, [selectedTheater]);
  
  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await getMyTheaters();
      setTheaters(response);
      
      // Set the first theater as selected if available
      if (response.length > 0) {
        setSelectedTheater(response[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load theaters. Please try again.');
      setLoading(false);
      console.error('Error fetching theaters:', err);
    }
  };
  
  const fetchScreens = async (theaterId) => {
    try {
      setLoading(true);
      const response = await getScreensByTheater(theaterId);
      setScreens(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to load screens. Please try again.');
      setLoading(false);
      console.error('Error fetching screens:', err);
    }
  };
  
  const handleAddScreen = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      await addScreen(values);
      resetForm();
      setShowAddModal(false);
      await fetchScreens(selectedTheater);
    } catch (err) {
      setError('Failed to add screen. Please try again.');
      setLoading(false);
      console.error('Error adding screen:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditScreen = (screen) => {
    const formattedScreen = {
      ...screen,
      seatConfigs: screen.seatRows.map(row => ({
        rowName: row.rowName,
        seatCount: row.seats.length,
        seatType: row.seats[0].seatType // Assuming all seats in a row have the same type
      }))
    };
    
    setEditScreen(formattedScreen);
    setShowAddModal(true);
  };
  
  const handleUpdateScreen = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await updateScreen(editScreen.id, values);
      setShowAddModal(false);
      setEditScreen(null);
      await fetchScreens(selectedTheater);
    } catch (err) {
      setError('Failed to update screen. Please try again.');
      setLoading(false);
      console.error('Error updating screen:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteScreen = async (screenId) => {
    if (!window.confirm('Are you sure you want to delete this screen?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteScreen(screenId);
      await fetchScreens(selectedTheater);
    } catch (err) {
      setError('Failed to delete screen. Please try again.');
      setLoading(false);
      console.error('Error deleting screen:', err);
    }
  };
  
  const handleTheaterChange = (e) => {
    setSelectedTheater(e.target.value);
  };
  
  const ScreenSchema = Yup.object().shape({
    name: Yup.string().required('Screen name is required'),
    theaterId: Yup.string().required('Theater is required'),
    capacity: Yup.number()
      .required('Capacity is required')
      .min(1, 'Capacity must be at least 1'),
    seatConfigs: Yup.array().of(
      Yup.object().shape({
        rowName: Yup.string().required('Row name is required'),
        seatCount: Yup.number()
          .required('Seat count is required')
          .min(1, 'Seat count must be at least 1'),
        seatType: Yup.string().required('Seat type is required')
      })
    ).min(1, 'At least one seat configuration is required')
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
              <h1><FaDesktop /> Screens</h1>
            </div>
            
            <div className="empty-state">
              <FaTheaterMasks className="empty-icon" />
              <h2>No Theaters Found</h2>
              <p>You need to add a theater before you can manage screens. Please go to the Theaters page to add a theater first.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="theater-owner-page">
      <div className="theater-owner-container">
        <TheaterOwnerSidebar />
        
        <div className="theater-owner-content">
          <div className="theater-owner-header">
            <h1><FaDesktop /> Screens</h1>
            
            <button 
              className="btn btn-primary add-btn"
              onClick={() => {
                setEditScreen(null);
                setShowAddModal(true);
              }}
              disabled={!selectedTheater}
            >
              <FaPlus /> Add Screen
            </button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
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
          
          {screens.length === 0 ? (
            <div className="empty-state">
              <FaDesktop className="empty-icon" />
              <h2>No Screens Found</h2>
              <p>There are no screens for this theater yet. Click the "Add Screen" button to get started.</p>
            </div>
          ) : (
            <div className="screens-grid">
              {screens.map(screen => (
                <div key={screen.id} className="screen-card">
                  <div className="screen-card-header">
                    <h2>{screen.name}</h2>
                    <div className="status-badge">{screen.active ? 'Active' : 'Inactive'}</div>
                  </div>
                  
                  <div className="screen-card-body">
                    <div className="screen-info">
                      <div className="info-item">
                        <FaChair />
                        <span>Capacity: {screen.capacity} seats</span>
                      </div>
                    </div>
                    
                    <div className="seat-layout-preview">
                      {screen.seatRows.map((row, index) => (
                        <div key={index} className="seat-row-preview">
                          <span className="row-name">{row.rowName}</span>
                          <div className="seats-preview">
                            {Array.from({ length: Math.min(row.seats.length, 10) }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`seat-preview ${row.seats[i].seatType.toLowerCase()}`}
                              ></div>
                            ))}
                            {row.seats.length > 10 && (
                              <span className="more-seats">+{row.seats.length - 10}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="screen-card-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleEditScreen(screen)}
                    >
                      <FaEdit /> Edit
                    </button>
                    
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeleteScreen(screen.id)}
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
      
      {/* Add/Edit Screen Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editScreen ? 'Edit Screen' : 'Add New Screen'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditScreen(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <Formik
              initialValues={editScreen ? {
                name: editScreen.name,
                theaterId: editScreen.theaterId,
                capacity: editScreen.capacity,
                seatConfigs: editScreen.seatConfigs
              } : {
                name: '',
                theaterId: selectedTheater,
                capacity: '',
                seatConfigs: [
                  { rowName: 'A', seatCount: 10, seatType: 'STANDARD' }
                ]
              }}
              validationSchema={ScreenSchema}
              onSubmit={editScreen ? handleUpdateScreen : handleAddScreen}
            >
              {({ values, isSubmitting }) => (
                <Form className="modal-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Screen Name</label>
                      <Field type="text" name="name" className="form-control" />
                      <ErrorMessage name="name" component="div" className="form-error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="theaterId">Theater</label>
                      <Field as="select" name="theaterId" className="form-control">
                        {theaters.map(theater => (
                          <option key={theater.id} value={theater.id}>
                            {theater.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="theaterId" component="div" className="form-error" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <Field type="number" name="capacity" className="form-control" />
                    <ErrorMessage name="capacity" component="div" className="form-error" />
                  </div>
                  
                  <div className="form-group">
                    <label>Seat Configurations</label>
                    <FieldArray name="seatConfigs">
                      {({ remove, push }) => (
                        <div className="seat-configs">
                          {values.seatConfigs.map((_, index) => (
                            <div key={index} className="seat-config">
                              <div className="seat-config-row">
                                <div className="form-group">
                                  <label htmlFor={`seatConfigs.${index}.rowName`}>Row Name</label>
                                  <Field 
                                    type="text" 
                                    name={`seatConfigs.${index}.rowName`} 
                                    className="form-control" 
                                  />
                                  <ErrorMessage 
                                    name={`seatConfigs.${index}.rowName`} 
                                    component="div" 
                                    className="form-error" 
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label htmlFor={`seatConfigs.${index}.seatCount`}>Seat Count</label>
                                  <Field 
                                    type="number" 
                                    name={`seatConfigs.${index}.seatCount`} 
                                    className="form-control" 
                                  />
                                  <ErrorMessage 
                                    name={`seatConfigs.${index}.seatCount`} 
                                    component="div" 
                                    className="form-error" 
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label htmlFor={`seatConfigs.${index}.seatType`}>Seat Type</label>
                                  <Field 
                                    as="select" 
                                    name={`seatConfigs.${index}.seatType`} 
                                    className="form-control"
                                  >
                                    <option value="STANDARD">Standard</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="RECLINER">Recliner</option>
                                    <option value="COUPLE">Couple</option>
                                  </Field>
                                  <ErrorMessage 
                                    name={`seatConfigs.${index}.seatType`} 
                                    component="div" 
                                    className="form-error" 
                                  />
                                </div>
                              </div>
                              
                              {values.seatConfigs.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger remove-btn"
                                  onClick={() => remove(index)}
                                >
                                  Remove Row
                                </button>
                              )}
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            className="btn btn-outline add-row-btn"
                            onClick={() => push({ 
                              rowName: String.fromCharCode(65 + values.seatConfigs.length), // A, B, C, etc.
                              seatCount: 10, 
                              seatType: 'STANDARD' 
                            })}
                          >
                            <FaPlus /> Add Row
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditScreen(null);
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editScreen ? 'Update' : 'Save')}
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

export default OwnerScreens;