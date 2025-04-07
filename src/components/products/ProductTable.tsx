
import React from 'react';
import { Product } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';
import ProductLoadingState from './table/ProductLoadingState';
import ProductErrorState from './table/ProductErrorState';
import EmptyProductState from './table/EmptyProductState';
import ProductTableContent from './table/ProductTableContent';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddProduct: () => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ProductTable = ({ 
  products, 
  loading, 
  error, 
  onEdit, 
  onDelete,
  onAddProduct,
  currentPage,
  pageSize,
  onPageChange
}: ProductTableProps) => {
  const { retryFetchProducts, isOffline } = useProducts();
  
  if (loading) {
    return <ProductLoadingState retryFetch={retryFetchProducts} />;
  }

  if (error) {
    return (
      <ProductErrorState 
        error={error} 
        retryFetch={retryFetchProducts} 
        isOffline={isOffline} 
      />
    );
  }

  if (products.length === 0) {
    return <EmptyProductState onAddProduct={onAddProduct} />;
  }

  return (
    <ProductTableContent 
      products={products}
      onEdit={onEdit}
      onDelete={onDelete}
      isOffline={isOffline}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
};

export default ProductTable;
