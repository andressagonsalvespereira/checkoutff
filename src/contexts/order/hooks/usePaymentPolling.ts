import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import {
  resolveManualStatus,
  isConfirmedStatus,
  isRejectedStatus,
} from '@/contexts/order/utils/resolveManualStatus';
import { logger } from '@/utils/logger';

export function usePaymentPolling(orderId?: string | null, initialOrderData?: any) {
  const { getOrderById } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const latestOrder = await getOrderById(orderId);
        if (!latestOrder) return;

        const status = resolveManualStatus(latestOrder.payment_status);
        logger.log('[usePaymentPolling] Status normalizado do pedido:', status);

        if (isConfirmedStatus(status)) {
          logger.log('✅ Pagamento confirmado, redirecionando...');
          navigate('/payment-success', { state: { orderData: latestOrder } });
          clearInterval(interval);
        }

        if (isRejectedStatus(status)) {
          logger.warn('❌ Pagamento negado, redirecionando...');
          navigate('/payment-failed', { state: { orderData: latestOrder } });
          clearInterval(interval);
        }
      } catch (error) {
        logger.error('[usePaymentPolling] Erro ao verificar status do pedido:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, getOrderById, navigate]);
}
