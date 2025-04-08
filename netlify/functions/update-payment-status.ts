import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Corpo da requisição ausente.' }),
      };
    }

    const { payment } = JSON.parse(event.body);
    const asaasPaymentId = payment.id;
    const newStatus = payment.status;

    console.log(`[update-payment-status] Atualizando status do pagamento ${asaasPaymentId} para ${newStatus}`);

    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('asaas_payment_id', asaasPaymentId);

    if (error) {
      console.error('[update-payment-status] Erro ao atualizar status no Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao atualizar status no Supabase' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    console.error('[update-payment-status] Erro inesperado:', err);
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