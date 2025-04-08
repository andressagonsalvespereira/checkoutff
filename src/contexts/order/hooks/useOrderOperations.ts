import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, CreateOrderInput, PaymentMethod, PaymentStatus } from '@/types/order';
import { createOrder } from '../utils/creators';
import { convertDBOrderToOrder } from '../utils/converters';

export const useOrderOperations = (orders: Order[], setOrders: (orders: Order[]) => void) => {
  const addOrder = useCallback(
    async (orderData: CreateOrderInput): Promise<Order> => {
      const newOrder = await createOrder(orderData);
      setOrders([...orders, newOrder]);
      return newOrder;
    },
    [orders, setOrders]
  );

  const updateOrderStatus = useCallback(
    async (id: string | number, status: PaymentStatus): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status: status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updatedOrder = convertDBOrderToOrder(data);
      setOrders(orders.map((o) => (o.id === id ? updatedOrder : o)));
      return updatedOrder;
    },
    [orders, setOrders]
  );

  const deleteOrder = useCallback(
    async (id: string | number): Promise<void> => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(orders.filter((o) => o.id !== id));
    },
    [orders, setOrders]
  );

  const deleteAllOrdersByPaymentMethod = useCallback(
    async (paymentMethod: PaymentMethod): Promise<void> => {
      const { error } = await supabase.from('orders').delete().eq('payment_method', paymentMethod);
      if (error) throw error;
      setOrders(orders.filter((o) => o.paymentMethod !== paymentMethod));
    },
    [orders, setOrders]
  );

  return { addOrder, updateOrderStatus, deleteOrder, deleteAllOrdersByPaymentMethod };
};