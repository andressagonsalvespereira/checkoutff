import { Handler } from '@netlify/functions';
import { supabase } from '@/integrations/supabase/client';

const handler: Handler = async (event) => {
  const { payment } = JSON.parse(event.body || '{}');
  if (payment.event === 'PAYMENT_CONFIRMED') {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: 'PAID', updated_at: new Date().toISOString() })
      .eq('payment_id', payment.id);
    if (error) {
      console.error('Erro ao atualizar status:', error);
      return { statusCode: 500, body: JSON.stringify(error) };
    }
    return { statusCode: 200, body: 'Status atualizado' };
  }
  return { statusCode: 200, body: 'Evento ignorado' };
};

export { handler };