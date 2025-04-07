
import { useCallback } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';
import { 
  adicionarProdutoAPI, 
  editarProdutoAPI, 
  removerProdutoAPI,
  obterProdutoPorIdAPI,
  obterProdutoPorSlugAPI
} from '../productApi';
import { generateLocalSlug } from '../slugUtils';

// Tipo para as propriedades que o hook recebe
interface UseProductOperationsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductOperations = ({
  products,
  setProducts,
  isOffline
}: UseProductOperationsProps) => {
  
  // Adicionar um novo produto
  const addProduct = useCallback(async (productData: CriarProdutoInput): Promise<Product> => {
    try {
      // Se estiver offline, não podemos adicionar um produto
      if (isOffline) {
        throw new Error('Não é possível adicionar um produto enquanto estiver offline.');
      }
      
      // Adicionar o produto usando a API
      const newProduct = await adicionarProdutoAPI(productData);
      
      // Atualizar a lista de produtos localmente
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      
      return newProduct;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  }, [setProducts, isOffline]);
  
  // Editar um produto existente
  const editProduct = useCallback(async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      // Se estiver offline, não podemos editar um produto
      if (isOffline) {
        throw new Error('Não é possível editar um produto enquanto estiver offline.');
      }
      
      // Editar o produto usando a API
      const updatedProduct = await editarProdutoAPI(id, productData);
      
      // Atualizar a lista de produtos localmente
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === id ? updatedProduct : p)
      );
      
      return updatedProduct;
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      throw error;
    }
  }, [setProducts, isOffline]);
  
  // Remover um produto existente
  const removeProduct = useCallback(async (id: string): Promise<void> => {
    try {
      // Se estiver offline, não podemos remover um produto
      if (isOffline) {
        throw new Error('Não é possível remover um produto enquanto estiver offline.');
      }
      
      // Remover o produto usando a API
      await removerProdutoAPI(id);
      
      // Atualizar a lista de produtos localmente
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      throw error;
    }
  }, [setProducts, isOffline]);
  
  // Obter um produto pelo ID
  const getProductById = useCallback(async (id: string): Promise<Product | undefined> => {
    try {
      console.log('getProductById chamado com ID:', id);
      
      // Primeiro, verificar se já temos o produto em cache
      const cachedProduct = products.find(p => p.id === id);
      if (cachedProduct) {
        console.log('Produto encontrado em cache por ID:', cachedProduct);
        return cachedProduct;
      }
      
      // Se não temos em cache e estamos offline, não podemos buscar do servidor
      if (isOffline) {
        console.warn('Offline: Não foi possível encontrar o produto com ID', id);
        return undefined;
      }
      
      // Buscar do servidor
      console.log('Buscando produto do servidor pelo ID:', id);
      const product = await obterProdutoPorIdAPI(id);
      console.log('Resposta do servidor para busca por ID:', product);
      
      return product;
    } catch (error) {
      console.error('Erro ao obter produto por ID:', error);
      return undefined;
    }
  }, [products, isOffline]);
  
  // Obter um produto pelo slug
  const getProductBySlug = useCallback(async (slug: string): Promise<Product | undefined> => {
    try {
      console.log('getProductBySlug chamado com slug:', slug);
      
      // Primeiro, verificar se já temos o produto em cache
      const cachedProduct = products.find(p => p.slug === slug);
      if (cachedProduct) {
        console.log('Produto encontrado no cache pelo slug exato:', cachedProduct);
        return cachedProduct;
      }
      
      // Se não temos em cache e estamos offline, não podemos buscar do servidor
      if (isOffline) {
        console.warn('Offline: Não foi possível encontrar o produto com slug', slug);
        return undefined;
      }
      
      // Buscar do servidor
      console.log('Buscando produto do servidor pelo slug:', slug);
      const product = await obterProdutoPorSlugAPI(slug);
      console.log('Resposta do servidor para busca por slug:', product);
      
      if (product) {
        // Adicionar ao cache para futuras consultas
        setProducts(prevProducts => {
          // Verificar se o produto já existe no cache
          const exists = prevProducts.some(p => p.id === product.id);
          if (!exists) {
            return [...prevProducts, product];
          }
          return prevProducts;
        });
      }
      
      return product;
    } catch (error) {
      console.error('Erro ao obter produto por slug:', error);
      return undefined;
    }
  }, [products, isOffline, setProducts]);
  
  return {
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
    getProductBySlug
  };
};
