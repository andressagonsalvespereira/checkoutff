
import { useState, useEffect } from 'react';
import { PaymentStatus } from '@/types/order';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

export interface UseCardPaymentStatusProps {
  isSandbox: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: string;
  settings?: AsaasSettings;
}

export function useCardPaymentStatus({ 
  isSandbox, 
  useCustomProcessing = false,
  manualCardStatus = 'ANALYSIS',
  settings
}: UseCardPaymentStatusProps) {
  const [status, setStatus] = useState<PaymentStatus>('PENDING');
  const [statusMessage, setStatusMessage] = useState('Processando pagamento...');
  const [confirmed, setConfirmed] = useState(false);
  
  // Additional state for UI handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Handle custom card processing logic if enabled
  useEffect(() => {
    if (useCustomProcessing) {
      const customStatus = manualCardStatus || 'ANALYSIS';
      
      switch (customStatus.toUpperCase()) {
        case 'APPROVED':
          setStatus('PAID');
          setStatusMessage('Pagamento aprovado!');
          setConfirmed(true);
          break;
        case 'DECLINED':
        case 'DENIED':
          setStatus('CANCELLED');
          setStatusMessage('Pagamento recusado pela operadora.');
          setConfirmed(false);
          break;
        case 'ANALYSIS':
        default:
          setStatus('PENDING');
          setStatusMessage('Pagamento em análise.');
          setConfirmed(false);
          break;
      }
    }
  }, [useCustomProcessing, manualCardStatus]);

  // Get the text for the payment button based on status
  const getButtonText = () => {
    if (useCustomProcessing && settings?.manualCardProcessing) {
      return 'Enviar pagamento';
    }
    return 'Pagar com cartão';
  };

  // Get the alert message for the payment form
  const getAlertMessage = () => {
    if (useCustomProcessing && settings?.manualCardProcessing) {
      return 'Este pagamento é processado em modo de teste.';
    }
    return 'Processando pagamento...';
  };

  // Get the alert styles for the payment form
  const getAlertStyles = () => {
    if (useCustomProcessing && manualCardStatus === 'APPROVED') {
      return {
        alertClass: 'bg-green-50 border-green-200',
        iconClass: 'text-green-600',
        textClass: 'text-green-800'
      };
    } else if (useCustomProcessing && manualCardStatus === 'DECLINED') {
      return {
        alertClass: 'bg-red-50 border-red-200',
        iconClass: 'text-red-600',
        textClass: 'text-red-800'
      };
    }
    return {
      alertClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-800'
    };
  };

  return {
    status,
    statusMessage,
    confirmed,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    setPaymentStatus,
    getButtonText,
    getAlertMessage,
    getAlertStyles,
    settings: {
      manualCardProcessing: settings?.manualCardProcessing || false,
      manualCardStatus: settings?.manualCardStatus || 'ANALYSIS'
    }
  };
}
