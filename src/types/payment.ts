
import { DeviceType } from './order';

export type PaymentMethod = 'card' | 'pix';

export interface PaymentResult {
  success: boolean;
  method: PaymentMethod;
  paymentId?: string;
  status: string;
  timestamp: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  brand?: string;
  qrCode?: string;
  qrCodeImage?: string;
  expirationDate?: string;
  deviceType?: DeviceType;
  error?: string;
}

export interface CustomerData {
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

export interface PaymentFormState {
  customerInfo?: CustomerData;
  productId?: string;
  productName?: string;
  productPrice?: number;
  isDigitalProduct?: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: string;
  [key: string]: any;
}
