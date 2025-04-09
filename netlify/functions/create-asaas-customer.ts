import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3'

function formatPhone(phone: string) {
  return phone.replace(/\D/g, '') // Remove tudo que não for número
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido' }),
      }
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Corpo da requisição ausente' }),
      }
    }

    const data = JSON.parse(event.body)

    const { orderId, customer, product } = data

    if (!orderId || !customer || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      }
    }

    const responseCustomer = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        cpfCnpj: customer.cpfCnpj,
        phone: formatPhone(customer.phone),
      }),
    })

    const customerData = await responseCustomer.json()

    if (!responseCustomer.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Erro ao criar cliente no Asaas',
          detalhes: customerData,
        }),
      }
    }

    const responsePayment = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: product.price,
        dueDate: new Date().toISOString().split('T')[0],
        description: `Pagamento referente a: ${product.name}`,
        externalReference: orderId,
      }),
    })

    const paymentData = await responsePayment.json()

    if (!responsePayment.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Erro ao criar pagamento no Asaas',
          detalhes: paymentData,
        }),
      }
    }

    const responseQrCode = await fetch(`${ASAAS_BASE_URL}/payments/${paymentData.id}/pixQrCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY,
      },
    })

    const qrCodeData = await responseQrCode.json()

    if (!responseQrCode.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Erro ao obter QR Code PIX do Asaas',
          detalhes: qrCodeData,
        }),
      }
    }

    const { error } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.value,
      qr_code: qrCodeData.payload,
      qr_code_image: qrCodeData.encodedImage,
    })

    if (error) {
      console.error('Erro ao salvar pagamento no Supabase:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode: qrCodeData.payload,
        qrCodeImage: qrCodeData.encodedImage,
      }),
    }
  } catch (err: any) {
    console.error('Erro inesperado no servidor:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro inesperado no servidor', detalhes: err.message }),
    }
  }
}
