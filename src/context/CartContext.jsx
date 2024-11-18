import React, { createContext, useContext, useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'shopping-cart';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item._id === product._id && 
        (!item.hasSizeVariants || item.selectedSize === product.selectedSize)
      );
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id && 
          (!item.hasSizeVariants || item.selectedSize === product.selectedSize)
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      
      return [...prevItems, { 
        ...product, 
        quantity: product.quantity || 1
      }];
    });
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        if (item.hasSizeVariants) {
          return !(item._id === productId && item.selectedSize === selectedSize);
        }
        return item._id !== productId;
      })
    );
  };

  const updateQuantity = (productId, quantity, selectedSize = null) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === productId) {
          if (item.hasSizeVariants && item.selectedSize !== selectedSize) {
            return item;
          }
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getUniqueItemsCount = () => {
    return cartItems.length;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getUniqueItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);