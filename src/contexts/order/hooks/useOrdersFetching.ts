
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

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    setOrders,
    loading,
    error,
    refreshOrders: fetchOrders
  };
};
