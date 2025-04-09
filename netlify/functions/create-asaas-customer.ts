// netlify/functions/create-asaas-customer.ts
import { Handler } from '@netlify/functions';

const ASAAS_API_URL_CUSTOMERS = 'https://sandbox.asaas.com/api/v3/customers';
const ASAAS_API_URL_PAYMENTS = 'https://sandbox.asaas.com/api/v3/payments';

const handler: Handler = async (event) => {
  console.log('Requisição recebida:', { method: event.httpMethod, body: event.body });
  console.log('Versão atualizada para criar pagamento PIX - 2025-04-06');

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido. Use POST.' }) };
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Corpo da requisição vazio.' }) };
  }

  try {
    let body;
    try {
      console.log('Tentando parsear body:', event.body);
      body = JSON.parse(event.body);
    } catch (parseErr) {
      console.error('Erro ao parsear body:', parseErr.message, 'Body recebido:', event.body);
      return { statusCode: 400, body: JSON.stringify({ error: 'Corpo da requisição não é JSON válido', details: parseErr.message }) };
    }

    console.log('Dados parseados do frontend:', body);

    const { customer_name: name, customer_email: email, customer_cpf: cpfCnpj, customer_phone: phone } = body;
    const { price = 19.9, payment_method = 'PIX', product_name = 'Assinatura Anual - CineFlick Card' } = body;

    if (!name || !email || !cpfCnpj) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nome, email e CPF/CNPJ são obrigatórios.' }) };
    }

    const apiKey = process.env.ASAAS_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API key não configurada.' }) };
    }

    const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
    if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
      return { statusCode: 400, body: JSON.stringify({ error: 'CPF ou CNPJ inválido.' }) };
    }

    const asaasCustomerData = {
      name,
      email,
      cpfCnpj: cleanCpfCnpj,
      mobilePhone: phone ? phone.replace(/[^\d]/g, '') : undefined,
    };
    console.log('Dados enviados ao Asaas para criar cliente:', asaasCustomerData);

    const customerResponse = await fetch(ASAAS_API_URL_CUSTOMERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      body: JSON.stringify(asaasCustomerData),
    });

    const customerData = await customerResponse.json();
    console.log('Resposta do Asaas (cliente):', customerData);

    if (!customerResponse.ok) {
      return { statusCode: customerResponse.status, body: JSON.stringify({ error: 'Erro ao criar cliente no Asaas', details: customerData }) };
    }

    const asaasPaymentData = {
      customer: customerData.id,
      billingType: payment_method,
      value: parseFloat(price),
      dueDate: new Date().toISOString().split('T')[0],
      description: product_name,
    };
    console.log('Dados enviados ao Asaas para criar pagamento:', asaasPaymentData);

    const paymentResponse = await fetch(ASAAS_API_URL_PAYMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      body: JSON.stringify(asaasPaymentData),
    });

    const paymentData = await paymentResponse.json();
    console.log('Resposta do Asaas (pagamento):', paymentData);

    if (!paymentResponse.ok) {
      return { statusCode: paymentResponse.status, body: JSON.stringify({ error: 'Erro ao criar pagamento no Asaas', details: paymentData }) };
    }

    // Fazer uma requisição adicional para obter o QR code
    let qrCodeData = { payload: "QR_CODE_NOT_AVAILABLE", qrCodeImage: "" };
    if (paymentData.id) {
      const qrCodeResponse = await fetch(`${ASAAS_API_URL_PAYMENTS}/${paymentData.id}/pixQrCode`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': apiKey,
        },
      });

      if (qrCodeResponse.ok) {
        qrCodeData = await qrCodeResponse.json();
        console.log('PIX QR Code data:', qrCodeData);
      } else {
        console.warn('Failed to fetch PIX QR Code, using fallback values');
      }
    }

    // Adicionar os dados do QR code à resposta
    const responseWithQrCode = {
      ...paymentData,
      pix: {
        payload: qrCodeData.payload || "QR_CODE_NOT_AVAILABLE",
        qrCodeImage: qrCodeData.qrCodeImage || "",
      },
    };

    return { statusCode: 200, body: JSON.stringify(responseWithQrCode) };
  } catch (err) {
    console.error('Erro ao processar requisição:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno ao criar pagamento', details: err.message }) };
  }
};

export { handler };