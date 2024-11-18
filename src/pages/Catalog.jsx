import React, { useState, useEffect } from 'react';
import { Search, Filter, SortDesc, Loader, Share2, ZoomIn, Star, ShoppingCart, Plus, Minus, X, Check } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { useCart } from '../context/CartContext';
import QuotationForm from '../components/QuotationForm';
import ImageModal from '../components/ImageModal';
import Advertisement from '../components/Advertisement';
import ProductDetails from '../components/ProductDetails';
import SizeSelector from '../components/SizeSelector';

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
  const productsPerPage = 12;
  const [addMessage, setAddMessage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeErrors, setSizeErrors] = useState({});
  const [showSelectors, setShowSelectors] = useState({});

  const sortOptions = [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "nameAsc", label: "Nombre A-Z" },
    { value: "nameDesc", label: "Nombre Z-A" }
  ];

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (!response.ok) throw new Error('Error al cargar los productos');
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

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
    setSizeErrors(prev => ({
      ...prev,
      [productId]: null
    }));
  };

  const handleAddToCart = (product, quantity = 1) => {
    if (product.hasSizeVariants && !selectedSizes[product._id]) {
      setSizeErrors(prev => ({
        ...prev,
        [product._id]: 'Por favor selecciona un tamaño'
      }));
      return;
    }

    addToCart({
      ...product,
      selectedSize: product.hasSizeVariants ? selectedSizes[product._id] : null
    }, quantity);

    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      delete newSizes[product._id];
      return newSizes;
    });

    setShowSelectors(prev => ({
      ...prev,
      [product._id]: false
    }));

    setAddMessage(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} añadido${quantity > 1 ? 's' : ''} al carrito`);
    setTimeout(() => setAddMessage(null), 2000);
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

  const QuantitySelector = ({ product, onAdd }) => {
    const [quantity, setQuantity] = useState(1);
  
    const handleAdd = (e) => {
      e.stopPropagation();
      if (!product.hasSizeVariants || selectedSizes[product._id]) {
        onAdd(quantity);
        setQuantity(1);
        return;
      }
      
      setSizeErrors(prev => ({
        ...prev,
        [product._id]: 'Por favor selecciona un tamaño'
      }));
    };
  
    if (!showSelectors[product._id]) {
      return (
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelectors(prev => ({
              ...prev,
              [product._id]: true
            }));
            setSizeErrors(prev => ({
              ...prev,
              [product._id]: null
            }));
          }}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
        >
          <Plus className="w-4 h-4 mr-1" />
          Cotizar
        </button>
      );
    }
  
    return (
      <div className="space-y-2">
        {product.hasSizeVariants && (
          <div>
            <SizeSelector
              variants={product.sizeVariants}
              selectedSize={selectedSizes[product._id]}
              onSelect={(size) => handleSizeSelect(product._id, size)}
              error={sizeErrors[product._id]}
            />
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(prev => Math.max(1, prev - 1));
            }}
            className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
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
            className="w-14 text-center border rounded py-1 text-sm"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(prev => prev + 1);
            }}
            className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center px-3 py-1 rounded text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(1);
              setShowSelectors(prev => ({
                ...prev,
                [product._id]: false
              }));
              setSizeErrors(prev => ({
                ...prev,
                [product._id]: null
              }));
            }}
            className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
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
  const FilterSidebar = ({ isMobile = false }) => (
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
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setShowCart(false)}
        />
      )}

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
                  <div key={`${item._id}-${item.selectedSize || 'default'}`} className="flex gap-4 p-2 border rounded bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Tamaño: {item.selectedSize}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedSize)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id, item.selectedSize)}
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
              <FilterSidebar />

              <div className="flex-1 lg:pl-6">
                <div className="min-h-[500px]">
                  {currentProducts.length === 0 ? (
                    <div className="flex justify-center items-center h-[500px]">
                      <p className="text-xl text-gray-500">No se encontraron productos</p>
                    </div>
                  ) : (
                    <>
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
 {currentProducts.map((product) => (
   <div
     key={product._id}
     className="bg-white border rounded-lg overflow-hidden p-4 flex flex-col"
   >
   <div className="relative flex justify-center mb-4">
     <img
       src={product.imageUrl}
       alt={product.name}
       className="h-48 object-contain"
       onClick={() => setSelectedImage(product.imageUrl)}
     />
     {product.featured && (
       <div className="absolute top-0 left-0 bg-yellow-400 text-white px-2 py-1 text-xs rounded-br">
         <Star size={12} fill="currentColor" className="inline mr-1" />
         Destacado
       </div>
     )}
   </div>
   
   <div className="flex-1 flex flex-col">
     <h2 className="text-lg font-semibold text-gray-800 mb-1">
       {product.name}
     </h2>
     
     <div className="text-sm text-gray-500 uppercase mb-4">
       {product.category}
     </div>

     {product.hasSizeVariants && (
       <div className="mb-3">
         <select
           value={selectedSizes[product._id] || ''}
           onChange={(e) => handleSizeSelect(product._id, e.target.value)}
           className="w-full p-2 border rounded text-sm"
         >
           <option value="">Seleccionar tamaño</option>
           {product.sizeVariants.map((variant) => (
             <option key={variant.size} value={variant.size}>
               {variant.size}
             </option>
           ))}
         </select>
         {sizeErrors[product._id] && (
           <p className="text-red-500 text-xs mt-1">{sizeErrors[product._id]}</p>
         )}
       </div>
     )}
     
     <div className="mt-auto">
       <button 
         onClick={() => setSelectedProduct(product)}
         className="w-full bg-green-600 text-white py-2 rounded font-medium text-sm mb-2 hover:bg-green-700"
       >
         VER PRODUCTO
       </button>
       
       <div className="flex items-center gap-1">
         <input
           type="number"
           min="1"
           value="1"
           className="w-16 text-center border rounded py-1 text-sm"
         />
         <button
           onClick={() => handleAddToCart(product, 1)}
           className="flex-1 bg-gray-100 text-gray-800 py-1 px-3 rounded font-medium text-sm hover:bg-gray-200"
         >
           AÑADIR A LA COTIZACIÓN
         </button>
       </div>
     </div>
   </div>
 </div>
))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2 flex-wrap">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                                page === pageNum
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

      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileFilters(false)}
          />
          <FilterSidebar isMobile={true} />
        </>
      )}

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
          selectedSize={selectedSizes[selectedProduct._id]}
          onSizeSelect={(size) => handleSizeSelect(selectedProduct._id, size)}
          sizeError={sizeErrors[selectedProduct._id]}
        />
      )}
    </div>
  );
};

export default Catalog;