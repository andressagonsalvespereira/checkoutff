
import { PaymentResult } from '../payment/shared/types';
import { Order, CardDetails, PixDetails } from '@/types/order';
import { logger } from '@/utils/logger';

interface AdaptedCallbacks {
  cardFormCallback: (data: any) => Promise<any>;
  pixFormCallback: (data: any) => Promise<any>;
}

// Global map to track processed payment IDs across the entire application
const globalProcessedPaymentIds = new Map<string, boolean>();

/**
 * Normalizes payment status for consistent handling
 */
const normalizePaymentStatus = (status: string): 'confirmed' | 'pending' => {
  if (!status) return 'pending';
  
  const normalizedStatus = status.toUpperCase();
  
  if (['CONFIRMED', 'APPROVED', 'PAID', 'APROVADO', 'PAGO'].includes(normalizedStatus)) {
    return 'confirmed';
  }
  
  return 'pending';
};

/**
 * Adapts the order callback function for different payment components
 */
export const adaptOrderCallback = (
  createOrder?: (
    paymentId: string, 
    status: 'pending' | 'confirmed',
    cardDetails?: CardDetails,
    pixDetails?: PixDetails
  ) => Promise<Order>
): AdaptedCallbacks => {
  // Default function if no createOrder provided
  const defaultCreateOrder = async () => ({} as Order);
  
  // Use provided or default function
  const orderCreator = createOrder || defaultCreateOrder;
  
  // Map to track payment IDs that have been processed in this instance
  const localProcessedPaymentIds = new Map<string, boolean>();
  
  const cardFormCallback = async (paymentData: PaymentResult): Promise<any> => {
    logger.log('Processing card payment with data:', {
      paymentId: paymentData.paymentId,
      status: paymentData.status,
      brand: paymentData.brand,
      cardNumber: paymentData.cardNumber ? `****${paymentData.cardNumber.slice(-4)}` : undefined,
    });
    
    try {
      // Check if this payment ID has already been processed
      const paymentId = paymentData.paymentId || `card_${Date.now()}`;
      
      // Check both global and local maps for duplicates
      if (globalProcessedPaymentIds.has(paymentId) || localProcessedPaymentIds.has(paymentId)) {
        logger.warn(`Payment ID ${paymentId} was already processed, skipping duplicate`);
        return { duplicated: true, alreadyProcessed: true, paymentId };
      }
      
      // Mark as processed in both maps
      globalProcessedPaymentIds.set(paymentId, true);
      localProcessedPaymentIds.set(paymentId, true);
      
      // Normalize the payment status
      const normalizedStatus = normalizePaymentStatus(paymentData.status);
      
      logger.log(`Creating order with normalized status: ${normalizedStatus}`);
      
      // Create an order with the card details
      const order = await orderCreator(
        paymentId,
        normalizedStatus,
        {
          number: paymentData.cardNumber || '',
          expiryMonth: paymentData.expiryMonth || '',
          expiryYear: paymentData.expiryYear || '',
          cvv: paymentData.cvv || '',
          brand: paymentData.brand || 'Desconhecida'
        },
        undefined
      );
      
      logger.log(`Card payment order created successfully with ID: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Error in cardFormCallback:', error);
      throw error;
    }
  };
  
  const pixFormCallback = async (paymentData: PaymentResult): Promise<any> => {
    logger.log('Processing PIX payment with data:', {
      paymentId: paymentData.paymentId,
      hasQrCode: !!paymentData.qrCode,
      hasQrCodeImage: !!paymentData.qrCodeImage,
    });
    
    try {
      // Check if this payment ID has already been processed
      const paymentId = paymentData.paymentId || `pix_${Date.now()}`;
      
      // Check both global and local maps for duplicates
      if (globalProcessedPaymentIds.has(paymentId) || localProcessedPaymentIds.has(paymentId)) {
        logger.warn(`Payment ID ${paymentId} was already processed, skipping duplicate`);
        return { duplicated: true, alreadyProcessed: true, paymentId };
      }
      
      // Mark as processed in both maps
      globalProcessedPaymentIds.set(paymentId, true);
      localProcessedPaymentIds.set(paymentId, true);
      
      // Create an order with the PIX details
      const order = await orderCreator(
        paymentId,
        'pending',
        undefined,
        {
          qrCode: paymentData.qrCode,
          qrCodeImage: paymentData.qrCodeImage,
          expirationDate: paymentData.expirationDate
        }
      );
      
      logger.log(`PIX payment order created successfully with ID: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Error in pixFormCallback:', error);
      throw error;
    }
  };
  
  return {
    cardFormCallback,
    pixFormCallback
  };
};

/**
 * Checks which payment methods are available based on settings
 */
export const checkPaymentMethodsAvailability = (settings: any) => {
  const pixEnabled = settings?.allowPix !== false;
  const cardEnabled = settings?.allowCreditCard !== false;
  
  return { pixEnabled, cardEnabled };
};

/**
 * Reset the global processed payment IDs (useful for testing)
 */
export const resetProcessedPaymentIds = () => {
  globalProcessedPaymentIds.clear();
};
