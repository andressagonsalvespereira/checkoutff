import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
  console.log('📬 [check-payment-status] Requisição recebida:', {
    method: event.httpMethod,
    body: event.body,
  });

  if (event.httpMethod !== 'POST') {
    console.warn('⚠️ [check-payment-status] Método inválido:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' }),
    };
  }

  if (!event.body) {
    console.error('❌ [check-payment-status] Requisição sem body.');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Corpo da requisição ausente.' }),
    };
  }

  try {
    const { paymentId } = JSON.parse(event.body);
    console.log('📦 [check-payment-status] paymentId recebido:', paymentId);

    if (!paymentId) {
      console.error('❌ [check-payment-status] paymentId ausente.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'paymentId é obrigatório.' }),
      };
    }

    // Tenta encontrar o pedido com base no payment_id ou asaas_payment_id
    const { data, error } = await supabase
      .from('orders')
      .select('id, payment_status, payment_id, asaas_payment_id')
      .or(`payment_id.eq.${paymentId},asaas_payment_id.eq.${paymentId}`)
      .limit(1)
      .single();

    if (error) {
      console.error('❌ [check-payment-status] Erro ao consultar Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao buscar pedido.', details: error.message }),
      };
    }

    if (!data) {
      console.warn('⚠️ [check-payment-status] Nenhum pedido encontrado para o paymentId:', paymentId);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Pedido não encontrado com esse paymentId.' }),
      };
    }

    console.log('✅ [check-payment-status] Pedido encontrado:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentStatus: data.payment_status,
        paymentId: data.payment_id,
        asaasPaymentId: data.asaas_payment_id,
      }),
    };
  } catch (err: any) {
    console.error('❌ [check-payment-status] Erro inesperado:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno ao processar verificação.',
        details: err.message,
      }),
    };
  }
};

export { handler };
