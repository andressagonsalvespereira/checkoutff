
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductHeaderProps {
  onAddProduct: () => void;
}

const ProductHeader = ({ onAddProduct }: ProductHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
      <CardTitle className="text-2xl font-bold">Gerenciar Produtos</CardTitle>
      <Button 
        onClick={onAddProduct} 
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Produto
      </Button>
    </CardHeader>
  );
};

export default ProductHeader;
