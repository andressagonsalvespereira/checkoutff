import { supabase } from '@/integrations/supabase/client';
import { CreateOrderInput, Order } from '@/types/order';
import { convertDBOrderToOrder } from './converters';

export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  const productIdNumber = typeof orderData.productId === 'string'
    ? parseInt(orderData.productId, 10)
    : Number(orderData.productId);

  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  if (!orderData.customer?.name?.trim()) throw new Error('Nome do cliente é obrigatório');
  if (!orderData.customer?.email?.trim()) throw new Error('Email do cliente é obrigatório');
  if (!orderData.customer?.cpf?.trim()) throw new Error('CPF do cliente é obrigatório');

  // Verifica se já existe pedido com o mesmo payment_id ou asaas_payment_id
  if (orderData.paymentId || orderData.asaasPaymentId) {
    const filters = [
      orderData.paymentId ? `payment_id.eq.${orderData.paymentId}` : null,
      orderData.asaasPaymentId ? `asaas_payment_id.eq.${orderData.asaasPaymentId}` : null
    ].filter(Boolean).join(',');

    const { data: existing } = await supabase
      .from('orders')
      .select('*')
      .or(filters)
      .limit(1);

    if (existing?.length) {
      return convertDBOrderToOrder(existing[0]);
    }
  }

  // Verifica duplicidade por cliente + produto nas últimas 5 minutos
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
    return convertDBOrderToOrder(exactMatch);
  }

  const statusMap: Record<string, Order['paymentStatus']> = {
    PAGO: 'PAID',
    PAID: 'PAID',
    CONFIRMED: 'PAID',
    PENDING: 'PENDING',
    AGUARDANDO: 'PENDING',
    CANCELADO: 'DENIED',
    RECUSADO: 'DENIED',
    REJECTED: 'DENIED',
    NEGADO: 'DENIED',
    DENIED: 'DENIED',
    DECLINED: 'DENIED',
  };

  const rawStatus = (orderData.paymentStatus || '').toUpperCase().trim();
  const normalizedStatus = statusMap[rawStatus] || 'PENDING';

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_cpf: orderData.customer.cpf,
      customer_phone: orderData.customer.phone || null,
      product_id: productIdNumber,
      product_name: orderData.productName,
      price: orderData.productPrice,
      payment_method: orderData.paymentMethod,
      payment_status: normalizedStatus,
      payment_id: orderData.paymentId || null,
      asaas_payment_id: orderData.asaasPaymentId || null,
      copia_e_cola: orderData.pixDetails?.qrCode || null,
      qr_code: orderData.pixDetails?.qrCode || null,
      qr_code_image: orderData.pixDetails?.qrCodeImage || null,
      credit_card_number: orderData.cardDetails?.number || null,
      credit_card_expiry: orderData.cardDetails
        ? `${orderData.cardDetails.expiryMonth}/${orderData.cardDetails.expiryYear}`
        : null,
      credit_card_cvv: orderData.cardDetails?.cvv || null,
      credit_card_brand: orderData.cardDetails?.brand || 'Unknown',
      device_type: orderData.deviceType || 'desktop',
      is_digital_product: orderData.isDigitalProduct || false,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Erro ao criar pedido:', error);
    throw new Error(error?.message || 'Erro ao salvar pedido');
  }

  return convertDBOrderToOrder(data);
};
