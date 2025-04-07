
import React from 'react';
import { OrderContext } from './OrderContext';
import { OrderProviderProps } from './orderContextTypes';
import { useOrdersFetching, useOrderOperations, useOrderFiltering } from './hooks';

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Use our custom hooks to manage orders state and operations
  const { 
    orders, 
    setOrders, 
    loading, 
    error, 
    refreshOrders 
  } = useOrdersFetching();

  const { 
    addOrder, 
    updateOrderStatus, 
    deleteOrder, 
    deleteAllOrdersByPaymentMethod 
  } = useOrderOperations(orders, setOrders);

  // Use our new filtering hook
  const {
    filterOrdersByPaymentMethod,
    filterOrdersByStatus,
    filterOrdersByDevice,
    getLatestOrders
  } = useOrderFiltering(orders);

  return (
    <OrderContext.Provider value={{ 
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
      deleteAllOrdersByPaymentMethod
    }}>
      {children}
    </OrderContext.Provider>
  );
};
