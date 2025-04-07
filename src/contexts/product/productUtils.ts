
import { Product, CriarProdutoInput } from '@/types/product';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from './slugUtils';

// Local storage key for products
const LOCAL_STORAGE_KEY = 'cached_products';

// Load products from local storage
export const loadProducts = (): Product[] => {
  try {
    const productsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!productsJson) {
      return [];
    }
    return JSON.parse(productsJson);
  } catch (error) {
    console.error('Error loading products from local storage:', error);
    return [];
  }
};

// Save products to local storage
export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to local storage:', error);
  }
};

// Generate a unique local slug
const generateLocalSlug = (nome: string, existingProducts: Product[]): string => {
  let baseSlug = slugify(nome);
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug already exists in local products
  while (existingProducts.some(p => p.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// Create a product (local version)
export const createProduct = (data: CriarProdutoInput): Product => {
  const existingProducts = loadProducts();
  const slug = generateLocalSlug(data.nome, existingProducts);
  
  const newProduct: Product = {
    id: `local_${uuidv4()}`,
    nome: data.nome,
    descricao: data.descricao,
    preco: data.preco,
    urlImagem: data.urlImagem,
    digital: data.digital,
    slug: slug,
    usarProcessamentoPersonalizado: data.usarProcessamentoPersonalizado,
    statusCartaoManual: data.statusCartaoManual
  };
  
  // Add to local storage
  const products = loadProducts();
  products.unshift(newProduct);
  saveProducts(products);
  
  return newProduct;
};

export const updateExistingProduct = (product: Product, data: CriarProdutoInput): Product => {
  // If name changed, update slug
  const nomeAlterado = product.nome !== data.nome;
  const slug = nomeAlterado 
    ? generateLocalSlug(data.nome, loadProducts().filter(p => p.id !== product.id))
    : product.slug;
  
  return {
    ...product,
    nome: data.nome,
    descricao: data.descricao,
    preco: data.preco,
    urlImagem: data.urlImagem,
    digital: data.digital,
    slug: slug,
    usarProcessamentoPersonalizado: data.usarProcessamentoPersonalizado,
    statusCartaoManual: data.statusCartaoManual
  };
};

// Update product locally
export const updateProduct = (id: string, data: Partial<Product>): Product | undefined => {
  const products = loadProducts();
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return undefined;
  }
  
  const currentProduct = products[productIndex];
  
  // If name is changing, update slug
  let updatedSlug = currentProduct.slug;
  if (data.nome && data.nome !== currentProduct.nome) {
    updatedSlug = generateLocalSlug(data.nome, products.filter(p => p.id !== id));
  }
  
  const updatedProduct = {
    ...currentProduct,
    ...data,
    slug: data.slug || updatedSlug
  };
  
  products[productIndex] = updatedProduct;
  saveProducts(products);
  
  return updatedProduct;
};

// Delete product locally
export const deleteProduct = (id: string): boolean => {
  const products = loadProducts();
  const newProducts = products.filter(p => p.id !== id);
  
  if (newProducts.length === products.length) {
    return false;
  }
  
  saveProducts(newProducts);
  return true;
};

// Get product by ID locally
export const getProductById = (id: string): Product | undefined => {
  const products = loadProducts();
  return products.find(p => p.id === id);
};

// Get product by slug locally
export const getProductBySlug = (slug: string): Product | undefined => {
  const products = loadProducts();
  return products.find(p => p.slug === slug);
};
