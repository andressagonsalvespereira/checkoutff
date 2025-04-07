
import { createContext } from 'react';
import { ProductContextType } from './productContextTypes';

export const ProductContext = createContext<ProductContextType | undefined>(undefined);
