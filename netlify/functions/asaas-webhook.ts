// netlify/functions/asaas-webhook.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL: string = process.env.SUPABASE_URL as string; // Garantir que seja string
const SUPABASE_SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // Garantir que seja string

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

    // Verificar se o evento é o esperado
    if (body.event !== 'PAYMENT_CREATED') {
      return { statusCode: 400, body: JSON.stringify({ message: 'Evento não reconhecido.' }) };
    }

    console.log('Evento de pagamento criado recebido:', body);

    const { payment } = body;

    // Verifique o status do pagamento antes de atualizá-lo para PAID
    if (payment.status !== 'PENDING') {
      console.log(`Pagamento com status ${payment.status} ignorado.`);
      return { statusCode: 200, body: JSON.stringify({ message: 'Pagamento não precisa ser atualizado.' }) };
    }

    // Atualizar o status de pagamento no Supabase
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'PAID' })
      .eq('asaas_payment_id', payment.id);

    if (error) {
      console.error('Erro ao atualizar status de pagamento:', error);
      return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao atualizar status no Supabase' }) };
    }

    console.log('Status do pagamento atualizado com sucesso para PAID');

    // Aqui você pode redirecionar ou tomar outra ação (como notificar o frontend)
    return { statusCode: 200, body: JSON.stringify({ message: 'Pagamento processado com sucesso.' }) };
  } catch (err) {
    console.error('Erro ao processar requisição:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno ao processar o webhook', details: err.message }) };
  }
};

export { handler };
