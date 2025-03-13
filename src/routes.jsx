import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout components
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Public pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import TheaterSelection from './pages/TheaterSelection.jsx';
import OTPVerification from './pages/OTPVerification.jsx'

// Customer pages
import SeatBooking from './pages/SeatBooking';
import Payment from './pages/Payment';    
import BookingConfirmation from './pages/BookingConfirmation';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMovies from './pages/Admin/Movies';
import AdminReports from './pages/Admin/Reports';
import AdminUsers from './pages/Admin/Users';

// // Theater Owner pages
import OwnerDashboard from './pages/TheaterOwner/Dashboard';
import OwnerTheaters from './pages/TheaterOwner/Theaters';
import OwnerScreens from './pages/TheaterOwner/Screens';
import OwnerShows from './pages/TheaterOwner/Shows';
import MovieList from './components/movies/MovieList.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/movies" element={<MovieList />} />
      <Route path="/otp" element={<OTPVerification />} />

      
      {/* Customer Routes */}
      { <Route element={<ProtectedRoute requiredRole="ROLE_CUSTOMER" />}>
        <Route path="/booking/:showId" element={<SeatBooking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/movies/:id/theaters" element={<TheaterSelection />} />

      </Route> }
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiredRole="ROLE_ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
      
      {/* Theater Owner Routes */}
      <Route element={<ProtectedRoute requiredRole="ROLE_THEATER_OWNER" />}>
        <Route path="/theater-owner" element={<OwnerDashboard />} />
        <Route path="/theater-owner/theaters" element={<OwnerTheaters />} />
        <Route path="/theater-owner/screens" element={<OwnerScreens />} />
        <Route path="/theater-owner/shows" element={<OwnerShows />} />
      </Route>
      
      {/* Not Found Route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;