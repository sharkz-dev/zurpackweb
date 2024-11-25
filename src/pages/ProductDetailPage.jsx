import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, AlertCircle, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';
import ImageModal from '../components/ImageModal';
import CartDrawer from '../components/CartDrawer';
import QuotationForm from '../components/QuotationForm';

const ProductDetailPage = ({ showCart, setShowCart }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addMessage, setAddMessage] = useState(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/by-slug/${slug}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/catalogo');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (product.hasSizeVariants && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      quantity
    });

    setAddMessage('Producto añadido a la cotización');
    setTimeout(() => setAddMessage(null), 3000);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setAddMessage('Enlace copiado al portapapeles');
        setTimeout(() => setAddMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleQuotationRequest = () => {
    setShowCart(false);
    setShowQuotationForm(true);
  };

  const handleClearCart = () => {
    clearCart();
    setAddMessage('Carrito limpiado exitosamente');
    setTimeout(() => setAddMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/catalogo')}
        className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg mb-6 transition-all duration-300 hover:shadow-md"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver al Catálogo</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
        {showSizeError && (
          <div className="absolute top-4 left-4 right-4 z-10 animate-fade-in-up">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Por favor seleccione una variante</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowImageModal(true)}
            />
            {product.featured && (
              <span className="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                Destacado
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                    {product.category}
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  title="Compartir producto"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              {product.hasSizeVariants && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variante
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition-colors ${
                      showSizeError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar variante</option>
                    {product.sizeVariants
                      .filter(variant => variant.isAvailable)
                      .map((variant) => (
                        <option key={variant.size} value={variant.size}>
                          {variant.size}
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border rounded p-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir a la cotización
              </button>

              <a
                href={`https://wa.me/56928633023?text=Hola, estoy interesado en el producto: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-100 text-green-800 py-3 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar sobre este producto
              </a>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onQuotationRequest={handleQuotationRequest}
        onClearCart={handleClearCart}
      />
      
      {showQuotationForm && (
        <QuotationForm 
          onClose={() => setShowQuotationForm(false)}
          onSuccess={() => {
            setShowQuotationForm(false);
            setShowCart(false);
          }}
        />
      )}

      {showImageModal && (
        <ImageModal
          imageUrl={product.imageUrl}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {addMessage && <Toast message={addMessage} />}
    </div>
  );
};

export default ProductDetailPage;