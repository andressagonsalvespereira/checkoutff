
import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { buscarProdutosAPI } from '../productApi';
import { loadProducts, saveProducts } from '../productUtils';

export const useProductFetching = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const fetchAttemptedRef = useRef(false);

  const fetchProducts = useCallback(async (): Promise<void> => {
    // Evitar múltiplas chamadas da mesma função
    if (fetchAttemptedRef.current) return;
    
    console.log('Iniciando busca de produtos');
    fetchAttemptedRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const formattedProducts = await buscarProdutosAPI();
      console.log('Produtos carregados com sucesso:', formattedProducts.length);
      console.log('Amostra do primeiro produto:', formattedProducts[0]);
      
      setProducts(formattedProducts);
      
      // Sync local storage with latest data
      saveProducts(formattedProducts);
      setNetworkError(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      
      // If we have a network error, try to load from local storage as fallback
      try {
        const localProducts = loadProducts();
        console.log('Produtos carregados do armazenamento local:', localProducts.length);
        setProducts(localProducts);
        setNetworkError(true);
        toast({
          title: "Modo offline",
          description: "Carregando produtos do armazenamento local devido à falha na conexão",
          variant: "destructive",
        });
      } catch (localErr) {
        console.error('Error loading local products:', localErr);
        toast({
          title: "Erro",
          description: "Falha ao carregar produtos, verifique sua conexão",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add a retry mechanism with force refresh
  const retryFetchProducts = useCallback(async (): Promise<void> => {
    console.log('Tentando buscar produtos novamente');
    setNetworkError(false);
    fetchAttemptedRef.current = false;
    return fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    console.log('useEffect de fetchProducts executado');
    if (!fetchAttemptedRef.current) {
      fetchProducts();
    }
    
    // Cleanup function
    return () => {
      console.log('Limpeza do useEffect de fetchProducts');
    };
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    loading,
    error,
    networkError,
    retryFetchProducts
  };
};
