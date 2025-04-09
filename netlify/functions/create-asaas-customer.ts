import { Handler } from '@netlify/functions';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

function formatPhone(phone: string): string {
  const onlyNumbers = phone.replace(/\D/g, '');
  if (onlyNumbers.length === 11) {
    return onlyNumbers;
  }
  return '';
}

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Corpo da requisição ausente' }),
      };
    }

    const { orderId, customer, product } = JSON.parse(event.body);

    if (!orderId || !customer || !customer.name || !customer.email || !customer.cpfCnpj || !customer.phone || !product?.name || !product?.price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    const formattedPhone = formatPhone(customer.phone);
    if (!formattedPhone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Telefone inválido' }),
      };
    }

    // Criar cliente no Asaas
    const customerResponse = await axios.post(
      `${ASAAS_API_URL}/customers`,
      {
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: formattedPhone,
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const asaasCustomer = customerResponse.data;

    // Criar cobrança PIX
    const paymentResponse = await axios.post(
      `${ASAAS_API_URL}/payments`,
      {
        customer: asaasCustomer.id,
        billingType: 'PIX',
        value: product.price,
        description: product.name,
        dueDate: new Date().toISOString().split('T')[0],
      },
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const payment = paymentResponse.data;

    // Buscar QR Code PIX
    const qrResponse = await axios.get(
      `${ASAAS_API_URL}/payments/${payment.id}/pixQrCode`,
      {
        headers: {
          access_token: ASAAS_API_KEY,
        },
      }
    );

    const { payload, encodedImage } = qrResponse.data;

    // Salvar no Supabase
    const { error } = await supabase.from('asaas_payments').insert([
      {
        order_id: orderId,
        payment_id: payment.id,
        status: payment.status,
        amount: payment.value,
        qr_code: payload,
        qr_code_image: encodedImage,
      },
    ]);

    if (error) {
      console.error('Erro ao salvar pagamento no Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentId: payment.id, payload, encodedImage }),
    };
  } catch (err: any) {
    console.error('Erro inesperado:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor', detalhes: err?.response?.data || err.message }),
    };
  }
};