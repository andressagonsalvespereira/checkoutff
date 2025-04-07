
import { ReactNode } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: CriarProdutoInput) => Promise<Product>;
  editProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | undefined>;
  getProductBySlug: (slug: string) => Promise<Product | undefined>;
  refreshProducts: () => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  retryFetchProducts: () => Promise<void>;
  isOffline: boolean;
}

export interface ProductProviderProps {
  children: ReactNode;
}
