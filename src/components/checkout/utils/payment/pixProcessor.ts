
import { PaymentProcessorProps, PaymentResult } from './types';
import { simulatePixQrCodeGeneration } from './paymentSimulator';

/**
 * Processa pagamento via PIX
 * @param props Propriedades do processador de pagamento
 * @param onSuccess Callback para sucesso
 * @param onError Callback para erro
 */
export const processPixPayment = async (
  props: PaymentProcessorProps,
  onSuccess: (pixData: PaymentResult) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const { formState, isSandbox, onSubmit } = props;
    
    // Validate customer info if available
    const customerInfo = formState.customerInfo;
    if (customerInfo) {
      // Basic validation for required fields
      if (!customerInfo.name || !customerInfo.email || !customerInfo.cpf || !customerInfo.phone) {
        throw new Error('Informações de cliente incompletas. Preencha todos os campos obrigatórios.');
      }
    }
    
    // Em uma implementação real, isso chamaria a API do Asaas
    // 1. Criar cliente
    // 2. Criar cobrança PIX
    // 3. Gerar QR Code
    
    // Simulação de geração de QR Code PIX
    const pixData = await simulatePixQrCodeGeneration();
    
    // Preparar dados de pagamento para o callback
    const paymentData: PaymentResult = {
      success: true,
      method: 'pix', // Fixed: using literal 'pix' instead of string
      paymentId: pixData.paymentId,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      qrCode: pixData.qrCode,
      qrCodeImage: pixData.qrCodeImage,
      expirationDate: pixData.expirationDate
    };
    
    // Enviar dados para processamento
    onSubmit(paymentData);
    
    // Chamar callback de sucesso
    onSuccess(paymentData);
  } catch (error) {
    console.error('Erro ao processar pagamento PIX:', error);
    onError(error instanceof Error ? error.message : 'Erro ao gerar QR Code PIX. Por favor, tente novamente.');
  }
};
