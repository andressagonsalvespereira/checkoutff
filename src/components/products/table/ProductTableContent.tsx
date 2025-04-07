
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Product } from '@/types/product';
import ProductTableRow from './ProductTableRow';
import OfflineBanner from './OfflineBanner';
import ProductPagination from './ProductPagination';

interface ProductTableContentProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isOffline: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ProductTableContent = ({ 
  products, 
  onEdit, 
  onDelete, 
  isOffline,
  currentPage,
  pageSize,
  onPageChange
}: ProductTableContentProps) => {
  // Calculate pagination
  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto rounded-md border">
      {isOffline && <OfflineBanner />}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <ProductTableRow 
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
      
      {/* Display message when current page has no results but there are products */}
      {paginatedProducts.length === 0 && products.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          Nenhum produto encontrado nesta página. 
          <button 
            onClick={() => onPageChange(1)} 
            className="ml-2 text-blue-500 hover:underline"
          >
            Ir para a primeira página
          </button>
        </div>
      )}
      
      {/* Pagination component */}
      <ProductPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductTableContent;
