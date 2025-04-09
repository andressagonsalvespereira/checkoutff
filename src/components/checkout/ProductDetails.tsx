import { PaymentStatus } from '@/types/order';



export interface ProductDetailsType {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isDigital: boolean;
  // ✅ Adicione essas duas propriedades:
  usarProcessamentoPersonalizado?: boolean;
  statusCartaoManual?: PaymentStatus | null;
}

export const getProductDetails = (slug?: string): ProductDetailsType => {
  // This is a mock function that should be replaced with a real API call
  // You would typically fetch product details from an API based on the slug
  
  // Default product
  const defaultProduct: ProductDetailsType = {
    id: 'prod-001',
    name: 'Produto Demo',
    price: 99.90,
    description: 'Este é um produto de demonstração para o checkout.',
    image: '/placeholder.svg',
    isDigital: false,
  };
  
  // Mock products based on slug
  const products: Record<string, ProductDetailsType> = {
    'assinatura-anual-cineflick-card': {
      id: 'prod-cineflick',
      name: 'Assinatura Anual CineFlick',
      price: 129.90,
      description: 'Acesso a todos os filmes e séries por 1 ano',
      image: 'https://s3.amazonaws.com/production.kirvano.com/products/cbb433be-6b46-45fe-853a-27ca4e89bfa3/cover-1719857746223.webp',
      isDigital: true,
    },
    'assinatura-anual-cineflick-card-1': {
      id: 'prod-cineflick-1',
      name: 'Assinatura Anual CineFlick Card',
      price: 129.90,
      description: 'Você ira receber seu acesso no Email',
      image: 'https://s3.amazonaws.com/production.kirvano.com/products/cbb433be-6b46-45fe-853a-27ca4e89bfa3/cover-1719857746223.webp',
      isDigital: false,
    },
    'assinatura-mensal-cineflick-card': {
      id: 'prod-cineflick-mensal',
      name: 'Assinatura Mensal CineFlick',
      price: 19.90,
      description: 'Acesso a todos os filmes e séries por 1 mês',
      image: '/placeholder.svg',
      isDigital: true,
    },
    'product-demo': {
      id: 'prod-demo',
      name: 'Produto de Demonstração',
      price: 59.90,
      description: 'Este é um produto físico de demonstração para testar o checkout.',
      image: '/placeholder.svg',
      isDigital: false,
    },
  };
  
  // Return product details based on slug, or default if not found
  return slug && products[slug] ? products[slug] : defaultProduct;
};

export default getProductDetails;
