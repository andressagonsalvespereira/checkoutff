import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { logger } from '@/utils/logger';
import {
  resolveManualStatus,
  isConfirmedStatus,
  isRejectedStatus,
} from '../utils/resolveManualStatus';
import { checkPaymentStatus } from '../utils/checkPaymentStatus'; // Usa o polling real via API
import { PaymentStatus } from '@/types/order';

type UsePaymentPollingProps = {
  orderId?: string;
  enabled?: boolean;
  orderData?: any;
  onStatusChange?: (status: PaymentStatus) => void;
};

export function usePaymentPolling({
  orderId,
  enabled = true,
  orderData,
  onStatusChange,
}: UsePaymentPollingProps) {
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('PENDING');

  useEffect(() => {
    if (!enabled || !orderId) {
      logger.warn('[usePaymentPolling] ❌ Polling desativado', { orderId, enabled });
      return;
    }

    logger.log('[usePaymentPolling] 🚀 Iniciando polling', { orderId });

    intervalRef.current = setInterval(async () => {
      try {
        logger.log('[usePaymentPolling] 🔍 Verificando status via checkPaymentStatus');

        const result = await checkPaymentStatus(orderId);
        if (!result.success) {
          logger.warn('[usePaymentPolling] ⚠️ Falha ao verificar status do pedido', result.message);
          return;
        }

        const resolvedStatus = resolveManualStatus(result.paymentStatus);
        setStatus(result.paymentStatus as PaymentStatus);
        logger.log('[usePaymentPolling] ✅ Status resolvido:', { resolvedStatus });

        // Callback opcional
        if (onStatusChange) onStatusChange(result.paymentStatus as PaymentStatus);

        if (isConfirmedStatus(resolvedStatus)) {
          logger.log('🎉 Pagamento confirmado. Redirecionando para /payment-success');
          const order = await getOrderById(orderId);
          navigate('/payment-success', { state: { orderData: order } });
          clearInterval(intervalRef.current!);
        } else if (isRejectedStatus(resolvedStatus)) {
          logger.warn('🚫 Pagamento recusado. Redirecionando para /payment-failed');
          const order = await getOrderById(orderId);
          navigate('/payment-failed', { state: { orderData: order } });
          clearInterval(intervalRef.current!);
        }
      } catch (error: any) {
        logger.error('[usePaymentPolling] ❌ Erro ao verificar status do pagamento', {
          error: error?.message || error,
        });
      }
    }, 5000);

    return () => {
      logger.log('[usePaymentPolling] 🧹 Limpando intervalo', { orderId });
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, enabled, onStatusChange, navigate, getOrderById]);

  return { status }; // Retorna o status para quem quiser usar no componente
}
