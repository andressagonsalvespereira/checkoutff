export type PaymentMethod = 'CREDIT_CARD' | 'PIX' | 'BANK_SLIP';
export type PaymentStatus = "PAID" | "PENDING" | "DENIED";
export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';

export interface CustomerInfo {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  brand?: string;
}

export interface PixDetails {
  qrCode?: string;
  qrCodeImage?: string;
  expirationDate?: string;
}

export interface Order {
  id?: number;
  customer: CustomerInfo;
  productId: string | number;
  productName: string;
  productPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
  isDigitalProduct?: boolean;
  deviceType?: DeviceType;
  orderDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateOrderInput = Omit<Order, 'id'>;

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: CreateOrderInput) => Promise<Order>;
  getOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Order[];
  getOrdersByStatus: (status: PaymentStatus) => Order[];
  getOrdersByDevice: (deviceType: DeviceType) => Order[];
  getLatestOrders: (limit?: number) => Order[];
  updateOrderStatus: (id: string | number, status: PaymentStatus) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  deleteOrder: (id: string | number) => Promise<void>;
  deleteAllOrdersByPaymentMethod: (paymentMethod: PaymentMethod) => Promise<void>;
  getOrderById: (id: string | number) => Promise<Order | null>; // ✅ Adicionado para uso no polling
}
