import React, { createContext, useState, useEffect } from 'react';
import { base_url } from 'src/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUserInfo(storedToken);
    }
  }, []);

  console.log(user);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`${base_url}/api/auth`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json' // Ensure JSON content type if needed
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Set user data in state
      } else {
        console.error('Failed to fetch user info:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  

  const login = (newToken, remember, userData) => {
    if (remember) {
      localStorage.setItem('authToken', newToken);
    }
    setToken(newToken);
    setIsLoggedIn(true);
    setUser(userData); // Store user data
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
