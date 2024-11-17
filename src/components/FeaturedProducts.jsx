import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const FeaturedProducts = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => 
        prev === products.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => 
        prev === 0 ? products.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!products.length) return null;

  return (
    <div className="relative w-full overflow-hidden h-[500px] mb-12 bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-5" />
      
      {/* Título de la sección */}
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Star className="text-yellow-500" fill="currentColor" />
          Productos Destacados
        </h2>
      </div>

      {/* Carrusel */}
      <div className="relative h-full">
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div 
              key={product._id}
              className="min-w-full h-full flex items-center justify-center p-8"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden flex max-w-5xl w-full">
                <div className="w-1/2 relative overflow-hidden group">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="w-1/2 p-8 flex flex-col justify-center">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {product.category}
                  </span>
                  <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
                  <button 
                    onClick={() => window.open(`https://wa.me/TUNUMERO?text=Hola, me interesa el producto destacado: ${product.name}`)}
                    className="mt-auto bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 group"
                  >
                    <span>Consultar Producto</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controles */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          disabled={isTransitioning}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          disabled={isTransitioning}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-500 w-4' 
                  : 'bg-gray-300 hover:bg-green-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;