import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL: string = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
  console.log('Requisição recebida:', { method: event.httpMethod, body: event.body });

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido. Use POST.' }) };
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Corpo da requisição vazio.' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { payment } = body;

    console.log('Evento recebido:', { event: body.event, paymentId: payment.id, status: payment.status });

    // Tratar eventos específicos
    if (body.event === 'PAYMENT_CREATED') {
      console.log('Pagamento criado, mas ainda não confirmado. Status:', payment.status);
      return { statusCode: 200, body: JSON.stringify({ message: 'Pagamento criado, aguardando confirmação.' }) };
    }

    if (body.event === 'PAYMENT_CONFIRMED') {
      if (payment.status !== 'CONFIRMED') {
        console.log(`Pagamento com status ${payment.status} não está confirmado. Ignorando.`);
        return { statusCode: 200, body: JSON.stringify({ message: 'Pagamento ainda não confirmado.' }) };
      }

      // Atualizar o status para PAID no Supabase
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'PAID' })
        .eq('asaas_payment_id', payment.id);

      if (error) {
        console.error('Erro ao atualizar status de pagamento:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao atualizar status no Supabase' }) };
      }

      console.log('Status do pagamento atualizado com sucesso para PAID');
      return { statusCode: 200, body: JSON.stringify({ message: 'Pagamento confirmado e processado com sucesso.' }) };
    }

    // Outros eventos não tratados
    return { statusCode: 400, body: JSON.stringify({ message: 'Evento não reconhecido.' }) };
  } catch (err) {
    console.error('Erro ao processar requisição:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno ao processar o webhook', details: err.message }) };
  }
};

export { handler };