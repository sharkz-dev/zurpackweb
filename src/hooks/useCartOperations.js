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
    // Validar que el producto tenga un tamaño seleccionado si es necesario
    if (product.hasSizeVariants && !product.selectedSize) {
      setSizeErrors(prev => ({
        ...prev,
        [product._id]: 'Por favor selecciona un tamaño'
      }));
      return;
    }

    const quantity = product.quantity || 1;

    // Añadir al carrito
    addToCart({
      ...product,
      quantity
    });

    // Limpiar estados después de añadir al carrito
    setQuantities(prev => {
      const { [product._id]: _, ...rest } = prev;
      return rest;
    });

    setSelectedSizes(prev => {
      const { [product._id]: _, ...rest } = prev;
      return rest;
    });

    // Mostrar mensaje de confirmación
    setAddMessage(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} añadido${quantity > 1 ? 's' : ''} al carrito`);
    setTimeout(() => setAddMessage(null), 2000);
  }, [addToCart]);

  const resetStates = useCallback(() => {
    setSelectedSizes({});
    setSizeErrors({});
    setQuantities({});
    setAddMessage(null);
  }, []);

  const clearProductState = useCallback((productId) => {
    setSelectedSizes(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    setSizeErrors(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    setQuantities(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    selectedSizes,
    sizeErrors,
    quantities,
    addMessage,
    handleSizeSelect,
    handleQuantityChange,
    handleAddToCart,
    resetStates,
    clearProductState
  };
};