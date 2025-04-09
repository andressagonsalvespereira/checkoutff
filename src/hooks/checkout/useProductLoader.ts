
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';

export const useProductLoader = (productId: string | undefined, preloadedProduct?: Product | null) => {
  const { getProductById } = useProducts();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(preloadedProduct || null);
  const [loading, setLoading] = useState(!preloadedProduct);
  
  useEffect(() => {
    if (preloadedProduct) {
      console.log('useProductLoader - Usando produto pré-carregado:', preloadedProduct);
      setProduct(preloadedProduct);
      setLoading(false);
      return;
    }
    
    async function fetchProduct() {
      try {
        if (!productId) {
          console.error('ID do produto não fornecido');
          throw new Error('ID do produto não fornecido');
        }
        
        console.log('Carregando produto com ID:', productId);
        setLoading(true);
        
        const productData = await getProductById(productId);
        
        console.log('Dados do produto carregado:', productData);
        
        if (!productData) {
          console.error('Produto não encontrado para o ID:', productId);
          throw new Error('Produto não encontrado');
        }
        
        setProduct(productData);
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (!preloadedProduct) {
      fetchProduct();
    }
  }, [productId, getProductById, toast, preloadedProduct]);
  
  useEffect(() => {
    if (preloadedProduct) {
      setProduct(preloadedProduct);
      setLoading(false);
    }
  }, [preloadedProduct]);
  
  return {
    product,
    loading
  };
};
