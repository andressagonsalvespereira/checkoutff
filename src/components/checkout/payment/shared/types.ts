
import { DeviceType } from '@/types/order';
import { AsaasSettings } from '@/types/asaas';

// Customer data interface
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

// Common form state interface
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

// Processor props interface
export interface PaymentProcessorProps {
  formState: PaymentFormState;
  settings: AsaasSettings;
  isSandbox: boolean;
  onSubmit: (data: PaymentResult) => Promise<any> | any;
}

// Payment result interface
export interface PaymentResult {
  success: boolean;
  method: 'card' | 'pix';
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
