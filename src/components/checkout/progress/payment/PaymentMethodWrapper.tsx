import React from 'react';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';
import { Order, CardDetails, PixDetails, PaymentStatus } from '@/types/order';
import { usePaymentWrapper } from '@/hooks/payment/wrapper/usePaymentWrapper';
import { resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';

interface CustomerData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface PaymentMethodWrapperProps {
  paymentMethod: 'card' | 'pix';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'pix'>>;
  productDetails: ProductDetailsType;
  customerData: CustomerData;
  createOrder: (
    paymentId: string,
    status: 'confirmed' | 'pending', // ✅ corrigido para compatibilidade com PaymentMethodSection
    cardDetails?: CardDetails,
    pixDetails?: PixDetails
  ) => Promise<Order>;
  isProcessing: boolean;
}

const PaymentMethodWrapper: React.FC<PaymentMethodWrapperProps> = ({
  paymentMethod,
  setPaymentMethod,
  productDetails,
  customerData,
  createOrder,
  isProcessing
}) => {
  const { handleOrderCreation } = usePaymentWrapper();

  return (
    <PaymentMethodSection
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      createOrder={(paymentId, rawStatus, cardDetails, pixDetails) => {
        const raw = productDetails.usarProcessamentoPersonalizado
          ? productDetails.statusCartaoManual
          : rawStatus;

        const resolved = resolveManualStatus(raw); // 'CONFIRMED' | 'REJECTED' | 'PENDING'

        // Converte para os status aceitos por PaymentMethodSection
        const mappedStatus: 'confirmed' | 'pending' =
          resolved === 'CONFIRMED' ? 'confirmed' : 'pending';

        // Usado internamente por handleOrderCreation
        const fullStatus: PaymentStatus =
          resolved === 'CONFIRMED' ? 'PAID' :
          resolved === 'REJECTED' ? 'DENIED' :
          'PENDING';

        return handleOrderCreation(
          {
            paymentId,
            status: fullStatus,
            cardDetails,
            pixDetails,
          },
          (id, _, card, pix) => createOrder(id, mappedStatus, card, pix)
        );
      }}
      productDetails={productDetails}
      customerData={customerData}
      isProcessing={isProcessing}
    />
  );
};

export default PaymentMethodWrapper;
