import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, Loader, Share2, ZoomIn, Star, ShoppingCart, Plus, Minus, X, Check } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { useCart } from '../context/CartContext';
import QuotationForm from '../components/QuotationForm';
import ImageModal from '../components/ImageModal';
import Advertisement from '../components/Advertisement';
import ProductDetails from '../components/ProductDetails';

const Catalog = ({ showCart, setShowCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const productsPerPage = 8;
  const [addMessage, setAddMessage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const sortOptions = [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "nameAsc", label: "Nombre A-Z" },
    { value: "nameDesc", label: "Nombre Z-A" }
  ];

  const handleAddToCart = (product, quantity = 1) => {
    addToCart({ ...product, quantity });
    setAddMessage(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} añadido${quantity > 1 ? 's' : ''} al carrito`);
    setTimeout(() => setAddMessage(null), 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
  }, [products]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const shareProduct = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error compartiendo:', error);
      }
    } else {
      const text = `${product.name}\n${product.description}\n${window.location.href}`;
      navigator.clipboard.writeText(text);
      alert('Enlace copiado al portapapeles');
    }
  };

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const Toast = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
      {message}
    </div>
  );

  const QuantitySelector = ({ onAdd }) => {
    const [quantity, setQuantity] = useState(1);
    const [showSelector, setShowSelector] = useState(false);

    const handleAdd = (e) => {
      e.stopPropagation();
      onAdd(quantity);
      setShowSelector(false);
      setQuantity(1);
    };

    if (!showSelector) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(true);
          }}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir a la Cotización
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuantity(prev => Math.max(1, prev - 1));
          }}
          className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            e.stopPropagation();
            setQuantity(Math.max(1, parseInt(e.target.value) || 1));
          }}
          className="w-16 text-center border rounded-md py-1"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuantity(prev => prev + 1);
          }}
          className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd(e);
          }}
          className="flex items-center px-3 py-1 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(false);
            setQuantity(1);
          }}
          className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }; const FilterSidebar = ({ isMobile = false }) => (
    <div className={`
      ${isMobile
        ? 'fixed inset-0 z-50 bg-white transform transition-transform duration-300 overflow-y-auto'
        : 'hidden lg:block w-64 pr-6 border-r'
      }
    `}>
      {isMobile && (
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="p-4">
        {/* Sección de búsqueda */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Buscar</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sección de categorías */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Categorías</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id={`all-categories${isMobile ? '-mobile' : ''}`}
                name={`category${isMobile ? '-mobile' : ''}`}
                checked={selectedCategory === ''}
                onChange={() => {
                  setSelectedCategory('');
                  if (isMobile) setShowMobileFilters(false);
                }}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <label htmlFor={`all-categories${isMobile ? '-mobile' : ''}`} className="ml-2 text-gray-700">
                Todas las categorías
              </label>
            </div>
            {categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  id={`${category}${isMobile ? '-mobile' : ''}`}
                  name={`category${isMobile ? '-mobile' : ''}`}
                  checked={selectedCategory === category}
                  onChange={() => {
                    setSelectedCategory(category);
                    if (isMobile) setShowMobileFilters(false);
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor={`${category}${isMobile ? '-mobile' : ''}`} className="ml-2 text-gray-700">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de ordenamiento */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ordenar por</h3>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${option.value}${isMobile ? '-mobile' : ''}`}
                  name={`sortBy${isMobile ? '-mobile' : ''}`}
                  checked={sortBy === option.value}
                  onChange={() => {
                    setSortBy(option.value);
                    if (isMobile) setShowMobileFilters(false);
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor={`${option.value}${isMobile ? '-mobile' : ''}`} className="ml-2 text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const CartDrawer = () => (
    <>
      {/* Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setShowCart(false)}
        />
      )}

      {/* Carrito */}
      <div className={`fixed top-0 bottom-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'} z-40`}>
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Carrito de Cotización</h3>
            <button
              onClick={() => setShowCart(false)}
              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No hay productos en el carrito
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-2 border rounded bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="ml-auto p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  setShowQuotationForm(true);
                }}
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Solicitar Cotización
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" />
              <span className="text-2xl text-gray-600">Cargando productos...</span>
            </div>
          </div>
        ) : error ? (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
            <div className="text-2xl text-red-600">{error}</div>
          </div>
        ) : (
          <>
            <Advertisement />
            <ImageCarousel />

            <div className="text-center mt-4">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Nuestros Productos
              </h1>
              <p className="mt-2 text-xl text-gray-500">
                Explora nuestra selección de productos
              </p>
            </div>

            {/* Botón de filtros móviles */}
            <div className="lg:hidden mt-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filtros y Ordenamiento
              </button>
            </div>

            <div className="mt-8 flex">
              {/* Sidebar con filtros para desktop */}
              <FilterSidebar />

              {/* Contenido principal */}
              <div className="flex-1 lg:pl-6">
                <div className="min-h-[500px]">
                  {currentProducts.length === 0 ? (
                    <div className="flex justify-center items-center h-[500px]">
                      <p className="text-xl text-gray-500">No se encontraron productos</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                        {currentProducts.map((product) => (
                          <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                          >
                            <div className="relative h-64 overflow-hidden">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                onClick={() => setSelectedImage(product.imageUrl)}
                              />
                              {product.featured && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                  <Star size={16} fill="currentColor" />
                                  <span className="text-sm font-medium">Destacado</span>
                                </div>
                              )}
                              <button
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={() => setSelectedImage(product.imageUrl)}
                              >
                                <ZoomIn className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                            <div className="p-6">
                              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {product.name}
                              </h2>
                              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {product.category}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                                  >
                                    Ver detalles
                                  </button>
                                  <button
                                    onClick={() => shareProduct(product)}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                  >
                                    <Share2 className="w-5 h-5" />
                                  </button>
                                  <QuantitySelector onAdd={(quantity) => handleAddToCart(product, quantity)} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Paginación */}
                      {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2 flex-wrap">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-4 py-2 rounded-md transition-colors duration-300 ${page === pageNum
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de filtros móviles */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileFilters(false)}
          />
          <FilterSidebar isMobile={true} />
        </>
      )}

      {/* Carrito y otros modales */}
      <CartDrawer />
      {showQuotationForm && (
        <QuotationForm onClose={() => setShowQuotationForm(false)} />
      )}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      {addMessage && <Toast message={addMessage} />}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(quantity) => {
            handleAddToCart(selectedProduct, quantity);
            setSelectedProduct(null);
          }}
          onShare={() => {
            shareProduct(selectedProduct);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Catalog;