
import { useState } from 'react';
import { AsaasSettings } from '@/types/asaas';

export type CardStatus = 'APPROVED' | 'DENIED' | 'ANALYSIS';

interface CardPaymentStatusOptions {
  settings?: AsaasSettings;
  useCustomProcessing?: boolean;
  manualCardStatus?: string;
}

export const useCardPaymentStatus = ({
  settings,
  useCustomProcessing = false,
  manualCardStatus
}: CardPaymentStatusOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  
  // Default settings if none are provided
  const defaultSettings: AsaasSettings = {
    isEnabled: false,
    manualCardProcessing: true,
    manualCreditCard: false,
    apiKey: '',
    allowPix: true,
    allowCreditCard: true,
    sandboxMode: true,
    sandboxApiKey: '',
    productionApiKey: '',
    manualPixPage: false,
    manualPaymentConfig: true,
    manualCardStatus: 'ANALYSIS'
  };
  
  // Determine button text based on settings
  const getButtonText = () => {
    if (!settings?.manualCardProcessing) {
      return 'Finalizar Pagamento';
    }
    
    // Check if should use product-specific settings
    const cardStatus = useCustomProcessing && manualCardStatus
      ? manualCardStatus
      : settings?.manualCardStatus;
    
    switch (cardStatus) {
      case 'APPROVED':
        return 'Enviar para Aprovação Manual';
      case 'DENIED':
        return 'Enviar para Verificação (será recusado)';
      case 'ANALYSIS':
      default:
        return 'Enviar para Análise Manual';
    }
  };

  // Alert message based on processing configuration
  const getAlertMessage = () => {
    // Check if should use product-specific settings
    const cardStatus = useCustomProcessing && manualCardStatus
      ? manualCardStatus
      : settings?.manualCardStatus;
    
    switch (cardStatus) {
      case 'DENIED':
        return 'Este pagamento será processado manualmente e será RECUSADO automáticamente.';
      case 'APPROVED':
        return 'Este pagamento será processado manualmente e aprovado temporariamente.';
      case 'ANALYSIS':
      default:
        return 'Este pagamento passará por análise manual e não será processado automaticamente.';
    }
  };

  // Alert style based on processing configuration
  const getAlertStyles = () => {
    // Check if should use product-specific settings
    const cardStatus = useCustomProcessing && manualCardStatus
      ? manualCardStatus
      : settings?.manualCardStatus;
    
    return {
      alertClass: cardStatus === 'DENIED' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200',
      iconClass: cardStatus === 'DENIED' ? 'text-red-600' : 'text-amber-600',
      textClass: cardStatus === 'DENIED' ? 'text-red-800' : 'text-amber-800'
    };
  };

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    setPaymentStatus,
    getButtonText,
    getAlertMessage,
    getAlertStyles,
    settings: settings || defaultSettings
  };
};
