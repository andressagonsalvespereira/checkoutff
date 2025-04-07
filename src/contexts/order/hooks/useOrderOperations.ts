
import { useState, useRef } from 'react';
import { Order, CreateOrderInput, PaymentMethod, PaymentStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { 
  createOrder, 
  updateOrderStatusData,
  deleteOrderData,
  deleteAllOrdersByPaymentMethodData
} from '../utils';
import { logger } from '@/utils/logger';

// Set global para rastrear IDs de pagamento que estão em processamento
const pendingOrderIds = new Set<string>();

/**
 * Hook for handling order operations like creating, updating, and deleting orders
 */
export const useOrderOperations = (orders: Order[], setOrders: React.Dispatch<React.SetStateAction<Order[]>>) => {
  const { toast } = useToast();
  const [pendingOrder, setPendingOrder] = useState(false);
  const processingRef = useRef<string | null>(null);

  const addOrder = async (orderData: CreateOrderInput): Promise<Order> => {
    try {
      // Verificar se já há um pedido em processamento
      if (pendingOrder) {
        logger.warn("Solicitação de criação de pedido duplicada detectada via estado");
        throw new Error("Já existe um pedido em processamento");
      }
      
      // Gerar um ID de processamento exclusivo para este pedido
      const paymentId = orderData.paymentId || `order_${Date.now()}`;
      
      // Verificar se este pagamento específico já está sendo processado
      if (pendingOrderIds.has(paymentId)) {
        logger.warn(`Pedido com paymentId ${paymentId} já está em processamento`);
        throw new Error(`Pedido com ID de pagamento ${paymentId} já está em processamento`);
      }
      
      // Se este ID específico já estiver sendo processado por esta instância
      if (processingRef.current === paymentId) {
        logger.warn(`Pedido com paymentId ${paymentId} já está em processamento por esta instância`);
        throw new Error(`Pedido já está em processamento (${paymentId})`);
      }
      
      // Marcar como em processamento
      setPendingOrder(true);
      processingRef.current = paymentId;
      pendingOrderIds.add(paymentId);
      
      // Registrar informações de criação de pedido
      logger.log("Iniciando criação de pedido:", {
        paymentId,
        productId: orderData.productId,
        productName: orderData.productName,
        paymentMethod: orderData.paymentMethod
      });
      
      const newOrder = await createOrder(orderData);
      
      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Pedido adicionado com sucesso",
      });
      
      return newOrder;
    } catch (err) {
      logger.error('Erro ao adicionar pedido:', err);
      toast({
        title: "Erro",
        description: "Falha ao adicionar pedido",
        variant: "destructive",
      });
      throw err;
    } finally {
      // Garantir limpeza adequada do estado de processamento
      setTimeout(() => {
        setPendingOrder(false);
        const paymentId = processingRef.current;
        processingRef.current = null;
        
        // Remover do conjunto global após um atraso para garantir que outros processos tenham concluído
        if (paymentId) {
          // Não removemos do conjunto global para evitar a recriação do mesmo pedido em sessões diferentes
          // pendingOrderIds.delete(paymentId);
        }
      }, 1000);
    }
  };

  const updateOrderStatus = async (
    id: string, 
    status: PaymentStatus
  ): Promise<Order> => {
    try {
      const { updatedOrder, updatedOrders } = await updateOrderStatusData(orders, id, status);
      
      setOrders(updatedOrders);
      
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado com sucesso",
      });
      
      return updatedOrder;
    } catch (err) {
      logger.error('Erro ao atualizar status do pedido:', err);
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do pedido",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    try {
      await deleteOrderData(id);
      
      setOrders(prevOrders => prevOrders.filter(order => String(order.id) !== String(id)));
      
      toast({
        title: "Sucesso",
        description: "Pedido removido com sucesso",
      });
    } catch (err) {
      logger.error('Erro ao excluir pedido:', err);
      toast({
        title: "Erro",
        description: "Falha ao excluir o pedido",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAllOrdersByPaymentMethod = async (method: PaymentMethod): Promise<void> => {
    try {
      await deleteAllOrdersByPaymentMethodData(method);
      
      setOrders(prevOrders => prevOrders.filter(order => order.paymentMethod !== method));
      
      toast({
        title: "Sucesso",
        description: `Todos os pedidos via ${method === 'PIX' ? 'PIX' : 'Cartão'} foram removidos`,
      });
    } catch (err) {
      logger.error('Erro ao excluir pedidos por método de pagamento:', err);
      toast({
        title: "Erro",
        description: `Falha ao excluir os pedidos via ${method === 'PIX' ? 'PIX' : 'Cartão'}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    addOrder,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrdersByPaymentMethod
  };
};

// Função para limpar o conjunto global de IDs de pedido pendentes (útil para testes ou resets)
export const clearPendingOrderIds = () => {
  pendingOrderIds.clear();
};
