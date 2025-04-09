
import { AsaasSettings } from '@/types/asaas';

export interface PaymentProcessorProps {
  formState: any;
  settings: AsaasSettings;
  isSandbox: boolean;
  onSubmit: (data: any) => Promise<any> | any;  // Aceita Promise<any> | any
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

export interface PaymentResult {
  success: boolean;
  method: 'card' | 'pix';
  paymentId?: string;
  error?: string;
  status: string;
  timestamp: string;
  [key: string]: any;
}

// New interface for checkout form state
export interface CheckoutFormState {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  selectedShipping: string;
  deliveryEstimate: string;
  formErrors: Record<string, string>;
}

// New interface for product details in the checkout
export interface ProductCheckoutDetails {
  id: string;
  name: string;
  price: number;
  isDigital: boolean;
}
