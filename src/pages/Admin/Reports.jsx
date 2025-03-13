import React, { useState, useEffect } from 'react';
import { FaChartBar, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/pages/admin.css';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState(getLastMonthDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [filter, setFilter] = useState({
    theaterId: '',
    movieId: ''
  });
  const [reportData, setReportData] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  
  // Helper functions for dates
  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }
  
  function getLastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }
  
  // Fetch theaters and movies for filter dropdowns
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // In a real app, fetch theaters and movies from API
        setTheaters([
          { id: 1, name: 'PVR Cinemas - Koramangala' },
          { id: 2, name: 'INOX - Garuda Mall' },
          { id: 3, name: 'Cinepolis - Forum Mall' },
          { id: 4, name: 'PVR Cinemas - Orion Mall' }
        ]);
        
        setMovies([
          { id: 1, title: 'Avengers: Endgame' },
          { id: 2, title: 'The Dark Knight' },
          { id: 3, title: 'Inception' },
          { id: 4, title: 'Interstellar' },
          { id: 5, title: 'Jurassic World' }
        ]);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    
    fetchFilterData();
  }, []);
  
  // Fetch report data when parameters change
  useEffect(() => {
    const fetchReportData = async () => {
      if (!startDate || !endDate) return;
      
      try {
        setLoading(true);
        
        // In a real app, we'd call the API here
        // For this example, we'll simulate API data
        
        setTimeout(() => {
          // Sample data for different report types
          if (reportType === 'revenue') {
            setReportData({
              startDate,
              endDate,
              totalRevenue: 2458750,
              revenueByDay: {
                '2023-06-01': 125000,
                '2023-06-02': 142500,
                '2023-06-03': 167800,
                '2023-06-04': 155200,
                '2023-06-05': 134700
              },
              revenueByMovie: {
                'Avengers: Endgame': 560250,
                'The Dark Knight': 427500,
                'Inception': 380250,
                'Interstellar': 324000,
                'Jurassic World': 312750
              },
              revenueByTheater: {
                'PVR Cinemas - Koramangala': 780500,
                'INOX - Garuda Mall': 625000,
                'Cinepolis - Forum Mall': 542250,
                'PVR Cinemas - Orion Mall': 511000
              }
            });
          } else if (reportType === 'bookings') {
            setReportData({
              startDate,
              endDate,
              totalBookings: 5465,
              bookingsByDay: {
                '2023-06-01': 320,
                '2023-06-02': 345,
                '2023-06-03': 410,
                '2023-06-04': 380,
                '2023-06-05': 335
              },
              bookingsByMovie: {
                'Avengers: Endgame': 1245,
                'The Dark Knight': 950,
                'Inception': 845,
                'Interstellar': 720,
                'Jurassic World': 695
              },
              bookingsByTheater: {
                'PVR Cinemas - Koramangala': 1750,
                'INOX - Garuda Mall': 1420,
                'Cinepolis - Forum Mall': 1210,
                'PVR Cinemas - Orion Mall': 1085
              },
              bookingCompletionRate: {
                'Avengers: Endgame': 94.5,
                'The Dark Knight': 92.3,
                'Inception': 91.8,
                'Interstellar': 93.2,
                'Jurassic World': 90.7
              }
            });
          } else if (reportType === 'movies') {
            setReportData({
              startDate,
              endDate,
              popularMovies: [
                { 
                  movieId: 1, 
                  title: 'Avengers: Endgame', 
                  totalBookings: 1245, 
                  totalRevenue: 560250, 
                  averageOccupancy: 87.5 
                },
                { 
                  movieId: 2, 
                  title: 'The Dark Knight', 
                  totalBookings: 950, 
                  totalRevenue: 427500, 
                  averageOccupancy: 83.2 
                },
                { 
                  movieId: 3, 
                  title: 'Inception', 
                  totalBookings: 845, 
                  totalRevenue: 380250, 
                  averageOccupancy: 81.7 
                },
                { 
                  movieId: 4, 
                  title: 'Interstellar', 
                  totalBookings: 720, 
                  totalRevenue: 324000, 
                  averageOccupancy: 79.3 
                },
                { 
                  movieId: 5, 
                  title: 'Jurassic World', 
                  totalBookings: 695, 
                  totalRevenue: 312750, 
                  averageOccupancy: 77.8 
                }
              ]
            });
          } else if (reportType === 'theaters') {
            setReportData({
              startDate,
              endDate,
              theaters: [
                {
                  theaterId: 1,
                  name: 'PVR Cinemas - Koramangala',
                  city: 'Bangalore',
                  totalBookings: 1750,
                  totalRevenue: 780500,
                  averageOccupancy: 85.3,
                  screens: [
                    { screenId: 1, name: 'Screen 1', totalBookings: 620, averageOccupancy: 87.4 },
                    { screenId: 2, name: 'Screen 2', totalBookings: 585, averageOccupancy: 84.2 },
                    { screenId: 3, name: 'Screen 3', totalBookings: 545, averageOccupancy: 82.7 }
                  ]
                },
                {
                  theaterId: 2,
                  name: 'INOX - Garuda Mall',
                  city: 'Bangalore',
                  totalBookings: 1420,
                  totalRevenue: 625000,
                  averageOccupancy: 82.1,
                  screens: [
                    { screenId: 4, name: 'Screen 1', totalBookings: 510, averageOccupancy: 83.5 },
                    { screenId: 5, name: 'Screen 2', totalBookings: 480, averageOccupancy: 81.2 },
                    { screenId: 6, name: 'Screen 3', totalBookings: 430, averageOccupancy: 80.8 }
                  ]
                }
              ]
            });
          }
          
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to load report data');
        setLoading(false);
        console.error('Error fetching report data:', err);
      }
    };
    
    fetchReportData();
  }, [reportType, startDate, endDate, filter]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReportTypeChange = (type) => {
    setReportType(type);
    // Reset specific filters when changing report type
    if (type === 'bookings' || type === 'movies') {
      setFilter(prev => ({ ...prev, theaterId: '' }));
    } else if (type === 'revenue' || type === 'theaters') {
      setFilter(prev => ({ ...prev, movieId: '' }));
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would generate and download the report
    alert('Report downloaded successfully!');
  };
  
  const renderReportContent = () => {
    if (!reportData) return null;
    
    switch (reportType) {
      case 'revenue':
        return (
          <div className="report-content">
            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Revenue</h3>
                <p className="value">₹{reportData.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Revenue by Day</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.revenueByDay).map(([date, revenue]) => (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>₹{revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Revenue by Movie</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.revenueByMovie).map(([movie, revenue]) => (
                      <tr key={movie}>
                        <td>{movie}</td>
                        <td>₹{revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Revenue by Theater</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Theater</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.revenueByTheater).map(([theater, revenue]) => (
                      <tr key={theater}>
                        <td>{theater}</td>
                        <td>₹{revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'bookings':
        return (
          <div className="report-content">
            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Bookings</h3>
                <p className="value">{reportData.totalBookings.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Bookings by Day</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.bookingsByDay).map(([date, bookings]) => (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>{bookings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Bookings by Movie</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Bookings</th>
                      <th>Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.bookingsByMovie).map(([movie, bookings]) => (
                      <tr key={movie}>
                        <td>{movie}</td>
                        <td>{bookings.toLocaleString()}</td>
                        <td>{reportData.bookingCompletionRate[movie]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="report-section">
              <h3>Bookings by Theater</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Theater</th>
                      <th>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.bookingsByTheater).map(([theater, bookings]) => (
                      <tr key={theater}>
                        <td>{theater}</td>
                        <td>{bookings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'movies':
        return (
          <div className="report-content">
            <div className="report-section">
              <h3>Popular Movies</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                      <th>Avg. Occupancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.popularMovies.map(movie => (
                      <tr key={movie.movieId}>
                        <td>{movie.title}</td>
                        <td>{movie.totalBookings.toLocaleString()}</td>
                        <td>₹{movie.totalRevenue.toLocaleString()}</td>
                        <td>{movie.averageOccupancy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'theaters':
        return (
          <div className="report-content">
            {reportData.theaters.map(theater => (
              <div key={theater.theaterId} className="report-section">
                <h3>{theater.name}</h3>
                <div className="theater-overview">
                  <div className="theater-stat">
                    <span>City:</span> 
                    <strong>{theater.city}</strong>
                  </div>
                  <div className="theater-stat">
                    <span>Total Bookings:</span> 
                    <strong>{theater.totalBookings.toLocaleString()}</strong>
                  </div>
                  <div className="theater-stat">
                    <span>Total Revenue:</span> 
                    <strong>₹{theater.totalRevenue.toLocaleString()}</strong>
                  </div>
                  <div className="theater-stat">
                    <span>Avg. Occupancy:</span> 
                    <strong>{theater.averageOccupancy}%</strong>
                  </div>
                </div>
                
                <h4>Screen Performance</h4>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Screen</th>
                        <th>Bookings</th>
                        <th>Avg. Occupancy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theater.screens.map(screen => (
                        <tr key={screen.screenId}>
                          <td>{screen.name}</td>
                          <td>{screen.totalBookings.toLocaleString()}</td>
                          <td>{screen.averageOccupancy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="admin-header">
            <h1><FaChartBar /> Reports</h1>
          </div>
          
          <div className="reports-container">
            <div className="report-filters">
              <div className="report-types">
                <button 
                  className={`report-type-btn ${reportType === 'revenue' ? 'active' : ''}`}
                  onClick={() => handleReportTypeChange('revenue')}
                >
                  Revenue
                </button>
                <button 
                  className={`report-type-btn ${reportType === 'bookings' ? 'active' : ''}`}
                  onClick={() => handleReportTypeChange('bookings')}
                >
                  Bookings
                </button>
                <button 
                  className={`report-type-btn ${reportType === 'movies' ? 'active' : ''}`}
                  onClick={() => handleReportTypeChange('movies')}
                >
                  Movies
                </button>
                <button 
                  className={`report-type-btn ${reportType === 'theaters' ? 'active' : ''}`}
                  onClick={() => handleReportTypeChange('theaters')}
                >
                  Theaters
                </button>
              </div>
              
              <div className="filter-form">
                <div className="date-filters">
                  <div className="form-group">
                    <label htmlFor="startDate">
                      <FaCalendarAlt /> Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">
                      <FaCalendarAlt /> End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="entity-filters">
                  {(reportType === 'revenue' || reportType === 'bookings') && (
                    <div className="form-group">
                      <label htmlFor="theaterId">Theater</label>
                      <select
                        id="theaterId"
                        name="theaterId"
                        value={filter.theaterId}
                        onChange={handleFilterChange}
                        className="form-control"
                      >
                        <option value="">All Theaters</option>
                        {theaters.map(theater => (
                          <option key={theater.id} value={theater.id}>
                            {theater.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {(reportType === 'bookings') && (
                    <div className="form-group">
                      <label htmlFor="movieId">Movie</label>
                      <select
                        id="movieId"
                        name="movieId"
                        value={filter.movieId}
                        onChange={handleFilterChange}
                        className="form-control"
                      >
                        <option value="">All Movies</option>
                        {movies.map(movie => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="filter-actions">
                <button 
                  className="btn btn-primary download-btn"
                  onClick={handleDownload}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="report-results">
                {renderReportContent()}
              </div>
            )}
          </div>
          </div>
        </div>
    </div>
  );
};

export default AdminReports;