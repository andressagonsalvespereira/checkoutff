// netlify/functions/asaas-webhook.ts

import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' })
      }
    }

    const body = JSON.parse(event.body || '{}')

    const paymentId = body.payment?.id
    const status = body.payment?.status

    if (!paymentId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing payment ID or status' })
      }
    }

    // Busca o order_id na tabela asaas_payments
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('asaas_payments')
      .select('order_id')
      .eq('payment_id', paymentId)
      .single()

    if (fetchError || !paymentRecord) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Payment not found' })
      }
    }

    // Atualiza o status do pedido na tabela orders
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', paymentRecord.order_id)

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: updateError.message })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}

export { handler }
