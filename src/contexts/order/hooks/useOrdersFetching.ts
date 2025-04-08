import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { loadOrders } from '../utils';
import { logger } from '@/utils/logger';

/**
 * Hook for handling order fetching operations
 */
export const useOrdersFetching = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const loadedOrders = await loadOrders();
      setOrders(loadedOrders);
      setError(null);
      setLoading(false);
    } catch (err) {
      logger.error('Erro ao carregar pedidos:', err);
      setError('Falha ao carregar pedidos');
      toast({
        title: "Erro",
        description: "Falha ao carregar pedidos",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const getOrderById = async (id: string | number): Promise<Order | null> => {
    try {
      const existing = orders.find((order) => order.id === Number(id));
      if (existing) return existing;

      const freshOrders = await loadOrders();
      const found = freshOrders.find((order) => order.id === Number(id)) || null;
      if (found) setOrders(freshOrders); // Atualiza o estado local
      return found;
    } catch (error) {
      logger.error('[getOrderById] Erro ao buscar pedido por ID:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    setOrders,
    loading,
    error,
    refreshOrders: fetchOrders,
    getOrderById, // ✅ Agora incluso corretamente
  };
};
