import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTheaterMasks, FaFilm, FaDesktop, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/theater-owner.css';

const TheaterOwnerSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    {
      path: '/theater-owner',
      icon: <FaTachometerAlt />,
      label: 'Dashboard'
    },
    {
      path: '/theater-owner/theaters',
      icon: <FaTheaterMasks />,
      label: 'Theaters'
    },
    {
      path: '/theater-owner/screens',
      icon: <FaDesktop />,
      label: 'Screens'
    },
    {
      path: '/theater-owner/shows',
      icon: <FaFilm />,
      label: 'Shows'
    }
  ];
  
  return (
    <div className="theater-owner-sidebar">
      <div className="sidebar-header">
        <Link to="/theater-owner" className="brand">
          <FaTicketAlt className="brand-icon" />
          <span className="brand-name">BookShow</span>
        </Link>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={logout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TheaterOwnerSidebar;