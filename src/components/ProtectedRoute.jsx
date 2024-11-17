import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!admin) {
    return <div>No tienes acceso a esta página</div>;
  }

  return children;
};

export default ProtectedRoute;