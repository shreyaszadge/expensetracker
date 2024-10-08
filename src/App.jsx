import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './config/firebase'; // Firebase auth instance
import Navbar from './components/Navbar';

const App = () => {
  const [user, setUser] = useState(null); // Track authentication state
  const [loading, setLoading] = useState(true); // Handle loading state while checking auth

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Loading is complete once we know the auth state
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading spinner while checking auth state

  return (
    <>
    
    <Navbar>

    <Router>
      <Routes>
        {/* Root Route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>

    </Navbar>
    
    </>
   
  );
};

export default App;
