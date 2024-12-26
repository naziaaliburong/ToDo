import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);  // Initialize to null for loading state

  // Function to check session status
  useEffect(() => {
    axios.get('http://localhost:5000/api/session-check', { withCredentials: true })
      .then(response => {
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);  // Handle any errors by assuming the user is not authenticated
      });
  }, []);

  const login = () => {
    // Logic for login (e.g., set cookie, make request to backend)
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Logic for logout (e.g., clear session or token)
    setIsLoggedIn(false);
  };

  // Return loading state while checking session
  if (isLoggedIn === null) {
    return <div>Loading...</div>;  // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
