import React from 'react';

const Toast = ({ message }) => (
  <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
    {message}
  </div>
);

export default Toast;