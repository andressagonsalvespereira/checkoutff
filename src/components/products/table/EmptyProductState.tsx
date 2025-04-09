
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyProductStateProps {
  onAddProduct?: () => void;
}

const EmptyProductState = ({ onAddProduct }: EmptyProductStateProps) => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
      <p className="text-sm text-gray-400 mb-4">Clique em "Adicionar Produto" para começar</p>
      
      {onAddProduct && (
        <Button onClick={onAddProduct} size="sm" className="bg-green-600 hover:bg-green-700 text-white mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      )}
    </div>
  );
};

export default EmptyProductState;
