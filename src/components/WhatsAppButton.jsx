import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a href="https://wa.me/TUNUMERO" className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
    <MessageCircle size={24} />
  </a>
);

export default WhatsAppButton;