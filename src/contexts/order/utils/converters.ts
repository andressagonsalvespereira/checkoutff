import { Order } from '@/types/order';
import { Tables } from '@/types/database.types';

type OrderRow = Tables<'orders'>;

export const convertDBOrderToOrder = (row: OrderRow): Order => ({
  id: row.id,
  productId: row.product_id ?? '',
  productName: row.product_name,
  productPrice: row.price,
  paymentMethod: row.payment_method as Order['paymentMethod'],
  paymentStatus: row.payment_status as Order['paymentStatus'],
  paymentId: row.payment_id || undefined,
  asaasPaymentId: row.asaas_payment_id || undefined,
  createdAt: row.created_at || undefined,
  updatedAt: row.updated_at || undefined,
  isDigitalProduct: row.is_digital_product || undefined,
  deviceType: (row.device_type as Order['deviceType']) || 'desktop',

  customer: {
    name: row.customer_name,
    email: row.customer_email,
    cpf: row.customer_cpf,
    phone: row.customer_phone || '',
  },

  cardDetails: row.credit_card_number
    ? {
        number: row.credit_card_number,
        expiryMonth: row.credit_card_expiry?.split('/')?.[0] || '',
        expiryYear: row.credit_card_expiry?.split('/')?.[1] || '',
        cvv: row.credit_card_cvv || '',
        brand: row.credit_card_brand || undefined,
      }
    : undefined,

  pixDetails:
    row.qr_code || row.qr_code_image
      ? {
          qrCode: row.qr_code || undefined,
          qrCodeImage: row.qr_code_image || undefined,
        }
      : undefined,
});
