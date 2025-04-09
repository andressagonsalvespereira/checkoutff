
import { useState, useEffect } from 'react';
import { AsaasSettings } from '@/types/asaas';

export type PaymentMethodType = 'card' | 'pix';

export interface PaymentMethodConfig {
  pixEnabled: boolean;
  cardEnabled: boolean;
  error: string | null;
  isLoading: boolean;
}

export const usePaymentMethodLogic = (
  settings: AsaasSettings | null, 
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>
): PaymentMethodConfig => {
  const [error, setError] = useState<string | null>(null);
  
  // Derived state based on settings
  const isLoading = !settings;
  const paymentConfigEnabled = settings ? (settings.isEnabled || settings.manualPaymentConfig) : false;
  const pixEnabled = settings ? (paymentConfigEnabled && settings.allowPix) : false;
  const cardEnabled = settings ? (paymentConfigEnabled && settings.allowCreditCard) : false;

  // Set initial payment method based on available methods
  useEffect(() => {
    if (settings) {
      if (!pixEnabled && cardEnabled) {
        setPaymentMethod('card');
      } else if (pixEnabled && !cardEnabled) {
        setPaymentMethod('pix');
      }
    }
  }, [settings, setPaymentMethod, pixEnabled, cardEnabled]);

  return {
    pixEnabled,
    cardEnabled,
    error,
    isLoading
  };
};
