import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaFilm, FaChartBar, FaUsers, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import '../../styles/components/admin.css';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    {
      path: '/admin',
      icon: <FaTachometerAlt />,
      label: 'Dashboard'
    },
    {
      path: '/admin/movies',
      icon: <FaFilm />,
      label: 'Movies'
    },
    {
      path: '/admin/reports',
      icon: <FaChartBar />,
      label: 'Reports'
    },
    {
      path: '/admin/users',
      icon: <FaUsers />,
      label: 'Users'
    }
  ];
  
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/admin" className="brand">
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

export default AdminSidebar;