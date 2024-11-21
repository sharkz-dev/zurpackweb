import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import QuotationForm from '../components/QuotationForm';
import Toast from '../components/Toast';

const Contact = ({ showCart, setShowCart }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [addMessage, setAddMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleQuotationRequest = () => {
    setShowCart(false);
    setShowQuotationForm(true);
  };

  const handleClearCart = () => {
    clearCart();
    setAddMessage('Carrito limpiado exitosamente');
    setTimeout(() => setAddMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Teléfono",
      details: ["+56 9 1234 5678", "+56 2 2345 6789"],
      action: "tel:+56912345678"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["contacto@zurpack.cl", "ventas@zurpack.cl"],
      action: "mailto:contacto@zurpack.cl"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Dirección",
      details: ["Calle Ejemplo 123", "Santiago, Chile"],
      action: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              Estamos aquí para responder tus preguntas y ayudarte con tus necesidades
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.action}
              target={info.title === 'Dirección' ? '_blank' : '_self'}
              rel="noreferrer"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
          
          {status.error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {status.error}
            </div>
          )}

          {status.success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asunto *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Asunto del mensaje"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje *
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status.loading}
                className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status.loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-200 mt-16">
        <iframe
          title="Ubicación"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0398!2d-70.6483!3d-33.4372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzE0LjAiUyA3MMKwMzgnNTQuMCJX!5e0!3m2!1ses!2scl!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onQuotationRequest={handleQuotationRequest}
        onClearCart={handleClearCart}
      />
      
      {/* QuotationForm */}
      {showQuotationForm && (
        <QuotationForm 
          onClose={() => setShowQuotationForm(false)}
          onSuccess={() => {
            setShowQuotationForm(false);
            setShowCart(false);
          }}
        />
      )}

      {/* Toast Notifications */}
      {addMessage && <Toast message={addMessage} />}
    </div>
  );
};

export default Contact;