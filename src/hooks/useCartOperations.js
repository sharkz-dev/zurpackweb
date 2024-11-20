import { useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';

export const useCartOperations = () => {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeErrors, setSizeErrors] = useState({});
  const [quantities, setQuantities] = useState({});
  const [addMessage, setAddMessage] = useState(null);

  const handleSizeSelect = useCallback((productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
    setSizeErrors(prev => ({
      ...prev,
      [productId]: null
    }));
  }, []);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity)
    }));
  }, []);

  const handleAddToCart = useCallback((product) => {
    const quantity = quantities[product._id] || 1;
    
    if (product.hasSizeVariants && !selectedSizes[product._id]) {
      setSizeErrors(prev => ({
        ...prev,
        [product._id]: 'Por favor selecciona un tamaño'
      }));
      return;
    }

    addToCart({
      ...product,
      selectedSize: product.hasSizeVariants ? selectedSizes[product._id] : null,
      quantity
    });

    // Limpiar estados
    setQuantities(prev => {
      const { [product._id]: _, ...rest } = prev;
      return rest;
    });

    setSelectedSizes(prev => {
      const { [product._id]: _, ...rest } = prev;
      return rest;
    });

    setAddMessage(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} añadido${quantity > 1 ? 's' : ''} al carrito`);
    setTimeout(() => setAddMessage(null), 2000);
  }, [addToCart, quantities, selectedSizes]);

  return {
    selectedSizes,
    sizeErrors,
    quantities,
    addMessage,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart
  };
};