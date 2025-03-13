import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaTheaterMasks, FaFilm, FaTicketAlt, FaDollarSign, FaChartLine } from 'react-icons/fa';
import TheaterOwnerSidebar from '../../components/theaters/TheaterOwnerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/pages/theater-owner.css';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalTheaters: 0,
    totalScreens: 0,
    totalShows: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    upcomingShows: [],
    popularMovies: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulating API call with setTimeout
        setTimeout(() => {
          setStats({
            totalTheaters: 3,
            totalScreens: 12,
            totalShows: 48,
            totalBookings: 5860,
            totalRevenue: 2643000,
            recentBookings: [
              { id: 1, bookingNumber: 'BK16835224', movieTitle: 'Inception', customerName: 'John Doe', amount: 350, date: '2023-06-10', screen: 'Screen 1', theater: 'PVR Koramangala' },
              { id: 2, bookingNumber: 'BK16835225', movieTitle: 'The Dark Knight', customerName: 'Jane Smith', amount: 420, date: '2023-06-09', screen: 'Screen 2', theater: 'PVR Koramangala' },
              { id: 3, bookingNumber: 'BK16835226', movieTitle: 'Interstellar', customerName: 'Robert Johnson', amount: 380, date: '2023-06-09', screen: 'Screen 1', theater: 'INOX Garuda Mall' },
              { id: 4, bookingNumber: 'BK16835227', movieTitle: 'Avengers: Endgame', customerName: 'Sarah Williams', amount: 500, date: '2023-06-08', screen: 'Screen 3', theater: 'PVR Koramangala' },
              { id: 5, bookingNumber: 'BK16835228', movieTitle: 'Jurassic World', customerName: 'Michael Brown', amount: 320, date: '2023-06-08', screen: 'Screen 2', theater: 'INOX Garuda Mall' }
            ],
            upcomingShows: [
              { id: 1, movieTitle: 'Mission: Impossible - Dead Reckoning', theater: 'PVR Koramangala', screen: 'Screen 1', time: '2023-06-15 18:30', seats: { total: 120, booked: 45 } },
              { id: 2, movieTitle: 'The Flash', theater: 'INOX Garuda Mall', screen: 'Screen 2', time: '2023-06-16 14:15', seats: { total: 80, booked: 28 } },
              { id: 3, movieTitle: 'Indiana Jones and the Dial of Destiny', theater: 'PVR Koramangala', screen: 'Screen 3', time: '2023-06-18 20:00', seats: { total: 100, booked: 62 } },
              { id: 4, movieTitle: 'Oppenheimer', theater: 'INOX Garuda Mall', screen: 'Screen 1', time: '2023-06-20 18:30', seats: { total: 120, booked: 32 } },
              { id: 5, movieTitle: 'Barbie', theater: 'PVR Koramangala', screen: 'Screen 2', time: '2023-06-21 16:45', seats: { total: 80, booked: 15 } }
            ],
            popularMovies: [
              { id: 1, title: 'Avengers: Endgame', bookings: 1245, revenue: 560250 },
              { id: 2, title: 'The Dark Knight', bookings: 950, revenue: 427500 },
              { id: 3, title: 'Inception', bookings: 845, revenue: 380250 },
              { id: 4, title: 'Interstellar', bookings: 720, revenue: 324000 },
              { id: 5, title: 'Jurassic World', bookings: 695, revenue: 312750 }
            ]
          });
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="theater-owner-page">
        <div className="theater-owner-container">
          <TheaterOwnerSidebar />
          <div className="theater-owner-content">
            <div className="error-message">{error}</div>
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
            <h1><FaTachometerAlt /> Dashboard</h1>
          </div>
          
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon theaters">
                <FaTheaterMasks />
              </div>
              <div className="stat-details">
                <h3>Theaters</h3>
                <p className="stat-value">{stats.totalTheaters}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon screens">
                <FaFilm />
              </div>
              <div className="stat-details">
                <h3>Screens</h3>
                <p className="stat-value">{stats.totalScreens}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon bookings">
                <FaTicketAlt />
              </div>
              <div className="stat-details">
                <h3>Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaDollarSign />
              </div>
              <div className="stat-details">
                <h3>Revenue</h3>
                <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-row">
            <div className="dashboard-card recent-bookings">
              <div className="card-header">
                <h2><FaTicketAlt /> Recent Bookings</h2>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="theater-owner-table">
                    <thead>
                      <tr>
                        <th>Booking #</th>
                        <th>Movie</th>
                        <th>Theater</th>
                        <th>Screen</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentBookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.bookingNumber}</td>
                          <td>{booking.movieTitle}</td>
                          <td>{booking.theater}</td>
                          <td>{booking.screen}</td>
                          <td>₹{booking.amount}</td>
                          <td>{booking.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="view-all-link">
                    <Link to="/theater-owner/bookings">View All Bookings</Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card upcoming-shows">
              <div className="card-header">
                <h2><FaFilm /> Upcoming Shows</h2>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="theater-owner-table">
                    <thead>
                      <tr>
                        <th>Movie</th>
                        <th>Theater</th>
                        <th>Screen</th>
                        <th>Time</th>
                        <th>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.upcomingShows.map(show => (
                        <tr key={show.id}>
                          <td>{show.movieTitle}</td>
                          <td>{show.theater}</td>
                          <td>{show.screen}</td>
                          <td>{new Date(show.time).toLocaleString()}</td>
                          <td>
                            <div className="booking-progress">
                              <div className="progress-bar">
                                <div 
                                  className="progress" 
                                  style={{ width: `${(show.seats.booked / show.seats.total) * 100}%` }}
                                ></div>
                              </div>
                              <span className="booking-count">
                                {show.seats.booked}/{show.seats.total}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="view-all-link">
                    <Link to="/theater-owner/shows">View All Shows</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card popular-movies">
            <div className="card-header">
              <h2><FaChartLine /> Top Performing Movies</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="theater-owner-table">
                  <thead>
                    <tr>
                      <th>Movie</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popularMovies.map(movie => (
                      <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.bookings}</td>
                        <td>₹{movie.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;