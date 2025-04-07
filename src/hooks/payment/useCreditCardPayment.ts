
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { PaymentResult } from '@/types/payment';
import { processCreditCardPayment } from '@/utils/payment/paymentProcessor';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';

export interface UseCardPaymentProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: ManualCardStatus;
  settings?: AsaasSettings;
}

export function useCreditCardPayment({
  onSubmit,
  isSandbox,
  isDigitalProduct = false,
  useCustomProcessing = false,
  manualCardStatus = 'ANALYSIS',
  settings
}: UseCardPaymentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  
  // Detect device type for analytics
  const isMobileDevice = typeof window !== 'undefined' ? 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
    false;
  
  const deviceType: DeviceType = isMobileDevice ? 'mobile' : 'desktop';
  
  const handleSubmit = useCallback(async (cardData: CardFormData) => {
    setError(null);
    
    try {
      logger.log("Processing card payment", { 
        isSandbox, 
        useCustomProcessing,
        manualCardStatus,
        isDigitalProduct 
      });
      
      const result = await processCreditCardPayment(cardData, {
        productDetails: {
          isDigitalProduct
        },
        paymentSettings: {
          isSandbox,
          manualCardProcessing: useCustomProcessing || (settings?.manualCardProcessing || false),
          manualCardStatus: manualCardStatus as ManualCardStatus || (settings?.manualCardStatus || 'ANALYSIS'),
          useCustomProcessing
        },
        callbacks: {
          onSuccess: onSubmit,
          onError: (errorMsg: string) => {
            setError(errorMsg);
            toast({
              title: "Payment Error",
              description: errorMsg,
              variant: "destructive",
            });
          },
          onStatusChange: setPaymentStatus,
          onSubmitting: setIsSubmitting
        },
        deviceInfo: {
          deviceType
        }
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error processing payment";
      logger.error("Error in handleSubmit:", error);
      setError(errorMessage);
      setIsSubmitting(false);
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [
    isSandbox, 
    useCustomProcessing, 
    manualCardStatus, 
    isDigitalProduct, 
    onSubmit, 
    toast, 
    settings, 
    deviceType
  ]);

  // Helper methods for UI customization
  const getButtonText = useCallback(() => {
    const useManualProcessing = useCustomProcessing || settings?.manualCardProcessing;
    return useManualProcessing ? 'Submit Payment' : 'Pay with Card';
  }, [useCustomProcessing, settings]);

  const getAlertMessage = useCallback(() => {
    const useManualProcessing = useCustomProcessing || settings?.manualCardProcessing;
    return useManualProcessing ? 'This payment is being processed in test mode.' : 'Processing payment...';
  }, [useCustomProcessing, settings]);

  const getAlertStyles = useCallback(() => {
    const actualStatus = manualCardStatus || settings?.manualCardStatus;

    if (useCustomProcessing && actualStatus === 'APPROVED') {
      return {
        alertClass: 'bg-green-50 border-green-200',
        iconClass: 'text-green-600',
        textClass: 'text-green-800'
      };
    } else if (useCustomProcessing && actualStatus === 'DENIED') {
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
  }, [useCustomProcessing, manualCardStatus, settings]);

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    setPaymentStatus,
    handleSubmit,
    getButtonText,
    getAlertMessage,
    getAlertStyles,
    settings: {
      manualCardProcessing: settings?.manualCardProcessing || false,
      manualCardStatus: settings?.manualCardStatus || 'ANALYSIS'
    }
  };
}
