import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const handler: Handler = async (event) => {
  console.log('📨 Requisição recebida:', { method: event.httpMethod });

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
    const data = JSON.parse(event.body);
    console.log('🧾 Dados recebidos:', data);

    const { orderId, customer, product } = data;

    if (!orderId || !customer?.name || !customer?.email || !customer?.cpfCnpj || !customer?.phone || !product?.name || !product?.price) {
      console.error('❌ Dados incompletos:', { orderId, customer, product });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: customer.phone,
      }),
    });

    const customerData = await customerResponse.json();
    console.log('👤 Cliente criado:', customerData);

    if (!customerResponse.ok || !customerData.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', detalhes: customerData }),
      };
    }

    const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': process.env.ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: product.price,
        description: product.name,
        externalReference: orderId,
        dueDate: new Date(Date.now() + 30 * 60 * 1000).toISOString().split('T')[0],
      }),
    });

    const paymentData = await paymentResponse.json();
    console.log('💸 Pagamento criado:', paymentData);

    if (!paymentResponse.ok || !paymentData?.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Erro ao criar pagamento no Asaas', detalhes: paymentData }),
      };
    }

    const qrCodeResponse = await fetch(`${ASAAS_BASE_URL}/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        'access_token': process.env.ASAAS_API_KEY!,
      },
    });

    const qrCodeData = await qrCodeResponse.json();
    console.log('🔳 QR Code PIX:', qrCodeData);

    const { error } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.value,
      qr_code: qrCodeData.payload,
      qr_code_image: qrCodeData.encodedImage,
    });

    if (error) {
      console.error('❌ Erro ao salvar no Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cliente e pagamento criados com sucesso',
        paymentId: paymentData.id,
        qrCode: qrCodeData.payload,
        qrCodeImage: qrCodeData.encodedImage,
      }),
    };
  } catch (e: any) {
    console.error('❌ Erro inesperado:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor', detalhes: e.message }),
    };
  }
};

export { handler };
