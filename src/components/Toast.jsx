import React from 'react';

const Toast = ({ message }) => (
    <div className="fixed left-0 right-0 bottom-4 mx-auto w-fit z-50">
      <div className="animate-cart-notification bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
    {message}
  </div>
  </div>
);

export default Toast;