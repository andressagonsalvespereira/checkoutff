
import { useMemo } from 'react';
import { Order, PaymentMethod } from '@/types/order';

/**
 * Hook for order filtering operations
 * @param orders The list of orders to filter
 * @returns Object with methods to filter orders
 */
export const useOrderFiltering = (orders: Order[]) => {
  // Filter orders by payment method
  const filterOrdersByPaymentMethod = useMemo(
    () => (method: PaymentMethod): Order[] => {
      return orders.filter(order => order.paymentMethod === method);
    },
    [orders]
  );

  // Filter orders by payment status
  const filterOrdersByStatus = useMemo(
    () => (status: Order['paymentStatus']): Order[] => {
      return orders.filter(order => order.paymentStatus === status);
    },
    [orders]
  );

  // Filter orders by device type
  const filterOrdersByDevice = useMemo(
    () => (deviceType: Order['deviceType']): Order[] => {
      return orders.filter(order => order.deviceType === deviceType);
    },
    [orders]
  );

  // Get the latest orders (limited by count)
  const getLatestOrders = useMemo(
    () => (count: number = 5): Order[] => {
      return [...orders]
        .sort((a, b) => {
          // Sort by creation date (newest first)
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, count);
    },
    [orders]
  );

  return {
    filterOrdersByPaymentMethod,
    filterOrdersByStatus,
    filterOrdersByDevice,
    getLatestOrders
  };
};
