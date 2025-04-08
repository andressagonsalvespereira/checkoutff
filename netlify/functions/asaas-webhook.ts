import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 🚫 Não usamos PAYMENT_RECEIVED como PAID — risco de falso positivo
const statusMap: Record<string, 'PAID' | 'DENIED' | null> = {
  // Sucesso REAL
  PAYMENT_CONFIRMED: 'PAID',
  PAYMENT_AUTHORIZED: 'PAID',
  PAYMENT_APPROVED_BY_RISK_ANALYSIS: 'PAID',
  PAYMENT_ANTICIPATED: 'PAID',

  // Falhas
  PAYMENT_REPROVED_BY_RISK_ANALYSIS: 'DENIED',
  PAYMENT_REFUNDED: 'DENIED',
  PAYMENT_REFUND_DENIED: 'DENIED',
  PAYMENT_OVERDUE: 'DENIED',
  PAYMENT_CHARGEBACK_REQUESTED: 'DENIED',
  PAYMENT_CREDIT_CARD_CAPTURE_REFUSED: 'DENIED',

  // ⚠️ Apenas log — não altera status
  PAYMENT_RECEIVED: null,
  PAYMENT_CREATED: null,
  PAYMENT_UPDATED: null,
  PAYMENT_CHECKOUT_VIEWED: null,
  PAYMENT_BANK_SLIP_VIEWED: null,
  PAYMENT_DUNNING_REQUESTED: null,
  PAYMENT_SPLIT_CANCELLED: null,
};

const handler: Handler = async (event) => {
  console.log('📬 Webhook recebido:', {
    method: event.httpMethod,
    body: event.body,
  });

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Corpo da requisição vazio.' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const { event: eventType, payment } = payload;

    if (!payment?.id || !eventType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payload inválido. payment.id e event são obrigatórios.' }),
      };
    }

    console.log('📦 Evento recebido do Asaas:', {
      eventType,
      paymentId: payment.id,
      paymentStatus: payment.status,
    });

    const newStatus = statusMap[eventType];

    if (newStatus === undefined) {
      console.warn('⚠️ Evento não reconhecido:', eventType);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Evento ${eventType} ignorado (não mapeado).` }),
      };
    }

    if (newStatus === null) {
      console.log('ℹ️ Evento informativo, sem alteração de status:', eventType);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Evento ${eventType} recebido. Nenhuma atualização realizada.` }),
      };
    }

    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('asaas_payment_id', payment.id);

    if (error) {
      console.error('❌ Erro ao atualizar status do pedido:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao atualizar status no banco de dados.' }),
      };
    }

    console.log(`✅ Status do pedido atualizado para ${newStatus}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Status atualizado para ${newStatus} com sucesso.` }),
    };
  } catch (err: any) {
    console.error('❌ Erro no processamento do webhook:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno ao processar webhook.',
        details: err.message,
      }),
    };
  }
};

export { handler };
