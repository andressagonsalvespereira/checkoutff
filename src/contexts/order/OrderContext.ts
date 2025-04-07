
import { createContext } from 'react';
import { OrderContextType } from './orderContextTypes';

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
