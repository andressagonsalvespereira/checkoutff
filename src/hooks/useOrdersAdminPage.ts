
import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Order, PaymentMethod } from '@/types/order';
import { useToast } from '@/hooks/use-toast';

export function useOrdersAdminPage() {
  const { 
    loading, 
    getOrdersByPaymentMethod, 
    refreshOrders, 
    deleteOrder, 
    deleteAllOrdersByPaymentMethod 
  } = useOrders();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const { toast } = useToast();

  const pixOrders = getOrdersByPaymentMethod('PIX' as PaymentMethod);
  const cardOrders = getOrdersByPaymentMethod('CREDIT_CARD' as PaymentMethod);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      await refreshOrders();
      toast({
        title: "Lista atualizada",
        description: "A lista de pedidos foi atualizada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a lista de pedidos.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      await deleteOrder(String(orderToDelete.id));
      toast({
        title: "Pedido removido",
        description: "O pedido foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o pedido.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteAllOrders = (paymentMethod: PaymentMethod) => {
    setPaymentMethodToDelete(paymentMethod);
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllOrders = async () => {
    if (!paymentMethodToDelete) return;
    
    try {
      await deleteAllOrdersByPaymentMethod(paymentMethodToDelete);
      toast({
        title: "Pedidos removidos",
        description: `Todos os pedidos via ${paymentMethodToDelete === 'PIX' ? 'PIX' : 'Cartão'} foram removidos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover os pedidos.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteAllDialogOpen(false);
      setPaymentMethodToDelete(null);
    }
  };

  return {
    loading,
    pixOrders,
    cardOrders,
    selectedOrder,
    isDetailsOpen,
    isRefreshing,
    isDeleteDialogOpen,
    isDeleteAllDialogOpen,
    orderToDelete,
    paymentMethodToDelete,
    handleViewOrder,
    handleRefreshOrders,
    handleDeleteOrder,
    handleDeleteAllOrders,
    confirmDeleteOrder,
    confirmDeleteAllOrders,
    setIsDetailsOpen,
    setIsDeleteDialogOpen,
    setIsDeleteAllDialogOpen
  };
}
