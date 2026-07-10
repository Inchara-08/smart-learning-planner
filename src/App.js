import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SetupPlanner from './components/SetupPlanner';
import Navbar from './components/Navbar';
import './App.css';
import ForgotPassword from './components/ForgotPassword';


function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : false;
  });

  // Save dark mode preference when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    window.dispatchEvent(new CustomEvent('darkModeChanged', { detail: newMode }));
  };

  return (
    <Router>
      <div className="App">
        <ConditionalNavbar 
          toggleDarkMode={toggleDarkMode} 
          isDarkMode={isDarkMode} 
        />
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/setup" element={isAuthenticated ? <SetupPlanner /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function ConditionalNavbar({ toggleDarkMode, isDarkMode }) {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }
  
  return <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
}

export default App;