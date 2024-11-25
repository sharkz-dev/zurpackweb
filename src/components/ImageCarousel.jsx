import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = [
    {
      url: '/images/slide1.jpg',
      title: 'Nuestro equipo',
      description: 'Prueba 01'
    },
    {
      url: '/images/slide2.jpg',
      title: 'Título 2',
      description: 'Descripción de la imagen 2'
    },
    {
      url: '/images/slide3.jpg',
      title: 'Título 3',
      description: 'Descripción de la imagen 3'
    },
  ];

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  // Manejo táctil
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 overflow-hidden">
      {/* Contenedor principal con altura responsiva */}
      <div className="relative w-full">
        {/* En móvil usa aspect ratio, en desktop altura fija */}
        <div className="md:h-[500px] relative">
          {/* Contenedor móvil con aspect ratio */}
          <div className="md:hidden relative w-full" style={{ paddingBottom: '75%' }}> {/* 4:3 para móvil */}
            <div className="absolute inset-0">
              <div 
                className="relative h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {images.map((image, index) => (
                  <div key={index} className="relative min-w-full h-full flex-shrink-0">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 p-4 w-full">
                      <h2 className="text-xl font-bold text-white mb-1">{image.title}</h2>
                      <p className="text-sm text-white/90">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenedor desktop */}
          <div className="hidden md:block h-full">
            <div 
              className="absolute inset-0 w-full h-full flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="relative min-w-full h-full flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="max-w-7xl mx-auto">
                      <h2 className="text-3xl font-bold text-white mb-2">{image.title}</h2>
                      <p className="text-lg text-white/90">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            disabled={isTransitioning}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            disabled={isTransitioning}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 
                ${index === currentIndex 
                  ? 'w-6 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;