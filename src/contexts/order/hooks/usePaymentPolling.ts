import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { logger } from '@/utils/logger';
import {
  resolveManualStatus,
  isConfirmedStatus,
  isRejectedStatus,
} from '../utils/resolveManualStatus';
import { checkPaymentStatus } from '../utils/checkPaymentStatus';
import { PaymentStatus } from '@/types/order';

type UsePaymentPollingProps = {
  orderId?: string;
  paymentId?: string; // Adicionamos esta prop para passar o asaas_payment_id
  enabled?: boolean;
  orderData?: any;
  onStatusChange?: (status: PaymentStatus) => void;
};

export function usePaymentPolling({
  orderId,
  paymentId,
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

    const idToCheck = paymentId || orderId; // Usa paymentId se disponível, senão orderId
    logger.log('[usePaymentPolling] 🚀 Iniciando polling', { orderId, paymentId: idToCheck });
    console.log('ID usado no polling:', idToCheck);

    let attempts = 0;
    const maxAttempts = 60; // 5 minutos com intervalo de 5 segundos

    intervalRef.current = setInterval(async () => {
      try {
        logger.log('[usePaymentPolling] 🔍 Verificando status via checkPaymentStatus');
        const result = await checkPaymentStatus(idToCheck);
        if (!result.success) {
          logger.warn('[usePaymentPolling] ⚠️ Falha ao verificar status do pedido', result.message);
          attempts++;
          if (result.message === 'Endpoint não encontrado' || attempts >= maxAttempts) {
            clearInterval(intervalRef.current!);
            navigate('/payment-failed');
          }
          return;
        }

        const resolvedStatus = resolveManualStatus(result.paymentStatus);
        setStatus(result.paymentStatus as PaymentStatus);
        logger.log('[usePaymentPolling] ✅ Status resolvido:', { resolvedStatus });

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
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(intervalRef.current!);
            navigate('/payment-failed');
          }
        }
      } catch (error: any) {
        logger.error('[usePaymentPolling] ❌ Erro ao verificar status do pagamento', {
          error: error?.message || error,
        });
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(intervalRef.current!);
          navigate('/payment-failed');
        }
      }
    }, 5000);

    return () => {
      logger.log('[usePaymentPolling] 🧹 Limpando intervalo', { orderId });
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, paymentId, enabled, onStatusChange, navigate, getOrderById]);

  return { status };
}