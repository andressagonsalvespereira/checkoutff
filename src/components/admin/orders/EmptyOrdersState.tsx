
import React from 'react';
import { Info } from 'lucide-react';

const EmptyOrdersState = () => {
  return (
    <div className="text-center py-8">
      <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Nenhum pedido encontrado</p>
    </div>
  );
};

export default EmptyOrdersState;
