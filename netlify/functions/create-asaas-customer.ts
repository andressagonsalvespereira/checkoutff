// netlify/functions/create-asaas-customer.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key para inserções seguras
);

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { customer, orderId } = JSON.parse(event.body || '{}');

    if (!customer?.name || !customer?.email || !customer?.cpf || !orderId) {
      return { statusCode: 400, body: 'Dados do cliente ou orderId incompletos' };
    }

    // Cria cliente no Asaas
    const customerRes = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpf.replace(/\D/g, ''),
        phone: customer.phone || '',
      }),
    });

    const customerData = await customerRes.json();

    if (!customerRes.ok || !customerData.id) {
      console.error('Erro ao criar cliente no Asaas:', customerData);
      return { statusCode: 500, body: 'Erro ao criar cliente no Asaas' };
    }

    const asaasCustomerId = customerData.id;

    // Cria cobrança PIX
    const paymentRes = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: asaasCustomerId,
        billingType: 'PIX',
        value: 97.00, // 💡 Você pode dinamizar isso com base no orderId se necessário
        dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().split('T')[0],
        externalReference: uuidv4(), // referência única
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok || !paymentData.id) {
      console.error('Erro ao criar cobrança PIX:', paymentData);
      return { statusCode: 500, body: 'Erro ao criar cobrança no Asaas' };
    }

    // Obtém dados do QR Code
    const qrCodeRes = await fetch(`${ASAAS_BASE_URL}/payments/${paymentData.id}/pixQrCode`, {
      headers: {
        access_token: ASAAS_API_KEY,
      },
    });

    const qrData = await qrCodeRes.json();

    if (!qrCodeRes.ok || !qrData?.payload) {
      console.error('Erro ao obter QR Code PIX:', qrData);
      return { statusCode: 500, body: 'Erro ao obter QR Code PIX' };
    }

    // Salva dados no Supabase (asaas_payments)
    const { error } = await supabase
      .from('asaas_payments')
      .insert({
        order_id: orderId,
        payment_id: paymentData.id,
        status: paymentData.status,
        amount: paymentData.value,
        qr_code: qrData.payload,
        qr_code_image: qrData?.encodedImage,
      });

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return { statusCode: 500, body: 'Erro ao salvar cobrança no Supabase' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentId: paymentData.id,
        orderId,
        qrCode: qrData.payload,
        qrCodeImage: qrData.encodedImage,
      }),
    };
  } catch (err) {
    console.error('Erro geral:', err);
    return { statusCode: 500, body: 'Erro interno do servidor' };
  }
};

export { handler };
