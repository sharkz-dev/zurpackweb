import { useState, useCallback } from 'react';

export const useAdminAdvertisements = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);

  const fetchAdvertisements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar los anuncios');
      const data = await response.json();
      setAdvertisements(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdvertisement = useCallback(async (adData) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(adData)
      });

      if (!response.ok) throw new Error('Error al crear el anuncio');
      await fetchAdvertisements();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAdvertisements]);

  const updateAdvertisement = useCallback(async (id, adData) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(adData)
      });

      if (!response.ok) throw new Error('Error al actualizar el anuncio');
      await fetchAdvertisements();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAdvertisements]);

  const deleteAdvertisement = useCallback(async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar el anuncio');
      await fetchAdvertisements();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAdvertisements]);

  const toggleAdvertisement = useCallback(async (id, isActive) => {
    try {
      const ad = advertisements.find(a => a._id === id);
      if (!ad) return false;

      await updateAdvertisement(id, {
        ...ad,
        isActive
      });
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  }, [advertisements, updateAdvertisement]);

  return {
    advertisements,
    loading,
    error,
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleAdvertisement
  };
};