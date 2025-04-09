import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 2)}${cleaned.substring(2)}`;
  }
  return cleaned;
};

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Corpo da requisição ausente' }),
      };
    }

    const data = JSON.parse(event.body);
    console.log('[DEBUG] event.body recebido:', data);

    const { orderId, customer, product } = data;

    if (!orderId || !customer || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    const formattedPhone = formatPhone(customer.phone);

    // Criação do cliente no Asaas
    const createCustomerResponse = await fetch('https://www.asaas.com/api/v3/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: formattedPhone,
      }),
    });

    const customerData = await createCustomerResponse.json();
    console.log('[DEBUG] customerData:', customerData);

    if (!createCustomerResponse.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', detalhes: customerData }),
      };
    }

    const createPaymentResponse = await fetch('https://www.asaas.com/api/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: product.price,
        dueDate: new Date().toISOString().split('T')[0],
        description: product.name,
        externalReference: orderId,
      }),
    });

    const paymentData = await createPaymentResponse.json();
    console.log('[DEBUG] paymentData:', paymentData);

    if (!createPaymentResponse.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar pagamento no Asaas', detalhes: paymentData }),
      };
    }

    const { id: payment_id, status, value, pixTransaction, pixQrCode } = paymentData;

    const { error } = await supabase.from('asaas_payments').insert([
      {
        order_id: orderId,
        payment_id,
        status,
        amount: value,
        qr_code: pixQrCode?.payload ?? null,
        qr_code_image: pixQrCode?.encodedImage ?? null,
      },
    ]);

    if (error) {
      console.error('[SUPABASE ERROR]', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Cobrança criada com sucesso', payment_id }),
    };
  } catch (err: any) {
    console.error('[FATAL ERROR]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor', detalhes: err.message }),
    };
  }
};

export { handler };
