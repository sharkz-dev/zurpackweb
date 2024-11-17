import React, { useState } from "react";
import Navbar from "./components/Navbar";
import WhatsAppButton from "./components/WhatsAppButton";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from './context/CartContext';

const App = () => {
  const [currentPage, setCurrentPage] = useState('catalogo');
  const [showCart, setShowCart] = useState(false);

  const renderPage = () => {
    switch(currentPage) {
      case 'nosotros':
        return <About />;
      case 'contacto':
        return <Contact />;
      case 'admin':
        return (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        );
      case 'catalogo':
      default:
        return <Catalog showCart={showCart} setShowCart={setShowCart} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            setCurrentPage={setCurrentPage} 
            setShowCart={setShowCart}
          />
          <div className="pt-16">
            {renderPage()}
          </div>
          <WhatsAppButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;