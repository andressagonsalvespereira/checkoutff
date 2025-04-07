
import { useState, useCallback } from 'react';
import { CustomerData, PaymentResult } from '@/components/checkout/payment/shared/types';
import { AsaasSettings } from '@/types/asaas';
import { DeviceType } from '@/types/order';
import { detectDeviceType } from '@/hooks/payment/utils/deviceDetection';

export interface UsePixSubmissionProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  customerData?: CustomerData;
  settings: AsaasSettings;
}

export function usePixSubmission({
  onSubmit,
  isSandbox,
  isDigitalProduct = false,
  customerData,
  settings
}: UsePixSubmissionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PaymentResult | null>(null);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const deviceType: DeviceType = detectDeviceType();
      
      // If we're using the sandbox mode, generate mock PIX data
      const currentTime = new Date().toISOString();
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
      
      // Create dummy PIX QR code (simulation for sandbox)
      const generatedPixData: PaymentResult = {
        success: true,
        method: 'pix',
        paymentId: `pix_${Date.now()}`,
        status: 'pending',
        timestamp: currentTime,
        qrCode: '00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925Test Recipient6009Sao Paulo62070503***63048A9D',
        qrCodeImage: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925Test Recipient6009Sao Paulo62070503***63048A9D',
        expirationDate: expirationDate,
        deviceType
      };
      
      setPixData(generatedPixData);
      
      // Pass the PIX payment result to the parent component
      await onSubmit(generatedPixData);
    } catch (err) {
      console.error('Error processing PIX payment:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento PIX');
      setPixData(null);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, isSandbox, isDigitalProduct, customerData]);

  return {
    loading,
    error,
    pixData,
    handleSubmit
  };
}
