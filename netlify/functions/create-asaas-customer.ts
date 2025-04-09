import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { orderId, customer, product } = body;

    if (!orderId || !customer || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    console.log('📦 Dados recebidos:', { orderId, customer, product });

    // Criar cliente no Asaas
    const customerRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: customer.phone,
      }),
    });

    const customerData: any = await customerRes.json();
    console.log('✅ Cliente criado:', customerData);

    if (!customerData.id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', detalhes: customerData }),
      };
    }

    // Criar pagamento PIX
    const paymentRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: product.price,
        description: product.name,
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        externalReference: orderId,
      }),
    });

    const paymentData: any = await paymentRes.json();
    console.log('✅ Pagamento criado:', paymentData);

    if (!paymentData.id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar pagamento no Asaas', detalhes: paymentData }),
      };
    }

    // Buscar QR Code
    const qrRes = await fetch(`${ASAAS_BASE_URL}/payments/${paymentData.id}/pixQrCode`, {
      headers: { access_token: ASAAS_API_KEY },
    });

    const qrData: any = await qrRes.json();
    console.log('✅ QR Code gerado:', qrData);

    if (!qrData.payload || !qrData.encodedImage) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao obter QR Code do Asaas', detalhes: qrData }),
      };
    }

    // Inserir no Supabase
    const { error: insertError } = await supabase.from('asaas_payments').insert([
      {
        order_id: orderId,
        payment_id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.value,
        qr_code: qrData.payload,
        qr_code_image: qrData.encodedImage,
      },
    ]);

    if (insertError) {
      console.error('❌ Erro Supabase:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar no Supabase', detalhes: insertError.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cobrança criada com sucesso',
        paymentId: paymentData.id,
        payload: qrData.payload,
        encodedImage: qrData.encodedImage,
      }),
    };
  } catch (error: any) {
    console.error('❌ Erro geral:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor', detalhes: error.message || error }),
    };
  }
};

export { handler };
