import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Tipagens das respostas da API Asaas
interface AsaasCustomerResponse {
  id: string;
}

interface AsaasPaymentResponse {
  id: string;
  status: string;
  value: number;
}

interface AsaasQrCodeResponse {
  payload: string;
  encodedImage: string;
}

const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { orderId, customer, product } = body;

    console.log('🔍 Request body:', body);

    if (!orderId || !customer || !customer.name || !customer.email || !customer.cpfCnpj || !customer.phone || !product || !product.name || !product.price) {
      console.log('❌ Dados incompletos recebidos');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      access_token: process.env.ASAAS_API_KEY!,
    };

    // Criar cliente no Asaas
    const customerRes = await fetch('https://www.asaas.com/api/v3/customers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: customer.phone,
      }),
    });

    const customerData: AsaasCustomerResponse = await customerRes.json();
    console.log('✅ Cliente criado:', customerData);

    if (!customerRes.ok || !customerData?.id) {
      console.error('Erro ao criar cliente:', customerData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar cliente Asaas' }),
      };
    }

    // Criar cobrança PIX
    const paymentRes = await fetch('https://www.asaas.com/api/v3/payments', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: product.price,
        description: product.name,
        dueDate: new Date().toISOString().split('T')[0],
      }),
    });

    const paymentData: AsaasPaymentResponse = await paymentRes.json();
    console.log('✅ Pagamento criado:', paymentData);

    if (!paymentRes.ok || !paymentData?.id) {
      console.error('Erro ao criar pagamento:', paymentData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao criar cobrança Asaas' }),
      };
    }

    // Buscar QR Code
    const qrRes = await fetch(`https://www.asaas.com/api/v3/payments/${paymentData.id}/pixQrCode`, {
      method: 'GET',
      headers,
    });

    const qrData: AsaasQrCodeResponse = await qrRes.json();
    console.log('✅ QR Code retornado:', qrData);

    if (!qrRes.ok || !qrData?.payload) {
      console.error('Erro ao buscar QR Code:', qrData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao obter QR Code PIX' }),
      };
    }

    // Salvar na tabela asaas_payments do Supabase
    const { error: insertError } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.value,
      qr_code: qrData.payload,
      qr_code_image: qrData.encodedImage,
    });

    if (insertError) {
      console.error('Erro ao salvar no Supabase:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar cobrança no banco de dados' }),
      };
    }

    // Retorno final
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cobrança criada com sucesso',
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode: qrData.payload,
        qrCodeImage: qrData.encodedImage,
      }),
    };
  } catch (error: any) {
    console.error('Erro inesperado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor' }),
    };
  }
};

export { handler };
