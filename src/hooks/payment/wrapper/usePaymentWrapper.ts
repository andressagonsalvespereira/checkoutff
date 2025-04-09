import { useCallback, useRef } from 'react';
import { PaymentStatus, CardDetails, PixDetails, Order } from '@/types/order';
import { logger } from '@/utils/logger';
import { resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';

const processedPaymentIds = new Set<string>();

type CreateOrderParams = {
  paymentId: string;
  status: PaymentStatus;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
};

export const usePaymentWrapper = () => {
  const isProcessingRef = useRef(false);
  const localProcessedPaymentIds = useRef(new Set<string>());

  const handleOrderCreation = useCallback(
    async (
      { paymentId, status, cardDetails, pixDetails }: CreateOrderParams,
      createOrder: (
        paymentId: string,
        status: PaymentStatus,
        cardDetails?: CardDetails,
        pixDetails?: PixDetails
      ) => Promise<Order>
    ): Promise<Order> => {
      const safePaymentId = paymentId || `payment_${Date.now()}`;
      logger.log(`PaymentWrapper: Processing payment ${safePaymentId} with status ${status}`);

      if (processedPaymentIds.has(safePaymentId) || localProcessedPaymentIds.current.has(safePaymentId)) {
        logger.warn(`PaymentWrapper: Payment ID ${safePaymentId} already processed`);
        throw new Error(`Payment ${safePaymentId} already processed`);
      }

      if (isProcessingRef.current) {
        logger.warn('PaymentWrapper: Already processing a payment');
        throw new Error('Payment already in progress');
      }

      try {
        isProcessingRef.current = true;
        processedPaymentIds.add(safePaymentId);
        localProcessedPaymentIds.current.add(safePaymentId);

        const order = await createOrder(safePaymentId, status, cardDetails, pixDetails);
        logger.log(`PaymentWrapper: Order created successfully with ID ${order.id}`);
        return order;
      } catch (error) {
        logger.error('PaymentWrapper: Error creating order:', error);
        throw error;
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1000);
      }
    },
    []
  );

  const clearProcessedPayments = useCallback(() => {
    processedPaymentIds.clear();
    localProcessedPaymentIds.current.clear();
  }, []);

  return { handleOrderCreation, clearProcessedPayments };
};

export const clearGlobalProcessedPayments = () => {
  processedPaymentIds.clear();
};
