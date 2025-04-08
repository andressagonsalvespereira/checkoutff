import { supabase } from '@/integrations/supabase/client';
import { CreateOrderInput, Order } from '@/types/order';
import { convertDBOrderToOrder } from './converters';

export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    console.log('📦 Iniciando criação do pedido com os dados:', {
      ...orderData,
      cardDetails: orderData.cardDetails
        ? {
            ...orderData.cardDetails,
            number: '****' + orderData.cardDetails.number.slice(-4),
            cvv: '***',
          }
        : undefined,
    });

    if (!orderData.customer?.name?.trim()) throw new Error('Nome do cliente é obrigatório');
    if (!orderData.customer?.email?.trim()) throw new Error('Email do cliente é obrigatório');
    if (!orderData.customer?.cpf?.trim()) throw new Error('CPF do cliente é obrigatório');

    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const productIdNumber = typeof orderData.productId === 'string'
      ? parseInt(orderData.productId, 10)
      : Number(orderData.productId);

    if (orderData.paymentId) {
      const { data: existing } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_id', orderData.paymentId)
        .limit(1);

      if (existing?.length) {
        return convertDBOrderToOrder(existing[0]);
      }
    }

    const { data: duplicates } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', orderData.customer.email)
      .eq('product_id', productIdNumber)
      .eq('product_name', orderData.productName)
      .eq('payment_method', orderData.paymentMethod)
      .gte('created_at', fiveMinutesAgo.toISOString());

    const exactMatch = duplicates?.find(
      (order) =>
        order.price === orderData.productPrice &&
        order.customer_name === orderData.customer.name &&
        order.customer_cpf === orderData.customer.cpf
    );

    if (exactMatch) {
      console.log('⚠️ Pedido duplicado detectado. Retornando ID existente:', exactMatch.id);
      return convertDBOrderToOrder(exactMatch);
    }

    const deviceType = orderData.deviceType || 'desktop';
    const isDigitalProduct = orderData.isDigitalProduct || false;

    const rawStatus = (orderData.paymentStatus || '').toString().trim().toUpperCase();
    const statusMap: Record<string, string> = {
      PAGO: 'PAID',
      PAID: 'PAID',
      CONFIRMED: 'PAID',
      PENDING: 'PENDING',
      AGUARDANDO: 'PENDING',
      CANCELADO: 'CANCELLED',
      PENDENTE: 'PENDING',
      'ANÁLISE': 'ANALYSIS',
      ANALYSIS: 'ANALYSIS',
      APROVADO: 'APPROVED',
      APPROVED: 'APPROVED',
      RECUSADO: 'DENIED',
      REJECTED: 'DENIED',
      NEGADO: 'DENIED',
      DENIED: 'DENIED',
      DECLINED: 'DENIED',
    };

    const normalizedStatus = statusMap[rawStatus] || 'PENDING';
    const allowedStatuses = ['PENDING', 'PAID', 'APPROVED', 'DENIED', 'ANALYSIS', 'CANCELLED'];
    const safeStatus = allowedStatuses.includes(normalizedStatus) ? normalizedStatus : 'PENDING';

    console.log(`🔍 Status normalizado: ${orderData.paymentStatus} → ${safeStatus}`);

    const orderToInsert = {
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_cpf: orderData.customer.cpf,
      customer_phone: orderData.customer.phone || null,
      product_id: productIdNumber,
      product_name: orderData.productName,
      price: orderData.productPrice,
      payment_method: orderData.paymentMethod,
      payment_status: safeStatus,
      payment_id: orderData.paymentId || null,
      qr_code: orderData.pixDetails?.qrCode || null,
      qr_code_image: orderData.pixDetails?.qrCodeImage || null,
      credit_card_number: orderData.cardDetails?.number || null,
      credit_card_expiry: orderData.cardDetails
        ? `${orderData.cardDetails.expiryMonth}/${orderData.cardDetails.expiryYear}`
        : null,
      credit_card_cvv: orderData.cardDetails?.cvv || null,
      credit_card_brand: orderData.cardDetails?.brand || 'Unknown',
      device_type: deviceType,
      is_digital_product: isDigitalProduct,
    };

    const { data, error } = await supabase.from('orders').insert(orderToInsert).select().single();

    if (error) {
      console.error('❌ Erro ao criar o pedido:', error);
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }

    console.log('✅ Pedido criado com sucesso! ID:', data.id);
    return convertDBOrderToOrder(data);
  } catch (error) {
    console.error('❌ Falha ao criar o pedido:', error);
    throw error;
  }
};

export const handleCreateOrderAndPayment = async (
  orderData: CreateOrderInput,
  navigate: (path: string, options?: { state?: any }) => void
): Promise<void> => {
  try {
    const newOrder = await createOrder(orderData);
    localStorage.setItem('lastOrderId', newOrder.id.toString());

    const paymentResponse = await fetch('/.netlify/functions/create-asaas-customer', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_cpf: orderData.customer.cpf,
        customer_phone: orderData.customer.phone,
        price: orderData.productPrice,
        payment_method: orderData.paymentMethod,
        product_name: orderData.productName,
      }),
    });

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) {
      throw new Error('Erro ao criar pagamento no Asaas: ' + JSON.stringify(paymentData));
    }

    // ✅ Aqui está a correção importante:
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        asaas_payment_id: paymentData.id, // <-- salva o ID do pagamento do Asaas corretamente
        payment_id: paymentData.id, // opcional: manter também nesse campo
        qr_code: paymentData.pix.payload,
        qr_code_image: paymentData.pix.qrCodeImage,
      })
      .eq('id', newOrder.id);

    if (updateError) {
      console.error('❌ Erro ao atualizar pedido com dados do Asaas:', updateError);
      throw updateError;
    }

    console.log('✅ Redirecionando para /pix-payment-asaas com orderId:', newOrder.id);
    navigate('/pix-payment-asaas', {
      state: {
        orderData: {
          id: newOrder.id,
          pixDetails: {
            qrCode: paymentData.pix.payload,
            qrCodeImage: paymentData.pix.qrCodeImage,
          },
          payment_status: newOrder.paymentStatus,
        },
      },
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido e pagamento:', error);
    throw error;
  }
};
