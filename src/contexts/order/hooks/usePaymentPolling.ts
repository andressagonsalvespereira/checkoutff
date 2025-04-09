import { supabase } from '@/integrations/supabase/client';

const checkPaymentStatus = async (asaasPaymentId: string) => {
  try {
    const response = await fetch(`/path-to-your-polling-endpoint/${asaasPaymentId}`);
    const statusData = await response.json();

    const paymentStatus = statusData?.status || 'PENDING';

    // Atualize o status do pagamento no banco de dados
    await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('asaas_payment_id', asaasPaymentId);

    console.log(`Status do pagamento atualizado para: ${paymentStatus}`);
  } catch (error) {
    console.error('Erro ao verificar status de pagamento via polling:', error);
  }
};
