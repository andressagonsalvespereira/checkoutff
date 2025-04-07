import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    const eventName = payload.event;
    const payment = payload.payment;

    if (!payment || !payment.id || !payment.status) {
      console.warn('⚠️ Webhook sem ID ou status de pagamento.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Ignorado: dados incompletos.' }),
      };
    }

    if (eventName !== 'PAYMENT_CONFIRMED') {
      console.info('ℹ️ Evento ignorado:', eventName);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Evento ${eventName} ignorado.` }),
      };
    }

    const paymentId = payment.id;
    const paymentStatus = payment.status;

    console.log('🔍 Buscando pedido com asaas_payment_id:', paymentId);

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('asaas_payment_id', paymentId)
      .single();

    if (fetchError || !order) {
      console.error('❌ Pedido não encontrado:', fetchError);
      return {
        statusCode: 404,
        body: 'Pedido não encontrado.',
      };
    }

    console.log(`📝 Atualizando pedido ${order.id} para status: ${paymentStatus}`);

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: paymentStatus })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar pedido:', updateError);
      return {
        statusCode: 500,
        body: 'Erro ao atualizar o status do pedido.',
      };
    }

    console.log('✅ Pedido atualizado com sucesso!');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err: any) {
    console.error('❌ Erro ao processar webhook:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno', details: err.message }),
    };
  }
};

export { handler };
