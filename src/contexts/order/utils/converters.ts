import { Order, CustomerInfo } from '@/types/order';

export const convertDBOrderToOrder = (dbOrder: any): Order => {
  const customer: CustomerInfo = {
    name: dbOrder.customer_name,
    email: dbOrder.customer_email,
    cpf: dbOrder.customer_cpf,
    phone: dbOrder.customer_phone || '',
  };

  return {
    id: dbOrder.id.toString(),
    customer,
    productId: dbOrder.product_id?.toString() || '',
    productName: dbOrder.product_name,
    productPrice: dbOrder.price,
    paymentMethod: dbOrder.payment_method,
    paymentStatus: dbOrder.payment_status || 'PENDING', // Garantir que o status seja sempre definido
    paymentId: dbOrder.payment_id,
    orderDate: dbOrder.created_at ? new Date(dbOrder.created_at).toISOString() : new Date().toISOString(),
    cardDetails: dbOrder.credit_card_number
      ? {
          number: dbOrder.credit_card_number,
          expiryMonth: dbOrder.credit_card_expiry?.split('/')[0] || '',
          expiryYear: dbOrder.credit_card_expiry?.split('/')[1] || '',
          cvv: dbOrder.credit_card_cvv || '',
          brand: dbOrder.credit_card_brand || 'Desconhecida',
        }
      : undefined,
    pixDetails: dbOrder.qr_code
      ? {
          qrCode: dbOrder.qr_code,
          qrCodeImage: dbOrder.qr_code_image,
        }
      : undefined,
    deviceType: dbOrder.device_type || 'desktop',
    isDigitalProduct: dbOrder.is_digital_product || false,
  };
};