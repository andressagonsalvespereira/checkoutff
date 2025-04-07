
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '../../pix-payment/LoadingState';
import ErrorState from '../../pix-payment/ErrorState';
import PixQrCode from '../../pix-payment/PixQrCode';
import PixCopyCode from '../../pix-payment/PixCopyCode';
import PixInformation from '../../pix-payment/PixInformation';
import { useAsaas } from '@/contexts/AsaasContext';
import { usePixPayment } from '@/hooks/payment/usePixPayment';
import { PaymentResult, CustomerData } from '@/types/payment';

interface PixPaymentProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  customerData?: CustomerData;
}

const PixPayment: React.FC<PixPaymentProps> = ({ 
  onSubmit, 
  isSandbox,
  isDigitalProduct = false,
  customerData
}) => {
  const { settings } = useAsaas();
  
  const { 
    isLoading, 
    error, 
    pixData,
    generatePixQrCode,
    handleCopyToClipboard
  } = usePixPayment({
    onSubmit,
    isSandbox,
    isDigitalProduct,
    customerData,
    settings
  });
  
  const handleProcessPayment = async () => {
    console.log("Manual PIX payment generation triggered");
    await generatePixQrCode();
  };
  
  // If we're still loading
  if (isLoading) {
    return <LoadingState />;
  }
  
  // If we encountered an error
  if (error) {
    return (
      <ErrorState 
        message={error} 
        retryAction={handleProcessPayment} 
      />
    );
  }
  
  // If we haven't generated a PIX code yet
  if (!pixData) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-center mb-6">
          Click the button below to generate a PIX code for payment.
        </p>
        <button
          onClick={handleProcessPayment}
          className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Generating PIX...</span>
            </>
          ) : (
            "Generate PIX Code"
          )}
        </button>
      </div>
    );
  }
  
  // If we have generated a PIX code
  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <PixQrCode 
        qrCodeUrl={pixData.qrCodeImage || ''} 
      />
      <PixCopyCode 
        code={pixData.qrCode || ''} 
        onCopy={() => handleCopyToClipboard(pixData.qrCode || '')} 
      />
      <PixInformation 
        expirationDate={pixData.expirationDate || ''} 
        isDigitalProduct={isDigitalProduct} 
      />
    </div>
  );
};

export default PixPayment;
