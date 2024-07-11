import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // Perform login actions (e.g., set tokens, update state)
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Perform logout actions (e.g., clear tokens, update state)
    setIsLoggedIn(false);
  };

  console.log(isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
