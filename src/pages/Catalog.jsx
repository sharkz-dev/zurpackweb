import React, { useState, useMemo, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCartOperations } from '../hooks/useCartOperations';
import { useProductFilters } from '../hooks/useProductFilters';
import ImageCarousel from '../components/ImageCarousel';
import QuotationForm from '../components/QuotationForm';
import ImageModal from '../components/ImageModal';
import Advertisement from '../components/Advertisement';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import FilterPanel from '../components/FilterPanel';
import Toast from '../components/Toast';

const MemoizedProductCard = memo(ProductCard);
const MemoizedAdvertisement = memo(Advertisement);
const MemoizedImageCarousel = memo(ImageCarousel);
const MemoizedFilterPanel = memo(FilterPanel);

const PRODUCTS_PER_PAGE = 12;

const Catalog = ({ showCart, setShowCart }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { 
    products, 
    loading, 
    error,
  } = useProducts();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
    categories,
    getFilteredProducts
  } = useProductFilters(products);
  
  const { addMessage, handleAddToCart } = useCartOperations();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => getFilteredProducts(), [
    products,
    searchTerm,
    selectedCategory,
    sortOrder
  ]);

  const currentProducts = useMemo(() => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, sortOrder]);

  const handleQuotationRequest = () => {
    setShowCart(false);
    setShowQuotationForm(true);
  };

  const handleClearCart = () => {
    clearCart();
    setAddMessage('Carrito limpiado exitosamente');
    setTimeout(() => setAddMessage(null), 3000);
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
      let pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (page <= 3) {
          pages = [1, 2, 3, 4, '...', totalPages];
        } else if (page >= totalPages - 2) {
          pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
          pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
        }
      }

      return pages.map((pageNum, index) => {
        if (pageNum === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-4 py-2">
              ...
            </span>
          );
        }
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === pageNum
                ? 'bg-green-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        );
      });
    };

    return (
      <div className="mt-8 flex justify-center items-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader className="animate-spin" />
          <span className="text-2xl text-gray-600">Cargando productos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MemoizedAdvertisement />
        <div className="mb-8">
          <MemoizedImageCarousel />
        </div>
        <div className="text-center mt-4 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Nuestros Productos
          </h1>
          <p className="mt-2 text-xl text-gray-500">
            Explora nuestra selección de productos
          </p>
        </div>

        <div className="mt-8">
          <MemoizedFilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            categories={categories}
          />
        </div>

        <div className="mt-8">
          <div className="min-h-[500px]">
            {currentProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-lg shadow-sm">
                <p className="text-xl text-gray-500 mb-4">
                  No se encontraron productos
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSortOrder('featured');
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {currentProducts.map((product) => (
                  <MemoizedProductCard
                    key={product._id}
                    product={product}
                    onImageClick={setSelectedImage}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            <PaginationControls />
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
      
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      
      {addMessage && <Toast message={addMessage} />}
    </div>
  );
};

export default memo(Catalog);