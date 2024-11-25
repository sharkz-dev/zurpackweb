import React, { useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { X, Send, ChevronDown, Building2, User } from 'lucide-react';

const QuotationForm = ({ onClose, onSuccess }) => {
  const { cartItems, clearCart } = useCart();
  const [selectedCountry, setSelectedCountry] = useState('+56');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clientType, setClientType] = useState('person');
  
  const [formData, setFormData] = useState({
    rut: '',
    giro: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    telefono: '',
    correo: '',
    nombre: '',
    razonSocial: '',
  });

  const countries = [
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+51', name: 'Perú', flag: '🇵🇪' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  ];

  const validateRut = (rut) => {
    if (typeof rut !== 'string') return false;
    
    const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();
    
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;
    
    const cuerpo = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    let dvEsperado = 11 - (suma % 11);
    
    if (dvEsperado === 11) dvEsperado = '0';
    else if (dvEsperado === 10) dvEsperado = 'K';
    else dvEsperado = String(dvEsperado);
    
    return dvEsperado === dv;
  };

  const formatRut = (rutValue) => {
    let value = rutValue.replace(/\D/g, '');
    if (!value) return '';
    if (value.length > 9) value = value.slice(0, 9);
    const dv = value.slice(-1);
    let numbers = value.slice(0, -1);
    let formatted = '';
    for (let i = numbers.length - 1, j = 0; i >= 0; i--, j++) {
      if (j % 3 === 0 && j !== 0) formatted = '.' + formatted;
      formatted = numbers[i] + formatted;
    }
    return formatted ? `${formatted}-${dv}` : value;
  };

  const validateForm = () => {
    // Validar RUT
    if (!validateRut(formData.rut)) {
      setError('El RUT ingresado no es válido');
      return false;
    }

    // Validar teléfono
    if (formData.telefono.length !== 9) {
      setError('El número de teléfono debe tener 9 dígitos');
      return false;
    }

    // Validar campos obligatorios
    const requiredFields = [
      'rut', 'giro', 'direccion', 'comuna', 'ciudad', 'telefono', 'correo',
      ...(clientType === 'person' ? ['nombre'] : ['razonSocial'])
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Por favor complete todos los campos obligatorios`);
      return false;
    }

    // Si todas las validaciones pasan
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Si la validación falla, se detiene la ejecución aquí
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    try {
      const emailBody = {
        clientType,
        ...formData,
        telefono: `${selectedCountry}${formData.telefono}`,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          selectedSize: item.selectedSize
        }))
      };
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-quotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailBody)
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar la cotización');
      }
  
      setSuccess(true);
      clearCart();
      
      // Esperar 3 segundos antes de cerrar el modal
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 3000);
  
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Solicitud de Cotización</h2>
          <button
  onClick={onClose}
  className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
>
  <X className="w-6 h-6" />
</button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in-up">
            {error}
          </div>
        )}

{success ? (
  <div className="text-center p-8 animate-fade-in">
    <div className="mb-6">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <div className="text-2xl font-bold text-green-600 mb-3">
      ¡Cotización enviada exitosamente!
    </div>
    <p className="text-gray-600 text-lg mb-6">
      Nos pondremos en contacto contigo pronto.
    </p>
    <p className="text-sm text-gray-500">
      Esta ventana se cerrará automáticamente en unos segundos...
    </p>
  </div>
) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de tipo de cliente */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setClientType('person')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2
                  ${clientType === 'person' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Persona</span>
              </button>
              
              <button
                type="button"
                onClick={() => setClientType('company')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2
                  ${clientType === 'company' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Empresa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos específicos por tipo de cliente */}
              {clientType === 'person' ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              )}

              {/* Campos comunes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUT *
                </label>
                <input
                  type="text"
                  name="rut"
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: formatRut(e.target.value)})}
                  placeholder="12.345.678-9"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giro *
                </label>
                <input
                  type="text"
                  name="giro"
                  value={formData.giro}
                  onChange={(e) => setFormData({...formData, giro: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comuna *
                </label>
                <input
                  type="text"
                  name="comuna"
                  value={formData.comuna}
                  onChange={(e) => setFormData({...formData, comuna: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-24 p-2 border rounded-lg"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 9) {
                        setFormData({...formData, telefono: value});
                      }
                    }}
                    placeholder="912345678"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* Resumen de productos */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Productos en la cotización:</h3>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                {cartItems.map(item => (
                  <div key={`${item._id}-${item.selectedSize || 'default'}`} 
                       className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.selectedSize && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Variante: {item.selectedSize})
                        </span>
                      )}
                    </div>
                    <span className="text-gray-600">Cantidad: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Cotización
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;