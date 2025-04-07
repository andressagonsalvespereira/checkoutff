
import React, { useMemo, useCallback } from 'react';
import { ProductContext } from './ProductContext';
import { ProductProviderProps } from './productContextTypes';
import { useProductFetching } from './hooks/useProductFetching';
import { useProductOperations } from './hooks/useProductOperations';

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // Debug log to track component mounting
  React.useEffect(() => {
    console.log('ProductProvider mounted');
    return () => console.log('ProductProvider unmounted');
  }, []);

  const {
    products,
    setProducts,
    loading,
    error,
    networkError: isOffline,
    retryFetchProducts
  } = useProductFetching();

  // Memoizar as props para o hook useProductOperations
  const productOperationsProps = useMemo(() => ({
    products,
    setProducts,
    isOffline
  }), [products, setProducts, isOffline]);

  const {
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
    getProductBySlug
  } = useProductOperations(productOperationsProps);

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(() => ({
    products, 
    loading, 
    error, 
    addProduct, 
    editProduct, 
    removeProduct,
    getProductById,
    getProductBySlug,
    refreshProducts: retryFetchProducts,
    updateProduct: editProduct,
    deleteProduct: removeProduct,
    retryFetchProducts,
    isOffline
  }), [
    products, 
    loading, 
    error, 
    addProduct, 
    editProduct, 
    removeProduct,
    getProductById,
    getProductBySlug,
    retryFetchProducts,
    isOffline
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
