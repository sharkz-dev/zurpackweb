import React, { useState } from 'react';
import { Menu, X, Settings, CircleUser, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Login from './Login';

const Navbar = ({ setCurrentPage, setShowCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { admin, logout } = useAuth();
  const { getUniqueItemsCount } = useCart();

  const NavLink = ({ page, children }) => (
    <button 
      onClick={() => {
        setCurrentPage(page);
        setIsMenuOpen(false);
      }} 
      className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
    >
      {children}
    </button>
  );

  // Nuevo componente para el botón de login/logout con colores dinámicos
  const AuthButton = ({ isMobile = false }) => (
    <button
      onClick={() => admin ? logout() : setShowLogin(true)}
      className={`transition-colors ${isMobile ? '' : 'hover:opacity-80'}`}
      title={admin ? "Cerrar Sesión" : "Iniciar Sesión"}
    >
      <CircleUser 
        className="w-6 h-6"
        color={admin ? "#EF4444" : "#22C55E"} // rojo para logout, verde para login
      />
    </button>
  );

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center py-4">
              <span className="font-semibold text-gray-500 text-lg flex items-center">
                <img 
                  src="/images/logo.png" 
                  alt="Logo" 
                  className="h-6 w-auto mr-2" 
                />
                Zurpack
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <NavLink page="catalogo">Catálogo</NavLink>
              <NavLink page="nosotros">Nosotros</NavLink>
              <NavLink page="contacto">Contacto</NavLink>
              {admin && (
                <NavLink page="admin">
                  <Settings className="w-5 h-5" />
                </NavLink>
              )}
              
              {/* Carrito y Autenticación */}
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() => setShowCart(prev => !prev)}
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

            <div className="md:hidden flex items-center gap-4">
              {/* Carrito móvil */}
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

              {/* Botón de autenticación móvil */}
              <AuthButton isMobile={true} />

              {/* Menú hamburguesa */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-green-500 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="flex flex-col">
                <NavLink page="catalogo">Catálogo</NavLink>
                <NavLink page="nosotros">Nosotros</NavLink>
                <NavLink page="contacto">Contacto</NavLink>
                {admin && <NavLink page="admin">Admin</NavLink>}
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