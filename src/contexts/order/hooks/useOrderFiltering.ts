import { useCallback } from 'react';
import { Order, PaymentMethod, PaymentStatus, DeviceType } from '@/types/order';

export const useOrderFiltering = (orders: Order[]) => {
  const filterOrdersByPaymentMethod = useCallback(
    (paymentMethod: PaymentMethod): Order[] => {
      return orders.filter((order) => order.paymentMethod === paymentMethod);
    },
    [orders]
  );

  const filterOrdersByStatus = useCallback(
    (status: PaymentStatus): Order[] => {
      return orders.filter((order) => order.paymentStatus === status);
    },
    [orders]
  );

  const filterOrdersByDevice = useCallback(
    (deviceType: DeviceType): Order[] => {
      return orders.filter((order) => order.deviceType === deviceType);
    },
    [orders]
  );

  const getLatestOrders = useCallback(
    (limit?: number): Order[] => {
      const sorted = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
      return limit ? sorted.slice(0, limit) : sorted;
    },
    [orders]
  );

  return {
    filterOrdersByPaymentMethod,
    filterOrdersByStatus,
    filterOrdersByDevice,
    getLatestOrders,
  };
};