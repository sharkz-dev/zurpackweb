import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Target, Award, Briefcase } from 'lucide-react';
import CartDrawer from '../components/CartDrawer';
import QuotationForm from '../components/QuotationForm';

const About = ({ showCart: propShowCart, setShowCart: propSetShowCart }) => {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  
  const handleQuotationRequest = () => {
    if (propSetShowCart) {
      propSetShowCart(false);
    } else {
      setShowCart(false);
    }
    setShowQuotationForm(true);
  };

  const handleCloseCart = () => {
    if (propSetShowCart) {
      propSetShowCart(false);
    } else {
      setShowCart(false);
    }
  };

  const values = [
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Misión",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: "Visión",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-green-500" />,
      title: "Compromiso",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ];

  const team = [
    {
      name: "Gustavo Zurita",
      position: "Gerente General",
      image: "/api/placeholder/200/200",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
      name: "Guiso de Mote",
      position: "Directora Comercial",
      image: "/api/placeholder/200/200",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      name: "Nachoclo",
      position: "Jefe de Producción",
      image: "/api/placeholder/200/200",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Sobre Nosotros</h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim placeat.
            </p>
          </div>
        </div>
      </div>

      {/* Historia Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/api/placeholder/800/600"
              alt="Historia de la empresa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Valores Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestro Equipo</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-green-100">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Empleados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-green-100">Productos Entregados</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para trabajar con nosotros?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Contáctanos hoy mismo para discutir cómo podemos ayudarte.
        </p>
        <a
          href="/contacto"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Contáctanos
        </a>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={propShowCart !== undefined ? propShowCart : showCart}
        onClose={handleCloseCart}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onQuotationRequest={handleQuotationRequest}
        onClearCart={clearCart}
      />
      
      {/* Quotation Form */}
      {showQuotationForm && (
        <QuotationForm 
          onClose={() => setShowQuotationForm(false)}
          onSuccess={() => {
            setShowQuotationForm(false);
            handleCloseCart();
          }}
        />
      )}
    </div>
  );
};

export default About;