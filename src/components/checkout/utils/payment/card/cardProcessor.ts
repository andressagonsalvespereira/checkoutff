
import { CardFormData } from '../../../payment-methods/CardForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PaymentProcessorProps, PaymentResult } from '../types';
import { detectCardBrand } from './cardDetection';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { processAutomaticPayment } from './processors/automaticProcessor';
import { processManualPayment } from './processors/manualProcessor';

interface ProcessCardPaymentParams {
  cardData: CardFormData;
  props: PaymentProcessorProps;
  setError: (error: string) => void;
  setPaymentStatus?: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast: ReturnType<typeof useToast>['toast'];
  isDigitalProduct?: boolean;
}

/**
 * Main entry point for card payment processing
 * Routes to appropriate processor based on settings
 */
export const processCardPayment = async ({
  cardData,
  props,
  setError,
  setPaymentStatus,
  setIsSubmitting,
  navigate,
  toast,
  isDigitalProduct = false
}: ProcessCardPaymentParams): Promise<PaymentResult> => {
  try {
    logger.log("processCardPayment iniciado - Processando pagamento", { cardData: { 
      cardName: cardData.cardName,
      cardNumber: cardData.cardNumber ? `****${cardData.cardNumber.slice(-4)}` : '',
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear
    }});
    
    // Update browser detection for statistics
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    const deviceType = isMobileDevice ? 'mobile' : 'desktop';

    logger.log("Processing card payment with settings:", { 
      manualCardProcessing: props.settings.manualCardProcessing,
      manualCardStatus: props.settings.manualCardStatus,
      productCustomManualStatus: props.formState.custom_manual_status,
      useCustomProcessing: props.formState.useCustomProcessing || false,
      isDigitalProduct
    });

    // Determine which processor to use based on settings
    if (props.settings.manualCardProcessing) {
      logger.log("Using manual card processing with digital product flag:", isDigitalProduct);
      return await processManualPayment({
        cardData,
        formState: { 
          ...props.formState,
          isDigitalProduct
        },
        settings: props.settings,
        deviceType,
        navigate,
        setIsSubmitting,
        setError,
        toast,
        onSubmit: props.onSubmit
      });
    } else {
      logger.log("Using automatic card processing with digital product flag:", isDigitalProduct);
      return await processAutomaticPayment({
        cardData,
        formState: { 
          ...props.formState,
          isDigitalProduct
        },
        settings: props.settings,
        isSandbox: props.isSandbox,
        deviceType,
        setPaymentStatus,
        setIsSubmitting,
        setError,
        navigate,
        toast,
        onSubmit: props.onSubmit
      });
    }
  } catch (error) {
    console.error('Error processing card payment:', error);
    setError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    setIsSubmitting(false);
    
    // Return a valid PaymentResult object in case of error
    return {
      success: false,
      method: 'card', // Fixed: using literal 'card' instead of string
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  }
};
