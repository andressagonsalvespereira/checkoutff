import React from 'react';
import PaymentOptions from '@/components/checkout/payment-methods/PaymentOptions';
import PaymentError from '@/components/checkout/payment-methods/PaymentError';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import SimplifiedPixOption from '@/components/checkout/payment-methods/SimplifiedPixOption';
import PixPayment from '@/components/checkout/PixPayment';
import { PaymentMethodType } from './usePaymentMethodLogic';
import { PaymentResult } from '@/components/checkout/payment/shared/types';
import { logger } from '@/utils/logger';

// Set para rastrear IDs de pagamento já processados
const processedPaymentIds = new Set<string>();

interface PaymentMethodContentProps {
  pixEnabled: boolean;
  cardEnabled: boolean;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>;
  settings: any;
  error: string | null;
  createOrder?: (
    paymentId: string, 
    status: 'pending' | 'confirmed',
    cardDetails?: any,
    pixDetails?: any,
    asaasPaymentId?: string
  ) => Promise<any>;
  isProcessing: boolean;
  productDetails?: any;
  customerData?: any;
  showPixPayment: boolean;
  setShowPixPayment: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentMethodContent: React.FC<PaymentMethodContentProps> = ({
  pixEnabled,
  cardEnabled,
  paymentMethod,
  setPaymentMethod,
  settings,
  error,
  createOrder,
  isProcessing,
  productDetails,
  customerData,
  showPixPayment,
  setShowPixPayment
}) => {
  const cardFormCallback = async (data: PaymentResult): Promise<any> => {
    if (!createOrder) {
      logger.warn("Tentativa de criar pedido sem função createOrder disponível");
      return null;
    }

    const paymentId = data.paymentId || `card_${Date.now()}`;

    logger.log("Card form callback triggered", {
      paymentId,
      status: data.status,
      cardLast4: data.cardNumber ? data.cardNumber.slice(-4) : 'N/A',
      brand: data.brand || 'unknown'
    });

    if (processedPaymentIds.has(paymentId)) {
      logger.warn(`Pagamento ${paymentId} já foi processado`);
      return { duplicated: true, alreadyProcessed: true, paymentId };
    }

    processedPaymentIds.add(paymentId);

    try {
      return await createOrder(
        paymentId,
        data.status === 'confirmed' ? 'confirmed' : 'pending',
        {
          number: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
          brand: data.brand || 'unknown'
        },
        undefined
      );
    } catch (error) {
      logger.error("Erro ao criar pedido com cartão:", error);
      throw error;
    }
  };

  const pixFormCallback = async (data: PaymentResult): Promise<any> => {
    if (!createOrder) {
      logger.warn("Tentativa de criar pedido sem função createOrder disponível");
      return null;
    }

    const paymentId = data.paymentId || `pix_${Date.now()}`;

    logger.log("PIX form callback triggered", {
      paymentId,
      hasQrCode: !!data.qrCode,
      hasQrCodeImage: !!data.qrCodeImage
    });

    if (processedPaymentIds.has(paymentId)) {
      logger.warn(`Pagamento ${paymentId} já foi processado`);
      return { duplicated: true, alreadyProcessed: true, paymentId };
    }

    processedPaymentIds.add(paymentId);

    try {
      return await createOrder(
        paymentId,
        'pending',
        undefined,
        {
          qrCode: data.qrCode,
          qrCodeImage: data.qrCodeImage,
          expirationDate: data.expirationDate
        },
        data.paymentId // asaasPaymentId
      );
    } catch (error) {
      logger.error("Erro ao criar pedido com PIX:", error);
      throw error;
    }
  };

  const handleShowPixPayment = (): Promise<PaymentResult> => {
    setShowPixPayment(true);
    return Promise.resolve({
      success: true,
      method: 'pix',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  };

  const isDigitalProduct = productDetails?.isDigital || false;

  return (
    <div>
      {pixEnabled && cardEnabled && (
        <PaymentOptions 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          settings={settings}
        />
      )}
      
      <PaymentError error={error} />
      
      {cardEnabled && paymentMethod === 'card' && (
        <CheckoutForm 
          onSubmit={cardFormCallback}
          isSandbox={settings.sandboxMode}
          isDigitalProduct={isDigitalProduct}
        />
      )}
      
      {pixEnabled && paymentMethod === 'pix' && !showPixPayment && (
        <SimplifiedPixOption 
          onSubmit={handleShowPixPayment}
          isProcessing={isProcessing}
          productData={productDetails ? {
            productId: productDetails.id,
            productName: productDetails.name,
            productPrice: productDetails.price
          } : undefined}
          customerData={customerData}
          isSandbox={settings.sandboxMode || true}
          isDigitalProduct={isDigitalProduct}
        />
      )}
      
      {pixEnabled && paymentMethod === 'pix' && showPixPayment && (
        <PixPayment 
          onSubmit={pixFormCallback}
          isSandbox={settings.sandboxMode || true}
          isDigitalProduct={isDigitalProduct}
          customerData={customerData}
        />
      )}
    </div>
  );
};

export default PaymentMethodContent;

export const clearProcessedPaymentIds = () => {
  processedPaymentIds.clear();
};
