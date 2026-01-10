import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("shipment_auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const setAuthState = (data) => {
    setAuth(data);
    localStorage.setItem("shipment_auth", JSON.stringify(data));
  };

  const clearAuthState = () => {
    setAuth(null);
    localStorage.removeItem("shipment_auth");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthState, clearAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);