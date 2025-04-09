
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/types/product';
import ProductTableActions from './ProductTableActions';

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTableRow = ({ product, onEdit, onDelete }: ProductTableRowProps) => {
  // Debug log to see the actual product data
  console.log('Product in TableRow:', product);
  
  // Formatar o preço adequadamente, garantindo que seja um número válido
  const formattedPrice = isNaN(Number(product.preco)) 
    ? 'R$ 0,00' 
    : `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`;

  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{product.nome || 'Sem nome'}</TableCell>
      <TableCell className="max-w-xs truncate">{product.descricao || 'Sem descrição'}</TableCell>
      <TableCell>{formattedPrice}</TableCell>
      <TableCell>
        {product.urlImagem ? (
          <div className="h-10 w-10 overflow-hidden rounded-md">
            <img 
              src={product.urlImagem} 
              alt={product.nome} 
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        ) : (
          <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-xs text-gray-500">Sem imagem</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 text-xs rounded-full ${product.digital ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
          {product.digital ? 'Digital' : 'Físico'}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <ProductTableActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
