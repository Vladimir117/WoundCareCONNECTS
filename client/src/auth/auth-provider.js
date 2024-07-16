import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    // Sync token with localStorage on initialization and changes
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (newToken, remember) => {
    if (remember) {
      localStorage.setItem('authToken', newToken);
    }
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
