import { useState, useEffect } from 'react';

export const useProducts = (productsPerPage = 12) => {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null,
    page: 1,
    totalPages: 0,
  });

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      
      const data = await response.json();
      setState(prev => ({
        ...prev,
        products: data,
        loading: false,
        totalPages: Math.ceil(data.length / productsPerPage)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al cargar los productos',
        loading: false
      }));
    }
  };

  const setPage = (newPage) => {
    setState(prev => ({ ...prev, page: newPage }));
  };

  const getCurrentProducts = () => {
    const { products, page } = state;
    const startIndex = (page - 1) * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  };

  useEffect(() => {
    fetchProducts();
  }, [productsPerPage]);

  return {
    ...state,
    setPage,
    getCurrentProducts,
    refetchProducts: fetchProducts
  };
};