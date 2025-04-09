import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_API_URL = 'https://www.asaas.com/api/v3';

function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
    }

    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Corpo da requisição ausente' }) };
    }

    const data = JSON.parse(event.body);

    const { orderId, customer, product } = data;

    if (!orderId || !customer || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    const responseCliente = await axios.post(
      `${ASAAS_API_URL}/customers`,
      {
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: formatPhoneNumber(customer.phone),
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const customerId = (responseCliente.data as { id: string }).id;
    if (!customerId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', detalhes: responseCliente.data }),
      };
    }

    const responseCobranca = await axios.post(
      `${ASAAS_API_URL}/payments`,
      {
        customer: customerId,
        billingType: 'PIX',
        value: product.price,
        description: product.name,
        externalReference: orderId,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const payment = responseCobranca.data as {
      id: string;
      status: string;
      value: number;
    };

    const responseQrCode = await axios.get(
      `${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`,
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const qr = responseQrCode.data as {
      payload: string;
      encodedImage: string;
    };

    const { error } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: payment.id,
      status: payment.status,
      amount: payment.value,
      qr_code: qr.payload,
      qr_code_image: qr.encodedImage,
    });

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentId: payment.id,
        qrCode: qr.payload,
        image: qr.encodedImage,
      }),
    };
  } catch (err: any) {
    console.error('Erro inesperado no servidor:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro inesperado no servidor',
        detalhes: err?.response?.data || err.message || err,
      }),
    };
  }
};
