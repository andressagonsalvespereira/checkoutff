
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import CardForm, { CardFormData } from './payment-methods/CardForm';
import PaymentError from './payment-methods/PaymentError';
import PaymentStatusMessage from './payment-methods/PaymentStatusMessage';
import { useCreditCardPayment } from '@/hooks/payment/useCreditCardPayment';
import { PaymentResult } from '@/types/payment';
import { logger } from '@/utils/logger';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';

interface CheckoutFormProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: ManualCardStatus;
}

const CheckoutForm = ({ 
  onSubmit, 
  isSandbox, 
  isDigitalProduct = false,
  useCustomProcessing = false,
  manualCardStatus
}: CheckoutFormProps) => {
  const { toast } = useToast();
  
  const {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    handleSubmit,
    getButtonText,
    getAlertMessage,
    getAlertStyles
  } = useCreditCardPayment({
    isSandbox,
    useCustomProcessing,
    manualCardStatus,
    isDigitalProduct,
    onSubmit
  });

  const handleCardFormSubmit = async (cardData: CardFormData) => {
    logger.log("Processing card payment form submission");
    
    try {
      return await handleSubmit(cardData);
    } catch (error) {
      logger.error("Error in handleCardFormSubmit:", error);
      
      toast({
        title: "Payment processing error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      throw error;
    }
  };

  if (paymentStatus) {
    return <PaymentStatusMessage status={paymentStatus} />;
  }

  const alertStyles = getAlertStyles();
  const buttonText = getButtonText();

  return (
    <div className="space-y-4">
      {useCustomProcessing && (
        <Alert className={alertStyles.alertClass}>
          <AlertCircle className={`h-4 w-4 ${alertStyles.iconClass}`} />
          <AlertDescription className={alertStyles.textClass}>
            {getAlertMessage()}
          </AlertDescription>
        </Alert>
      )}
      
      <PaymentError error={error} />
      
      <CardForm 
        onSubmit={handleCardFormSubmit}
        isSubmitting={isSubmitting}
        buttonText={buttonText}
        loading={isSubmitting}
      />
    </div>
  );
};

export default CheckoutForm;
