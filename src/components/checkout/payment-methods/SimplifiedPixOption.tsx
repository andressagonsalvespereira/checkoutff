
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerData, PaymentResult } from '@/components/checkout/payment/shared/types';
import { usePixSubmission } from '@/hooks/payment/usePixSubmission';
import { useAsaas } from '@/contexts/AsaasContext';
import PixQrCode from '../pix-payment/PixQrCode';
import PixCopyCode from '../pix-payment/PixCopyCode';
import { useToast } from '@/hooks/use-toast';

interface SimplifiedPixOptionProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isDigitalProduct?: boolean;
  customerData?: CustomerData;
  isSandbox: boolean;
  isProcessing?: boolean;
  productData?: {
    productId: string;
    productName: string;
    productPrice: number;
  };
}

const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({
  onSubmit,
  isDigitalProduct = false,
  customerData,
  isSandbox,
  isProcessing = false,
  productData
}) => {
  const { toast } = useToast();
  const { settings } = useAsaas();
  
  const {
    loading,
    error,
    pixData,
    handleSubmit
  } = usePixSubmission({
    onSubmit,
    isSandbox,
    isDigitalProduct,
    customerData,
    settings
  });

  const handleCopyToClipboard = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código PIX copiado!",
      description: "Cole o código no seu aplicativo do banco para pagar.",
    });
  };
  
  // Show PIX payment button if no PIX data exists yet
  if (!pixData) {
    return (
      <div className="w-full">
        <Button 
          className="w-full my-4 bg-green-600 hover:bg-green-700" 
          onClick={handleSubmit}
          disabled={loading || isProcessing}
        >
          {loading ? "Gerando PIX..." : "Gerar QR Code PIX"}
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            Erro: {error}
          </div>
        )}
      </div>
    );
  }

  // Show PIX QR code and details
  return (
    <div className="space-y-6 w-full">
      <PixQrCode qrCodeUrl={pixData.qrCodeImage || ''} />
      <PixCopyCode 
        code={pixData.qrCode || ''} 
        onCopy={() => handleCopyToClipboard(pixData.qrCode || '')} 
      />
      <p className="text-sm text-gray-500 mt-2">
        Este código PIX expira em 30 minutos. 
        {isDigitalProduct && ' Você receberá acesso imediato ao produto após o pagamento.'}
      </p>
    </div>
  );
};

export default SimplifiedPixOption;
