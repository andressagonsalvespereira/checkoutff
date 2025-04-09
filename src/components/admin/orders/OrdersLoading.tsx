
import React from 'react';
import { Loader2 } from 'lucide-react';

const OrdersLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
      <p className="text-gray-500">Carregando pedidos...</p>
    </div>
  );
};

export default OrdersLoading;
