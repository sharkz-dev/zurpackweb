import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    }
    setLoading(false);
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminInfo', JSON.stringify(adminData));
    localStorage.setItem('adminToken', adminData.token);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);