import { supabase } from '@/integrations/supabase/client';
import { CreateOrderInput, Order } from '@/types/order';
import { convertDBOrderToOrder } from './converters';

export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  // Verifica se o Asaas está habilitado para PIX
  const { data: asaasConfig, error: asaasConfigError } = await supabase
    .from('asaas_config')
    .select('asaas_enabled')
    .limit(1)
    .single();

  if (asaasConfigError || !asaasConfig?.asaas_enabled) {
    throw new Error('Asaas API não está habilitada');
  }

  // Verifica se o pedido já foi criado (baseado no paymentId ou asaasPaymentId)
  const productIdNumber = typeof orderData.productId === 'string'
    ? parseInt(orderData.productId, 10)
    : Number(orderData.productId);

  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  if (!orderData.customer?.name?.trim()) throw new Error('Nome do cliente é obrigatório');
  if (!orderData.customer?.email?.trim()) throw new Error('Email do cliente é obrigatório');
  if (!orderData.customer?.cpf?.trim()) throw new Error('CPF do cliente é obrigatório');

  if (orderData.paymentId || orderData.asaasPaymentId) {
    const filters = [
      orderData.paymentId ? `payment_id.eq.${orderData.paymentId}` : null,
      orderData.asaasPaymentId ? `asaas_payment_id.eq.${orderData.asaasPaymentId}` : null,
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
      payment_status: 'PENDING',
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

  const order = convertDBOrderToOrder(data);

  // Se o método for PIX, cria pagamento no Asaas e associa o asaas_payment_id
  if (
    order.paymentMethod === 'PIX' &&
    !orderData.asaasPaymentId
  ) {
    try {
      const asaasResponse = await fetch('/.netlify/functions/create-asaas-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: orderData.customer,
          orderId: order.id,
        }),
      });

      const asaasData = await asaasResponse.json();

      if (asaasData.id) {
        await supabase
          .from('orders')
          .update({ asaas_payment_id: asaasData.id })
          .eq('id', order.id);

        console.log('Pedido criado no Asaas com sucesso:', asaasData.id);
      }
    } catch (err) {
      console.error('Erro ao chamar create-asaas-customer:', err);
      throw new Error('Erro ao integrar com o Asaas');
    }
  }

  return order;
};
