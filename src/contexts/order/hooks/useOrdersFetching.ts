import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { convertDBOrderToOrder } from '../utils/converters'; // Ajustado para o caminho correto

export const useOrdersFetching = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) throw error;
      const convertedOrders = data.map(convertDBOrderToOrder);
      setOrders(convertedOrders);
      console.log('[useOrdersFetching] Pedidos carregados:', convertedOrders.length);
    } catch (err) {
      setError(err.message);
      console.error('[useOrdersFetching] Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string | number): Promise<Order | null> => {
    try {
      console.log('[useOrdersFetching] Buscando pedido com ID:', id);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const order = convertDBOrderToOrder(data);
      console.log('[useOrdersFetching] Pedido encontrado:', order);
      return order;
    } catch (err) {
      console.error('[useOrdersFetching] Erro ao buscar pedido:', err);
      return null;
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  return { orders, setOrders, loading, error, refreshOrders, getOrderById };
};