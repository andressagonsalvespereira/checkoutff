import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Conexão com Supabase usando chave secreta (segura no painel Netlify)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usa a chave secreta com permissões para update
);

const handler: Handler = async (event) => {
  console.log('🔔 Webhook recebido - Método:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método não permitido. Use POST.',
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    console.log('📦 Payload do webhook:', payload);

    const paymentId = payload.id;
    const status = payload.status;

    if (!paymentId || !status) {
      console.warn('⚠️ Webhook sem ID ou status de pagamento.');
      return { statusCode: 400, body: 'Dados inválidos' };
    }

    console.log('🔍 Procurando pedido com asaas_payment_id:', paymentId);

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('asaas_payment_id', paymentId)
      .single();

    if (fetchError || !order) {
      console.error('❌ Pedido não encontrado no Supabase:', fetchError);
      return { statusCode: 404, body: 'Pedido não encontrado' };
    }

    console.log('📝 Atualizando status do pedido:', status);

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar status no Supabase:', updateError);
      return { statusCode: 500, body: 'Erro ao atualizar status do pedido' };
    }

    console.log('✅ Pedido atualizado com sucesso!');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    console.error('❌ Erro no processamento do webhook:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno', details: err.message }),
    };
  }
};

export { handler };
