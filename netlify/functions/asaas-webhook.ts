import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
  console.log('📬 Webhook recebido:', { method: event.httpMethod, body: event.body });

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
    const body = JSON.parse(event.body);
    const { event: eventType, payment } = body;

    console.log('📦 Evento do Asaas:', { eventType, paymentId: payment.id, status: payment.status });

    if (eventType === 'PAYMENT_CREATED') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Pagamento criado. Aguardando confirmação.' }),
      };
    }

    if (eventType === 'PAYMENT_CONFIRMED' || eventType === 'PAYMENT_RECEIVED') {
      if (payment.status !== 'CONFIRMED' && payment.status !== 'RECEIVED') {
        console.log(`⚠️ Pagamento com status ${payment.status} ainda não confirmado/recebido. Ignorando.`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Pagamento ainda não confirmado.' }),
        };
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status: 'PAID' })
        .eq('asaas_payment_id', payment.id); // ✅ Corrigido aqui!

      if (error) {
        console.error('❌ Erro ao atualizar pedido no Supabase:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Erro ao atualizar status do pedido.' }),
        };
      }

      console.log('✅ Status do pedido atualizado para PAID.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Pagamento confirmado e processado com sucesso.' }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Evento não reconhecido.' }),
    };
  } catch (err: any) {
    console.error('❌ Erro ao processar webhook:', err);
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
