import React, { createContext, useState, useEffect } from 'react';
import { 
  login as loginApi, 
  logout as logoutApi, 
  getCurrentUser,
  hasRole as checkRole,
  refreshToken
} from '../api/auth';

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user from localStorage on initial render
    const loadUser = async () => {
      try {
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error loading user from localStorage', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(credentials);
      setUser({ id: data.id, email: data.email, roles: data.roles });
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const refreshUserToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return false;

      await refreshToken(refreshTokenValue);
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  // Check if user is a customer
  const isCustomer = () => hasRole('ROLE_CUSTOMER');

  // Check if user is a theater owner
  const isTheaterOwner = () => hasRole('ROLE_THEATER_OWNER');

  // Check if user is an admin
  const isAdmin = () => hasRole('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshUserToken,
        hasRole,
        isCustomer,
        isTheaterOwner,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;