import { AsaasPaymentResponse } from '../../types/asaas';  // Caminho relativo
import { supabase } from '../../integrations/supabase/client';  // Caminho relativo

export const handler = async (event) => {
  const { customer, orderId } = JSON.parse(event.body);

  // Enviar para o Asaas e criar o pagamento
  const response = await fetch('https://www.asaas.com/api/v3/charges', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ASAAS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer,
      orderId, // O ID do pedido que será associado ao pagamento
    }),
  });

  const asaasData: AsaasPaymentResponse = await response.json();

  if (asaasData?.id) {
    // Atualiza o pagamento no banco com o ID do Asaas
    await supabase
      .from('orders')
      .update({ asaas_payment_id: asaasData.id })
      .eq('id', orderId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pagamento criado no Asaas', asaasId: asaasData.id }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Erro ao criar cobrança no Asaas' }),
  };
};
