import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
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
    const { paymentId } = JSON.parse(event.body);

    if (!paymentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'paymentId é obrigatório.' }),
      };
    }

    const { data, error } = await supabase
      .from('orders')
      .select('payment_status')
      .eq('payment_id', paymentId)
      .single();

    if (error || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Pedido não encontrado com esse paymentId.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: data.payment_status }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno', details: error.message }),
    };
  }
};

export { handler };
