import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaChartLine, FaUsers, FaCalendarAlt, FaDollarSign, FaTicketAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import AdminSidebar from '../../components/admin/AdminSidebar';
import '../../styles/pages/admin.css';
import axios from 'axios';
import api from '../../api/axiosConfig';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeMovies: 0,
    totalUsers: 0,
    popularMovies: [],
    recentBookings: []
  });
  
  useEffect(() => {
    // In a real app, you would fetch these stats from your API
    // This is dummy data for demonstration
    // setStats({
    //   totalRevenue: 520000,
    //   totalBookings: 4850,
    //   activeMovies: 24,
    //   totalUsers: 12500,
    //   popularMovies: [
    //     { id: 1, title: 'Movie Title 1', bookings: 850, revenue: 120000 },
    //     { id: 2, title: 'Movie Title 2', bookings: 650, revenue: 95000 },
    //     { id: 3, title: 'Movie Title 3', bookings: 450, revenue: 72000 },
    //     { id: 4, title: 'Movie Title 4', bookings: 350, revenue: 58000 },
    //     { id: 5, title: 'Movie Title 5', bookings: 280, revenue: 48000 }
    //   ],
    //   recentBookings: [
    //     { id: 101, user: 'user1@example.com', movie: 'Movie Title 1', amount: 250, date: '2023-04-10' },
    //     { id: 102, user: 'user2@example.com', movie: 'Movie Title 3', amount: 350, date: '2023-04-10' },
    //     { id: 103, user: 'user3@example.com', movie: 'Movie Title 2', amount: 180, date: '2023-04-09' },
    //     { id: 104, user: 'user4@example.com', movie: 'Movie Title 5', amount: 420, date: '2023-04-09' },
    //     { id: 105, user: 'user5@example.com', movie: 'Movie Title 1', amount: 250, date: '2023-04-08' }
    //   ]
    // });
   const fetchRevenue=async ()=>{
    try{
      const response = await api.get("http://localhost:8081/api/v1/admin/reports/revenue", {
        params: {
          startDate: "2025-03-01",
          endDate: "2025-03-10",
          theaterId: 1,
        },
      });
      console.log(response.data, "RES")
    }catch(e){
      console.log("error")
    }
   }
   fetchRevenue();
  }, []);
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <div className="admin-user">
              Welcome, {user?.email || 'Admin'}
            </div>
          </div>
          
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-info">
                <h3>Total Revenue</h3>
                <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaTicketAlt />
              </div>
              <div className="stat-info">
                <h3>Total Bookings</h3>
                <div className="stat-value">{stats.totalBookings.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaFilm />
              </div>
              <div className="stat-info">
                <h3>Active Movies</h3>
                <div className="stat-value">{stats.activeMovies}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-info">
                <h3>Total Users</h3>
                <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-widgets">
            <div className="widget">
              <div className="widget-header">
                <h2><FaChartLine /> Popular Movies</h2>
                <Link to="/admin/reports" className="view-all">View All</Link>
              </div>
              
              <div className="widget-content">
                <table className="data-table">
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
            
            <div className="widget">
              <div className="widget-header">
                <h2><FaCalendarAlt /> Recent Bookings</h2>
                <Link to="/admin/reports" className="view-all">View All</Link>
              </div>
              
              <div className="widget-content">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Movie</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.user}</td>
                        <td>{booking.movie}</td>
                        <td>₹{booking.amount}</td>
                        <td>{booking.date}</td>
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

export default AdminDashboard;