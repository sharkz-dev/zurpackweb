import React, { useEffect, useState } from 'react';

const Advertisement = () => {
  const [advertisement, setAdvertisement] = useState(null);

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/advertisements/active');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setAdvertisement(data);
          }
        }
      } catch (error) {
        console.error('Error al cargar el anuncio:', error);
      }
    };

    fetchAdvertisement();
  }, []);

  if (!advertisement) return null;

  return (
    <div 
      className="w-full py-3 px-4 text-center transition-all duration-300"
      style={{ 
        backgroundColor: advertisement.backgroundColor,
        color: advertisement.textColor
      }}
    >
      <p className="text-sm md:text-base font-medium">
        {advertisement.text}
      </p>
    </div>
  );
};

export default Advertisement;