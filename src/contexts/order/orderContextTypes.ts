import { ReactNode } from 'react';
import {
  Order,
  CreateOrderInput,
  PaymentMethod,
  PaymentStatus,
  DeviceType,
} from '@/types/order';

export interface OrderProviderProps {
  children: ReactNode;
}

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: CreateOrderInput) => Promise<Order>;
  getOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Order[];
  getOrdersByStatus: (status: PaymentStatus) => Order[];
  getOrdersByDevice: (deviceType: DeviceType) => Order[];
  getLatestOrders: (limit?: number) => Order[];
  updateOrderStatus: (id: string | number, status: PaymentStatus) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  deleteOrder: (id: string | number) => Promise<void>;
  deleteAllOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  getOrderById: (id: string | number) => Promise<Order | null>; // necessário para polling
}
