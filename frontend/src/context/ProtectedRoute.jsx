import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth(); // Get the auth state

  useEffect(() => {
    // Log the value of isLoggedIn to see its state
    console.log('isLoggedIn:', isLoggedIn);

    if (isLoggedIn === false) {
      alert('Login first');  // Show alert when the user is not logged in
    }
  }, [isLoggedIn]);

  // Show loading until the auth state is determined
  if (isLoggedIn === null) {
    return <div>Loading...</div>;  // Optional: a more visually appealing spinner could go here
  }

  // If the user is not authenticated, redirect to the homepage
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children (protected component)
  return children;
};

export default ProtectedRoute;
