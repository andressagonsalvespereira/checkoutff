import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
  console.log('📬 [check-payment-status] Requisição recebida:', {
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
      body: JSON.stringify({ error: 'Corpo da requisição ausente.' }),
    };
  }

  try {
    const { paymentId } = JSON.parse(event.body);

    if (!paymentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'paymentId é obrigatório.' }),
      };
    }

    // Busca no Supabase por payment_id ou asaas_payment_id
    const { data, error } = await supabase
      .from('orders')
      .select('id, payment_status, payment_id, asaas_payment_id')
      .or(`payment_id.eq.${paymentId},asaas_payment_id.eq.${paymentId}`)
      .limit(1)
      .single();

    if (error || !data) {
      console.warn('❌ Pedido não encontrado com paymentId:', paymentId);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Pedido não encontrado com esse paymentId.' }),
      };
    }

    let paymentStatus = data.payment_status;

    // Se o status ainda for PENDING, consulta a API do Asaas
    if (paymentStatus === 'PENDING' && data.asaas_payment_id) {
      const response = await axios.get(
        `https://sandbox.asaas.com/api/v3/payments/${data.asaas_payment_id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ASAAS_API_KEY}`,
          },
        }
      );

      paymentStatus = response.data.status;

      // Atualiza o status no Supabase
      await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', data.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentStatus,
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