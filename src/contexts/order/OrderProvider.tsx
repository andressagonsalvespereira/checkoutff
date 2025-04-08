import React from 'react';
import { OrderContext } from './OrderContext';
import { OrderProviderProps } from './orderContextTypes';
import { useOrdersFetching, useOrderOperations, useOrderFiltering } from './hooks';

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Hook para buscar pedidos e controlar estado
  const {
    orders,
    setOrders,
    loading,
    error,
    refreshOrders,
    getOrderById, // ✅ Adicionado aqui
  } = useOrdersFetching(); // ✅ Essa função deve vir desse hook!

  const {
    addOrder,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrdersByPaymentMethod,
  } = useOrderOperations(orders, setOrders);

  const {
    filterOrdersByPaymentMethod,
    filterOrdersByStatus,
    filterOrdersByDevice,
    getLatestOrders,
  } = useOrderFiltering(orders);

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
        getOrderById, // ✅ Aqui é onde faltava
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
