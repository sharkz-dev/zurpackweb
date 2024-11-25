import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CategoryAutocomplete = ({ value, onChange, categories, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      const filtered = categories.filter(category =>
        category.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [inputValue, categories]);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectCategory = (category) => {
    setInputValue(category);
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
          className="w-full p-2 pr-8 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Seleccionar o escribir categoría"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 transition-colors"
                onClick={() => handleSelectCategory(category)}
              >
                {category}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">
              No se encontraron categorías
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryAutocomplete;