// netlify/functions/create-asaas-customer.ts

import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ASAAS_API_KEY = process.env.ASAAS_API_KEY
const ASAAS_API_URL = 'https://www.asaas.com/api/v3'

const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')
    const { customer, orderId } = body

    if (!customer || !orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing customer or orderId' })
      }
    }

    // 1. Criar cliente no Asaas
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY!
      },
      body: JSON.stringify(customer)
    })
    const customerData = await customerResponse.json()
    if (!customerResponse.ok) throw new Error(customerData.errors?.[0]?.description || 'Failed to create customer')

    // 2. Criar cobrança PIX
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY!
      },
      body: JSON.stringify({
        customer: customerData.id,
        billingType: 'PIX',
        value: body.amount || 100.0,
        dueDate: new Date().toISOString().split('T')[0],
        description: body.description || 'Pagamento via PIX'
      })
    })
    const paymentData = await paymentResponse.json()
    if (!paymentResponse.ok) throw new Error(paymentData.errors?.[0]?.description || 'Failed to create payment')

    // 3. Buscar QR Code do PIX
    const qrResponse = await fetch(`${ASAAS_API_URL}/payments/${paymentData.id}/pixQrCode`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_API_KEY!
      }
    })
    const qrData = await qrResponse.json()

    // 4. Salvar em asaas_payments (relacionando com orderId)
    const { error } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: paymentData.id,
      status: paymentData.status,
      amount: paymentData.value,
      qr_code: qrData.payload,
      qr_code_image: qrData.encodedImage
    })

    if (error) throw new Error(error.message)

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode: qrData.payload,
        qrImage: qrData.encodedImage
      })
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}

export { handler }