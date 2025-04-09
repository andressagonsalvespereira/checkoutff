import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler: Handler = async (event) => {
  try {
    console.log('🔁 Requisição recebida');

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido' }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Corpo da requisição ausente' }),
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch (error) {
      console.error('❌ Erro ao fazer parse do body:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'JSON malformado no body' }),
      };
    }

    const { orderId, customer, product } = parsed;

    console.log('📦 Dados recebidos:', { orderId, customer, product });

    if (
      !orderId ||
      !customer?.name ||
      !customer?.email ||
      !customer?.cpfCnpj ||
      !customer?.phone ||
      !product?.name ||
      !product?.price
    ) {
      console.warn('⚠️ Dados incompletos:', { orderId, customer, product });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do cliente ou orderId incompletos' }),
      };
    }

    console.log('💳 Simulando criação de cobrança no Asaas...');

    const fakePixQrCode = {
      payload: '00020126330014br.gov.bcb.pix0114+551199999999520400005303986540497.505802BR5921João da Silva6009SAO PAULO61080540900062070503***6304B14F',
      encodedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    };

    const { error: dbError } = await supabase.from('asaas_payments').insert({
      order_id: orderId,
      payment_id: `asaas-${Date.now()}`,
      status: 'PENDING',
      amount: product.price,
      qr_code: fakePixQrCode.payload,
      qr_code_image: fakePixQrCode.encodedImage,
    });

    if (dbError) {
      console.error('❌ Erro ao salvar no Supabase:', dbError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pagamento no Supabase' }),
      };
    }

    console.log('✅ Pagamento registrado com sucesso no Supabase!');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        qrCode: fakePixQrCode.payload,
        image: fakePixQrCode.encodedImage,
      }),
    };
  } catch (e: any) {
    console.error('🔥 Erro inesperado:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro inesperado no servidor',
        detalhes: e.message,
      }),
    };
  }
};

export { handler };
