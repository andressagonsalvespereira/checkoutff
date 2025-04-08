import { logger } from '@/utils/logger';

export async function checkPaymentStatus(orderId: string): Promise<{
  success: boolean;
  paymentStatus?: string;
  message?: string;
}> {
  try {
    const response = await fetch('/.netlify/functions/check-payment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId: orderId }), // ← aqui pode mudar para asaas_payment_id se necessário
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('[checkPaymentStatus] ❌ Erro na resposta da API:', text);
      return { success: false, message: 'Erro ao buscar status da API' };
    }

    const data = await response.json();

    logger.log('[checkPaymentStatus] ✅ Resposta recebida da função:', data);

    if (!data.status) {
      return { success: false, message: 'Resposta inválida da função' };
    }

    return {
      success: true,
      paymentStatus: data.status,
    };
  } catch (error: any) {
    logger.error('[checkPaymentStatus] ❌ Erro na requisição:', error);
    return {
      success: false,
      message: error.message || 'Erro desconhecido',
    };
  }
}
