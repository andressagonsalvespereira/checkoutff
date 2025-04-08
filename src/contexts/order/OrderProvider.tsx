import React from 'react';
import { OrderContext } from './OrderContext';
import { OrderProviderProps } from './orderContextTypes';
import { useOrdersFetching, useOrderOperations, useOrderFiltering } from './hooks';

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { orders, setOrders, loading, error, refreshOrders, getOrderById } = useOrdersFetching();
  const { addOrder, updateOrderStatus, deleteOrder, deleteAllOrdersByPaymentMethod } = useOrderOperations(orders, setOrders);
  const { filterOrdersByPaymentMethod, filterOrdersByStatus, filterOrdersByDevice, getLatestOrders } = useOrderFiltering(orders);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        getOrdersByPaymentMethod: filterOrdersByPaymentMethod,
        getOrdersByStatus: filterOrdersByStatus,
        getOrdersByDevice: filterOrdersByDevice,
        getLatestOrders,
        updateOrderStatus,
        refreshOrders,
        deleteOrder,
        deleteAllOrdersByPaymentMethod,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};