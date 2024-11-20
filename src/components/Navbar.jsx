import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, CircleUser, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Login from './Login';

const Navbar = ({ setShowCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { admin, logout } = useAuth();
  const { getUniqueItemsCount } = useCart();
  const location = useLocation();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const NavLink = ({ to, children }) => (
    <Link 
      to={to}
      className={`py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300 ${
        location.pathname === to ? 'text-green-500' : ''
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const AuthButton = ({ isMobile = false }) => (
    <button
      onClick={() => admin ? handleLogout() : setShowLogin(true)}
      className={`transition-colors ${isMobile ? '' : 'hover:opacity-80'}`}
      title={admin ? "Cerrar Sesión" : "Iniciar Sesión"}
    >
      <CircleUser 
        className="w-6 h-6"
        color={admin ? "#EF4444" : "#22C55E"}
      />
    </button>
  );

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center py-4">
              <Link to="/" className="font-semibold text-gray-500 text-lg flex items-center">
                <img 
                  src="/images/logo.png" 
                  alt="Logo" 
                  className="h-6 w-auto mr-2" 
                />
                Zurpack
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/catalogo">Catálogo</NavLink>
              <NavLink to="/nosotros">Nosotros</NavLink>
              <NavLink to="/contacto">Contacto</NavLink>
              {admin && (
                <NavLink to="/admin">
                  <Settings className="w-5 h-5" />
                </NavLink>
              )}
              
              {/* Carrito y Autenticación */}
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() => setShowCart(true)}
                  className="relative text-gray-500 hover:text-green-500 transition-colors"
                  title="Carrito de cotización"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {getUniqueItemsCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getUniqueItemsCount()}
                    </span>
                  )}
                </button>
                
                <AuthButton />
              </div>
            </div>

            {/* Menú móvil */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative text-gray-500 hover:text-green-500"
              >
                <ShoppingCart className="w-6 h-6" />
                {getUniqueItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUniqueItemsCount()}
                  </span>
                )}
              </button>

              <AuthButton isMobile={true} />

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-green-500 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="flex flex-col">
                <NavLink to="/catalogo">Catálogo</NavLink>
                <NavLink to="/nosotros">Nosotros</NavLink>
                <NavLink to="/contacto">Contacto</NavLink>
                {admin && <NavLink to="/admin">Admin</NavLink>}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;