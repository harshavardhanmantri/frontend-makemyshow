import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTicketAlt, FaTheaterMasks } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/layout.css';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin, isTheaterOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Make My Show</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/movies">Movies</Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/my-bookings">My Bookings</Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-email">{user?.email}</span>
                
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    <FaUser />
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile">
                      <FaUser /> Profile
                    </Link>
                    
                    <Link to="/my-bookings">
                      <FaTicketAlt /> My Bookings
                    </Link>
                    
                    {isAdmin && (
                      <Link to="/admin">
                        <FaTheaterMasks /> Admin Dashboard
                      </Link>
                    )}
                    
                    {isTheaterOwner && (
                      <Link to="/theater-owner">
                        <FaTheaterMasks /> Theater Dashboard
                      </Link>
                    )}
                    
                    <button onClick={handleLogout} className="logout-btn">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;