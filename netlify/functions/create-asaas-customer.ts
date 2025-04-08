import { Handler } from '@netlify/functions';

const ASAAS_BASE_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_URL_CUSTOMERS = `${ASAAS_BASE_URL}/customers`;
const ASAAS_API_URL_PAYMENTS = `${ASAAS_BASE_URL}/payments`;

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

  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key do Asaas não configurada.' }),
    };
  }

  try {
    const {
      customer_name: name,
      customer_email: email,
      customer_cpf: cpfCnpj,
      customer_phone: phone,
      price,
      payment_method = 'PIX',
      product_name = 'Assinatura Anual - CineFlick Card',
    } = JSON.parse(event.body);

    if (!name || !email || !cpfCnpj || !price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nome, email, CPF/CNPJ e preço são obrigatórios.' }),
      };
    }

    const value = parseFloat(price);
    if (isNaN(value)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Preço inválido.' }) };
    }

    const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
    if (![11, 14].includes(cleanCpfCnpj.length)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'CPF ou CNPJ inválido.' }) };
    }

    const customerPayload = {
      name,
      email,
      cpfCnpj: cleanCpfCnpj,
      mobilePhone: phone ? phone.replace(/[^\d]/g, '') : undefined,
    };

    const customerResponse = await fetch(ASAAS_API_URL_CUSTOMERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: apiKey,
      },
      body: JSON.stringify(customerPayload),
    });

    const customerData = await customerResponse.json();
    if (!customerResponse.ok) {
      return {
        statusCode: customerResponse.status,
        body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', details: customerData }),
      };
    }

    // Cria vencimento para amanhã
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const paymentPayload = {
      customer: customerData.id,
      billingType: payment_method,
      value,
      dueDate: dueDateStr,
      description: product_name,
    };

    const paymentResponse = await fetch(ASAAS_API_URL_PAYMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: apiKey,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) {
      return {
        statusCode: paymentResponse.status,
        body: JSON.stringify({ error: 'Erro ao criar pagamento no Asaas', details: paymentData }),
      };
    }

    // Buscar o QR Code
    let pix = { payload: 'QR_CODE_NOT_AVAILABLE', qrCodeImage: '' };

    if (paymentData.id) {
      try {
        const qrCodeResponse = await fetch(`${ASAAS_API_URL_PAYMENTS}/${paymentData.id}/pixQrCode`, {
          headers: {
            'Content-Type': 'application/json',
            access_token: apiKey,
          },
        });

        if (qrCodeResponse.ok) {
          const qrCodeData = await qrCodeResponse.json();
          pix.payload = qrCodeData.payload || pix.payload;
          pix.qrCodeImage = qrCodeData.encodedImage || '';
        }
      } catch (err) {
        console.warn('⚠️ Erro ao buscar QR Code:', err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...paymentData,
        pix,
      }),
    };
  } catch (err: any) {
    console.error('❌ Erro geral na função:', err.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno ao processar o pagamento.',
        details: err.message || err,
      }),
    };
  }
};

export { handler };
