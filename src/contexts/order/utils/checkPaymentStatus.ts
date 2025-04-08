import { PaymentStatus } from '@/types/order';
import { logger } from '@/utils/logger';

export interface CheckStatusResult {
  success: boolean;
  paymentStatus?: PaymentStatus;
  message: string;
}

/**
 * Verifica o status do pagamento do pedido via API interna.
 * Usa o ID do pedido para consultar o status mais recente.
 */
export const checkPaymentStatus = async (
  orderId: string | number
): Promise<CheckStatusResult> => {
  try {
    logger.log('[checkPaymentStatus] 🔄 Verificando status para pedido:', orderId);

    const res = await fetch(`/api/check-payment-status?orderId=${orderId}`);
    const data = await res.json();

    if (!res.ok) {
      logger.warn('[checkPaymentStatus] ❌ Falha na resposta da API:', data.message);
      return {
        success: false,
        message: data.message || 'Erro ao verificar status do pagamento.',
      };
    }

    logger.log('[checkPaymentStatus] ✅ Status recebido:', data.paymentStatus);

    return {
      success: true,
      paymentStatus: data.paymentStatus,
      message: data.message,
    };
  } catch (error: any) {
    logger.error('[checkPaymentStatus] ❌ Erro na requisição:', error);
    return {
      success: false,
      message: error.message || 'Erro desconhecido ao verificar status do pagamento.',
    };
  }
};
