
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAsaas } from '@/contexts/AsaasContext';
import PaymentMethodSectionHeader from './PaymentMethodSection/PaymentMethodSectionHeader';
import PaymentMethodContent from './PaymentMethodSection/PaymentMethodContent';
import { usePaymentMethodLogic, PaymentMethodType } from './PaymentMethodSection/usePaymentMethodLogic';
import LoadingPayment from './payment-methods/LoadingPayment';
import { checkPaymentMethodsAvailability } from './PaymentMethodSection/paymentMethodUtils';

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>;
  createOrder?: (
    paymentId: string, 
    status: 'pending' | 'confirmed',
    cardDetails?: any,
    pixDetails?: any
  ) => Promise<any>;
  productDetails?: any;
  customerData?: any;
  isProcessing?: boolean;
}

const PaymentMethodSection = ({ 
  paymentMethod, 
  setPaymentMethod,
  createOrder,
  productDetails,
  customerData,
  isProcessing = false
}: PaymentMethodSectionProps) => {
  const { settings } = useAsaas();
  const [showPixPayment, setShowPixPayment] = useState(false);
  
  // Use the extracted logic hook
  const { pixEnabled, cardEnabled, error, isLoading } = usePaymentMethodLogic(settings, setPaymentMethod);

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-8 border rounded-lg p-4 bg-white shadow-sm">
        <PaymentMethodSectionHeader />
        <LoadingPayment />
      </div>
    );
  }

  // Show error if no payment methods are available
  if (!pixEnabled && !cardEnabled) {
    return (
      <div className="mb-8 border rounded-lg p-4 bg-white shadow-sm">
        <PaymentMethodSectionHeader />
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Nenhum método de pagamento está habilitado. Por favor, contate o administrador.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-8 border rounded-lg p-4 bg-white shadow-sm">
      <PaymentMethodSectionHeader />
      <PaymentMethodContent 
        pixEnabled={pixEnabled}
        cardEnabled={cardEnabled}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        settings={settings}
        error={error}
        createOrder={createOrder}
        isProcessing={isProcessing}
        productDetails={productDetails}
        customerData={customerData}
        showPixPayment={showPixPayment}
        setShowPixPayment={setShowPixPayment}
      />
    </div>
  );
};

export default PaymentMethodSection;
