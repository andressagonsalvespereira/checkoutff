import { useState, useEffect, useCallback } from 'react';
import { PaymentResult, CustomerData } from '@/types/payment';
import { AsaasSettings } from '@/types/asaas';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface PixPaymentHookProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  customerData?: CustomerData;
  settings?: AsaasSettings;
  productDetails?: any;
}

interface PixData {
  qrCode?: string;
  qrCodeImage?: string;
  paymentId?: string;
  expirationDate?: string;
}

export const usePixPayment = ({
  onSubmit,
  isSandbox,
  isDigitalProduct = false,
  customerData,
  settings,
  productDetails,
}: PixPaymentHookProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const { toast } = useToast();
  
  const clearError = () => {
    if (error) setError(null);
  };
  
  // Generate PIX QR code
  const generatePixQrCode = async () => {
    try {
      setIsLoading(true);
      clearError();
      
      logger.log("Generating PIX QR Code", { isSandbox, isDigitalProduct });
      
      // Fazer a requisição para create-asaas-customer
      const response = await fetch('/.netlify/functions/create-asaas-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerData?.name || "Cliente Desconhecido",
          customer_email: customerData?.email || "cliente@desconhecido.com",
          customer_cpf: customerData?.cpf || "00000000000",
          customer_phone: customerData?.phone || "0000000000",
          product_id: productDetails?.id || 4,
          paymentMethod: 'PIX',
          price: productDetails?.price || 19.9,
          product_name: productDetails?.name || "Assinatura Anual - CineFlick Card"
        }),
      });

      logger.log("Response status:", response.status);
      logger.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("Error response from create-asaas-customer:", errorText);
        throw new Error(`Failed to create payment: ${response.status} - ${errorText}`);
      }

      const paymentData = await response.json();
      logger.log("Payment data from Asaas:", paymentData);

      // Garantir que qrCodeImage esteja no formato correto (data:image/png;base64,...)
      const qrCodeImage = paymentData.pix?.qrCodeImage || paymentData.qrCodeImage || "";
      const formattedQrCodeImage = qrCodeImage.startsWith("data:image/")
        ? qrCodeImage
        : qrCodeImage
        ? `data:image/png;base64,${qrCodeImage}`
        : "";

      // Estrutura esperada do PaymentResult
      const result: PaymentResult = {
        success: true,
        method: 'pix',
        paymentId: paymentData.id || `pix_${Date.now()}`,
        status: paymentData.status === 'PENDING' ? 'pending' : 'confirmed',
        timestamp: new Date().toISOString(),
        qrCode: paymentData.pix?.payload || paymentData.qrCode || "QR_CODE_NOT_AVAILABLE",
        qrCodeImage: formattedQrCodeImage,
        expirationDate: paymentData.pix?.expirationDate || new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      };

      logger.log("Mapped PaymentResult:", result);

      // Update state with PIX data
      setPixData({
        qrCode: result.qrCode,
        qrCodeImage: result.qrCodeImage,
        paymentId: result.paymentId,
        expirationDate: result.expirationDate
      });
      
      // Submit payment data to parent component
      if (onSubmit) {
        logger.log("Calling onSubmit with result:", result);
        await onSubmit(result);
      }
      
      logger.log("PIX QR Code generated successfully");
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate PIX QR Code";
      logger.error("Error generating PIX QR Code:", err);
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Não rejeitar a promessa, apenas logar o erro
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Success",
          description: "PIX code copied to clipboard",
          duration: 3000,
        });
      })
      .catch((err) => {
        logger.error("Error copying to clipboard:", err);
        toast({
          title: "Error",
          description: "Failed to copy PIX code",
          variant: "destructive",
        });
      });
  }, [toast]);
  
  // Auto-generate PIX code on first render if in manual mode
  useEffect(() => {
    if (settings?.manualPixPage && !pixData && !isLoading) {
      generatePixQrCode().catch((err) => {
        logger.error("Auto-generation of PIX code failed:", err);
      });
    }
  }, [settings?.manualPixPage, pixData, isLoading]);
  
  return {
    isLoading,
    error,
    pixData,
    generatePixQrCode,
    handleCopyToClipboard,
    clearError
  };
};