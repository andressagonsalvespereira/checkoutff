
// Define the main types used in the Asaas integration
export type ManualCardStatus = 'APPROVED' | 'DENIED' | 'ANALYSIS';

export interface AsaasSettings {
  isEnabled: boolean;
  apiKey: string;
  allowCreditCard: boolean;
  allowPix: boolean;
  manualCreditCard: boolean;
  sandboxMode: boolean;
  sandboxApiKey: string;
  productionApiKey: string;
  manualCardProcessing: boolean;
  manualPixPage: boolean;
  manualPaymentConfig: boolean;
  manualCardStatus: ManualCardStatus;

  // ✅ Novos campos para integração Asaas via PIX
  usePixAsaas: boolean;
  asaasApiKey: string;
}

export interface AsaasApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  status?: number;
}

export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasPayment {
  id?: string;
  value: number;
  customer: string;
  billingType: 'CREDIT_CARD' | 'PIX';
  dueDate: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
  };
  remoteIp?: string;
}

export interface AsaasPaymentResponse {
  id: string;
  customer?: string;
  status: string;
  dueDate?: string;
  invoiceUrl?: string;
  value: number;
  netValue: number;
  originalValue?: number;
  interestValue?: number;
  description?: string;
  billingType: string;
  confirmedDate?: string;
  pixTransaction?: any;
  creditCard?: {
    creditCardBrand?: string;
    creditCardNumber?: string;
    creditCardToken?: string;
  };
}

export interface AsaasPixQrCodeResponse {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface AsaasContextType {
  settings: AsaasSettings;
  loading: boolean;
  saveSettings: (settings: AsaasSettings) => Promise<void>;
  updateSettings: (settings: AsaasSettings) => Promise<void>;
}
