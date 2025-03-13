import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaSearch, FaUserTag, FaCheck, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/pages/admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // This is dummy data - in a real app, fetch from your API
        setTimeout(() => {
          const dummyUsers = [
            { id: 1, fullName: 'John Doe', email: 'john@example.com', phoneNumber: '9876543210', role: 'ROLE_CUSTOMER', emailVerified: true, active: true },
            { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', phoneNumber: '9876543211', role: 'ROLE_CUSTOMER', emailVerified: true, active: true },
            { id: 3, fullName: 'Robert Johnson', email: 'robert@example.com', phoneNumber: '9876543212', role: 'ROLE_THEATER_OWNER', emailVerified: true, active: true },
            { id: 4, fullName: 'Sarah Williams', email: 'sarah@example.com', phoneNumber: '9876543213', role: 'ROLE_CUSTOMER', emailVerified: false, active: true },
            { id: 5, fullName: 'Michael Brown', email: 'michael@example.com', phoneNumber: '9876543214', role: 'ROLE_CUSTOMER', emailVerified: true, active: false },
            { id: 6, fullName: 'Emily Davis', email: 'emily@example.com', phoneNumber: '9876543215', role: 'ROLE_THEATER_OWNER', emailVerified: true, active: true },
            { id: 7, fullName: 'David Miller', email: 'david@example.com', phoneNumber: '9876543216', role: 'ROLE_CUSTOMER', emailVerified: true, active: true },
            { id: 8, fullName: 'Lisa Wilson', email: 'lisa@example.com', phoneNumber: '9876543217', role: 'ROLE_CUSTOMER', emailVerified: false, active: true },
            { id: 9, fullName: 'Kevin Moore', email: 'kevin@example.com', phoneNumber: '9876543218', role: 'ROLE_ADMIN', emailVerified: true, active: true },
            { id: 10, fullName: 'Amanda Taylor', email: 'amanda@example.com', phoneNumber: '9876543219', role: 'ROLE_CUSTOMER', emailVerified: true, active: false }
          ];
          
          setUsers(dummyUsers);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to load users. Please try again.');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on active tab and search query
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'customers') {
      return user.role === 'ROLE_CUSTOMER' && matchesSearch;
    } else if (activeTab === 'theater-owners') {
      return user.role === 'ROLE_THEATER_OWNER' && matchesSearch;
    } else if (activeTab === 'admins') {
      return user.role === 'ROLE_ADMIN' && matchesSearch;
    } else if (activeTab === 'inactive') {
      return !user.active && matchesSearch;
    } else if (activeTab === 'unverified') {
      return !user.emailVerified && matchesSearch;
    }
    
    return false;
  });
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };
  
  const handleUpdateUser = (e) => {
    e.preventDefault();
    
    // In a real app, call your API to update the user
    const updatedUsers = users.map(user => {
      if (user.id === editUser.id) {
        return { ...editUser };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setShowEditModal(false);
    setEditUser(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleToggleUserStatus = (userId, currentStatus) => {
    // In a real app, call your API to toggle user status
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, active: !currentStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };
  
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    // In a real app, call your API to delete the user
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
  };
  
  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminSidebar />
        
        <div className="admin-content">
          <div className="admin-header">
            <h1><FaUsers /> User Management</h1>
            
            <div className="admin-actions">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button className="search-btn">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="user-tabs">
            <button 
              className={`user-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Users
            </button>
            <button 
              className={`user-tab ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              Customers
            </button>
            <button 
              className={`user-tab ${activeTab === 'theater-owners' ? 'active' : ''}`}
              onClick={() => setActiveTab('theater-owners')}
            >
              Theater Owners
            </button>
            <button 
              className={`user-tab ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              Admins
            </button>
            <button 
              className={`user-tab ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive
            </button>
            <button 
              className={`user-tab ${activeTab === 'unverified' ? 'active' : ''}`}
              onClick={() => setActiveTab('unverified')}
            >
              Unverified
            </button>
          </div>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Email Verified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>
                      {user.emailVerified ? (
                        <span className="verification-status verified">
                          <FaCheck /> Verified
                        </span>
                      ) : (
                        <span className="verification-status unverified">
                          <FaTimes /> Not Verified
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditUser(user)}
                        >
                          <FaEdit />
                        </button>
                        
                        <button 
                          className={`action-btn ${user.active ? 'disable-btn' : 'enable-btn'}`}
                          onClick={() => handleToggleUserStatus(user.id, user.active)}
                          title={user.active ? 'Disable User' : 'Enable User'}
                        >
                          {user.active ? <FaTimes /> : <FaCheck />}
                        </button>
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
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
        </div>
      </div>
      
      {/* Edit User Modal */}
      {showEditModal && editUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditUser(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <form className="modal-form" onSubmit={handleUpdateUser}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editUser.fullName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                    disabled
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editUser.phoneNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={editUser.role}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="ROLE_CUSTOMER">Customer</option>
                    <option value="ROLE_THEATER_OWNER">Theater Owner</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="emailVerified"
                    name="emailVerified"
                    checked={editUser.emailVerified}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="emailVerified">Email Verified</label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={editUser.active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="active">Active</label>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditUser(null);
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;