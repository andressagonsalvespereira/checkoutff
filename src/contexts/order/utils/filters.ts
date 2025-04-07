
import { Order, PaymentMethod } from '@/types/order';

// This file is now kept for backward compatibility
// The filtering functionality has been moved to the useOrderFiltering hook

// Filter orders by payment method (legacy method, use useOrderFiltering hook instead)
export const filterOrdersByPaymentMethod = (orders: Order[], method: PaymentMethod): Order[] => {
  return orders.filter(order => order.paymentMethod === method);
};
