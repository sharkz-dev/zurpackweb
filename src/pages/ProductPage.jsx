import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartOperations } from '../hooks/useCartOperations';
import Navbar from '../components/Navbar';

const QuantitySelector = ({ quantity, onQuantityChange }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
      className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
    >
      <Minus className="w-5 h-5" />
    </button>
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
      className="w-16 text-center border rounded py-1"
    />
    <button
      type="button"
      onClick={() => onQuantityChange(quantity + 1)}
      className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>
);

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart, addMessage } = useCartOperations();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Producto no encontrado
            </h1>
            <button
              onClick={() => navigate('/catalogo')}
              className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableSizes = product.sizeVariants.filter(variant => variant.isAvailable);

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    handleAddToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/catalogo')}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al catálogo
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {product.category}
              </span>
            </div>

            {/* Código del producto */}
            <div>
              <p className="text-gray-600">Código del producto: {product._id}</p>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Medidas y detalles */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Unidades por caja</h4>
                <p className="text-green-600 font-semibold">300</p>
              </div>

              <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">La venta mínima por producto es de una caja.</p>
                <p className="text-xs mt-1">Obtendrá el precio una vez que solicite la cotización.</p>
              </div>
            </div>

            {/* Selector de tamaño y cantidad */}
            <div className="space-y-4">
              {showError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Por favor seleccione un tamaño</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar tamaño</option>
                  {availableSizes.map((variant) => (
                    <option key={variant.size} value={variant.size}>
                      {variant.size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCartClick}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir a la cotización
              </button>

              <a
                href={`https://wa.me/TUNUMERO?text=Hola, estoy interesado en el producto: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-100 text-green-800 py-3 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Preguntar sobre este producto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;