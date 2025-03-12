import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from './context/AuthContext.jsx';
import BookingProvider from './context/BookingContext.jsx';
import AppRoutes from './routes.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;