import { Order, CreateOrderInput } from '@/types/order';
import { supabase } from '@/integrations/supabase/client';
import { convertDBOrderToOrder } from './converters';

// Função createOrder (já ajustada anteriormente)
export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    console.log("Starting order creation with data:", {
      ...orderData,
      cardDetails: orderData.cardDetails ? {
        ...orderData.cardDetails,
        number: orderData.cardDetails.number ? '****' + orderData.cardDetails.number.slice(-4) : '',
        cvv: '***'
      } : undefined
    });

    // Validação básica
    if (!orderData.customer?.name?.trim()) throw new Error("Customer name is required");
    if (!orderData.customer?.email?.trim()) throw new Error("Customer email is required");
    if (!orderData.customer?.cpf?.trim()) throw new Error("Customer CPF is required");

    // Verificação de duplicatas nos últimos 5 minutos
    if (orderData.customer?.email && orderData.productId) {
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

      const productIdNumber = typeof orderData.productId === 'string'
        ? parseInt(orderData.productId, 10)
        : orderData.productId;

      if (orderData.paymentId) {
        const { data: existing, error } = await supabase
          .from('orders')
          .select('*')
          .eq('payment_id', orderData.paymentId)
          .limit(1);

        if (!error && existing && existing.length > 0) {
          return convertDBOrderToOrder(existing[0]);
        }
      }

      const { data: duplicates, error: checkError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', orderData.customer.email)
        .eq('product_id', productIdNumber)
        .eq('product_name', orderData.productName)
        .eq('payment_method', orderData.paymentMethod)
        .gte('created_at', fiveMinutesAgo.toISOString());

      if (!checkError && duplicates && duplicates.length > 0) {
        const exactMatch = duplicates.find(order =>
          order.price === orderData.productPrice &&
          order.customer_name === orderData.customer.name &&
          order.customer_cpf === orderData.customer.cpf
        );
        if (exactMatch) {
          console.log("Duplicate order detected, returning existing ID:", exactMatch.id);
          return convertDBOrderToOrder(exactMatch);
        }
      }
    }

    // Conversão do productId
    const productIdNumber = typeof orderData.productId === 'string'
      ? parseInt(orderData.productId, 10)
      : Number(orderData.productId);

    const deviceType = orderData.deviceType || 'desktop';
    const isDigitalProduct = orderData.isDigitalProduct || false;

    // Normalização do status de pagamento
    const rawStatus = (orderData.paymentStatus || '').toString().trim().toUpperCase();
    const allowedStatuses = ['PENDING', 'PAID', 'APPROVED', 'DENIED', 'ANALYSIS', 'CANCELLED', 'CONFIRMED'];

    const statusMap: Record<string, string> = {
      'PAGO': 'PAID',
      'PAID': 'PAID',
      'PENDING': 'PENDING',
      'AGUARDANDO': 'PENDING',
      'CANCELADO': 'CANCELLED',
      'PENDENTE': 'PENDING',
      'ANÁLISE': 'ANALYSIS',
      'ANALYSIS': 'ANALYSIS',
      'APROVADO': 'APPROVED',
      'APPROVED': 'APPROVED',
      'RECUSADO': 'DENIED',
      'REJECTED': 'DENIED',
      'NEGADO': 'DENIED',
      'DENIED': 'DENIED',
      'DECLINED': 'DENIED',
      'CONFIRMED': 'PAID'
    };

    const normalizedStatus = statusMap[rawStatus] || 'PENDING';
    const safeStatus = allowedStatuses.includes(normalizedStatus) ? normalizedStatus : 'PENDING';

    console.log(`Payment status normalized: ${orderData.paymentStatus} → ${safeStatus}`);

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

    console.log("Inserting order into database:", {
      ...orderToInsert,
      credit_card_number: orderToInsert.credit_card_number
        ? '****' + orderToInsert.credit_card_number.slice(-4)
        : null,
      credit_card_cvv: orderData.cardDetails?.cvv ? '***' : null
    });

    const { data, error } = await supabase
      .from('orders')
      .insert(orderToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error inserting order:", error);
      throw new Error(`Error creating order: ${error.message}`);
    }

    console.log("Order successfully created! ID:", data.id);
    return convertDBOrderToOrder(data);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

// Função handleCreateOrderAndPayment ajustada
export const handleCreateOrderAndPayment = async (orderData: CreateOrderInput, navigate: (path: string) => void): Promise<void> => {
  try {
    // Criar o pedido
    const newOrder = await createOrder(orderData);

    // Salvar o ID do pedido no localStorage
    localStorage.setItem('lastOrderId', newOrder.id.toString());

    // Criar o pagamento no Asaas
    const paymentResponse = await fetch('/.netlify/functions/create-asaas-customer', {
      method: 'POST',
      body: JSON.stringify({
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_cpf: orderData.customer.cpf,
        customer_phone: orderData.customer.phone,
        price: orderData.productPrice, // Enviar como "price", não "productPrice"
        payment_method: orderData.paymentMethod,
        product_name: orderData.productName,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error('Erro ao criar pagamento no Asaas');
    }

    // Atualizar o pedido com os dados do pagamento
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_id: paymentData.id,
        qr_code: paymentData.pix.payload,
        qr_code_image: paymentData.pix.qrCodeImage,
      })
      .eq('id', newOrder.id);

    if (updateError) {
      console.error('Erro ao atualizar pedido com dados do Asaas:', updateError);
      throw updateError;
    }

    // Redirecionar para a página de pagamento
    navigate('/pix-payment-asaas');
  } catch (error) {
    console.error('Erro ao criar pedido e pagamento:', error);
    throw error;
  }
};