
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';

export const useProductCheckout = (productSlug: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProductBySlug, loading: productsLoading, products, isOffline } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!productSlug) {
          console.error('Slug do produto não fornecido');
          setLoading(false);
          setProductNotFound(true);
          return;
        }
        
        console.log('=== INÍCIO DA BUSCA DE PRODUTO ===');
        console.log(`useProductCheckout - Buscando produto com slug: "${productSlug}"`);
        console.log('useProductCheckout - Estado offline:', isOffline);
        console.log(`useProductCheckout - Produtos disponíveis no contexto: ${products?.length || 0}`);
        
        setLoading(true);
        setProductNotFound(false);
        
        // Log all available slugs for debugging
        if (products && products.length > 0) {
          console.log('useProductCheckout - Slugs disponíveis:');
          products.forEach(p => console.log(`- ${p.slug} (ID: ${p.id})`));
        }
        
        // Primeiro, procuramos exatamente pelo slug fornecido
        let productData = await getProductBySlug(productSlug);
        console.log('useProductCheckout - Resultado da busca por slug exato:', productData ? 'Encontrado' : 'Não encontrado');
        
        // Se não encontrado com o slug exato, verificamos se pode haver uma correspondência parcial
        if (!productData) {
          console.log('useProductCheckout - Produto não encontrado com slug exato, verificando produtos em cache...');
          
          // Verificar se já temos produtos na lista e procurar pelo slug
          if (products && products.length > 0) {
            // Verificar correspondência exata primeiro
            let cachedProduct = products.find(p => p.slug === productSlug);
            console.log('useProductCheckout - Produto encontrado com correspondência exata?', !!cachedProduct);
            
            if (!cachedProduct) {
              console.log('useProductCheckout - Tentando buscar com slug parcial...');
              // Verificar se o slug é parte de um slug de produto 
              // (caso tenha havido um sufixo adicionado como '-1')
              const baseSlug = productSlug.split('-')[0]; // Obter slug base sem sufixo
              console.log('useProductCheckout - Tentando com slug base:', baseSlug);
              
              cachedProduct = products.find(
                p => p.slug === baseSlug || p.slug.startsWith(baseSlug + '-')
              );
              
              if (cachedProduct) {
                console.log('useProductCheckout - Produto encontrado com slug parcial:', cachedProduct.slug);
              } else {
                console.log('useProductCheckout - Nenhuma correspondência parcial encontrada com o slug base');
              }
            }
            
            if (cachedProduct) {
              productData = cachedProduct;
            }
          }
          
          // Se ainda não encontramos, tentamos buscar novamente pela API pelo slug base
          if (!productData && productSlug.includes('-')) {
            const baseSlug = productSlug.split('-')[0];
            console.log('useProductCheckout - Tentando buscar com slug base via API:', baseSlug);
            productData = await getProductBySlug(baseSlug);
            console.log('useProductCheckout - Resultado da busca por slug base:', productData ? 'Encontrado' : 'Não encontrado');
          }
          
          // Verificar correspondência por ID se o slug parece ser um número
          if (!productData && /^\d+$/.test(productSlug)) {
            console.log('useProductCheckout - Slug parece ser um ID, tentando buscar por ID:', productSlug);
            const productId = productSlug;
            // Usar o contexto de produto para obter o produto por ID
            const productById = products?.find(p => p.id === productId);
            if (productById) {
              console.log('useProductCheckout - Produto encontrado por ID:', productById.id);
              productData = productById;
            } else {
              console.log('useProductCheckout - Nenhum produto encontrado por ID');
            }
          }
          
          // Se continua não encontrado, tenta procurar por substring
          if (!productData && products && products.length > 0) {
            console.log('useProductCheckout - Tentando buscar produtos que contenham o slug como substring...');
            const matchingProducts = products.filter(p => 
              p.slug.includes(productSlug) || productSlug.includes(p.slug)
            );
            
            if (matchingProducts.length > 0) {
              console.log('useProductCheckout - Produtos encontrados por substring:', 
                matchingProducts.map(p => p.slug).join(', '));
              productData = matchingProducts[0]; // Usar o primeiro produto correspondente
            } else {
              console.log('useProductCheckout - Nenhum produto encontrado por substring');
            }
          }
          
          // Último recurso - se ainda não encontramos, simplesmente pegar o primeiro produto disponível (se houver)
          if (!productData && products && products.length > 0) {
            console.log('useProductCheckout - Nenhuma correspondência encontrada. Usando o primeiro produto disponível como fallback');
            productData = products[0];
            console.log('useProductCheckout - Produto fallback:', productData.slug);
          }
        }
        
        if (productData) {
          console.log('useProductCheckout - Produto final selecionado:', productData.slug);
          setProduct(productData);
          setProductNotFound(false);
        } else {
          console.error('useProductCheckout - Produto não encontrado para o slug:', productSlug);
          if (products) {
            console.log('useProductCheckout - Todos os produtos disponíveis:', 
              products.map(p => `${p.slug} (ID: ${p.id})`).join(', '));
          }
          setProductNotFound(true);
          toast({
            title: "Produto não encontrado",
            description: `Não foi possível encontrar o produto com identificador "${productSlug}"`,
            variant: "destructive",
          });
        }
        console.log('=== FIM DA BUSCA DE PRODUTO ===');
      } catch (error) {
        console.error('useProductCheckout - Erro ao carregar produto:', error);
        setProductNotFound(true);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (!productsLoading) {
      fetchProduct();
    } else {
      console.log('useProductCheckout - Aguardando carregamento dos produtos...');
    }
  }, [productSlug, getProductBySlug, navigate, toast, productsLoading, products, isOffline]);
  
  return {
    product,
    loading: loading || productsLoading,
    productNotFound
  };
};
