import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { logger } from '@/utils/logger';
import { resolveManualStatus, isConfirmedStatus, isRejectedStatus } from '../utils/resolveManualStatus';

export function usePaymentPolling(orderId?: string, enabled = true, orderData?: any) {
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  useEffect(() => {
    if (!enabled || !orderId) {
      logger.warn('[usePaymentPolling] Polling desativado: orderId ou enabled inválido', { orderId, enabled });
      return;
    }

    logger.log('[usePaymentPolling] Iniciando polling para orderId:', orderId);
    const interval = setInterval(async () => {
      try {
        logger.log('[usePaymentPolling] Verificando status do pedido:', orderId);
        const latestOrder = await getOrderById(orderId);
        if (!latestOrder) {
          logger.warn('[usePaymentPolling] Pedido não encontrado:', orderId);
          return;
        }
        logger.log('[usePaymentPolling] Pedido retornado:', latestOrder);
        logger.log('[usePaymentPolling] Status bruto do pedido:', latestOrder.payment_status);
        const status = resolveManualStatus(latestOrder.payment_status);
        logger.log('[usePaymentPolling] Status resolvido:', status);

        if (isConfirmedStatus(status)) {
          logger.log('✅ Redirecionando para /payment-success');
          navigate('/payment-success', { state: { orderData: latestOrder } });
          clearInterval(interval);
        } else if (isRejectedStatus(status)) {
          logger.warn('❌ Redirecionando para /payment-failed');
          navigate('/payment-failed', { state: { orderData: latestOrder } });
          clearInterval(interval);
        } else {
          logger.log('[usePaymentPolling] Status ainda não finalizado:', status);
        }
      } catch (error) {
        logger.error('[usePaymentPolling] Erro ao verificar status:', error);
      }
    }, 5000);

    return () => {
      logger.log('[usePaymentPolling] Limpando intervalo para orderId:', orderId);
      clearInterval(interval);
    };
  }, [orderId, enabled, getOrderById, navigate]);
}