// src/contexts/order/hooks/usePaymentPolling.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import {
  resolveManualStatus,
  isConfirmedStatus,
  isRejectedStatus,
} from '@/contexts/order/utils/resolveManualStatus';
import { logger } from '@/utils/logger';

export function usePaymentPolling(orderId?: string, enabled = true, orderData?: any) {
  const navigate = useNavigate();
  const { getOrderById } = useOrders(); // ✅ Necessário aqui

  useEffect(() => {
    if (!enabled || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const latestOrder = await getOrderById(orderId); // 💥 aqui que 'r' estava undefined
        if (!latestOrder) return;

        const status = resolveManualStatus(latestOrder.payment_status);
        logger.log('[usePaymentPolling] Status normalizado:', status);

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
  }, [orderId, enabled, getOrderById, navigate]);
}
