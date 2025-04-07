
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { PaymentProcessorProps, PaymentResult } from '../shared/types';
import { detectCardBrand } from './utils/cardDetection';
import { simulateCardPayment } from '../shared/paymentSimulator';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';
import { DeviceType } from '@/types/order';

interface ProcessCardPaymentParams {
  cardData: CardFormData;
  props: PaymentProcessorProps;
  setError: (error: string) => void;
  setPaymentStatus?: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  navigate: (path: string, state?: any) => void;
  toast: (config: { title: string; description: string; variant?: "default" | "destructive"; duration?: number }) => void;
  isDigitalProduct?: boolean;
}

/**
 * Processa pagamento com cartão de crédito
 * @param params Parâmetros para processamento do cartão
 * @returns Resultado do processamento de pagamento
 */
export const processCardPayment = async ({
  cardData,
  props,
  setError,
  setPaymentStatus,
  setIsSubmitting,
  navigate,
  toast,
  isDigitalProduct = false
}: ProcessCardPaymentParams): Promise<PaymentResult> => {
  try {
    logger.log("Processando pagamento com cartão", { 
      cardData: { 
        cardName: cardData.cardName,
        cardNumber: cardData.cardNumber ? `****${cardData.cardNumber.slice(-4)}` : '',
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear
      }
    });
    
    // Detecta tipo de dispositivo para estatísticas
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    const deviceType: DeviceType = isMobileDevice ? 'mobile' : 'desktop';

    logger.log("Configurações de processamento:", { 
      manualCardProcessing: props.settings.manualCardProcessing,
      manualCardStatus: props.settings.manualCardStatus,
      isDigitalProduct
    });

    // Determina qual processador usar com base nas configurações
    if (props.settings.manualCardProcessing) {
      logger.log("Usando processamento manual de cartão");
      return await processManualPayment({
        cardData,
        formState: { 
          ...props.formState,
          isDigitalProduct
        },
        settings: props.settings,
        deviceType,
        navigate,
        setIsSubmitting,
        setError,
        toast,
        onSubmit: props.onSubmit
      });
    } else {
      logger.log("Usando processamento automático de cartão");
      return await processAutomaticPayment({
        cardData,
        formState: { 
          ...props.formState,
          isDigitalProduct
        },
        settings: props.settings,
        isSandbox: props.isSandbox,
        deviceType,
        setPaymentStatus,
        setIsSubmitting,
        setError,
        navigate,
        toast,
        onSubmit: props.onSubmit
      });
    }
  } catch (error) {
    logger.error('Erro no processamento do cartão:', error);
    setError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    setIsSubmitting(false);
    
    // Retorna um objeto PaymentResult válido em caso de erro
    return {
      success: false,
      method: 'card',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  }
};

// Funções internas de processamento

interface ProcessManualPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  deviceType: DeviceType;
  navigate: (path: string, state?: any) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  toast: (config: { title: string; description: string; variant?: "default" | "destructive"; duration?: number }) => void;
  onSubmit?: (data: any) => Promise<any> | any;
}

/**
 * Processa pagamento manual de cartão (modo de testes/sandbox)
 */
async function processManualPayment({
  cardData,
  formState,
  settings,
  deviceType,
  navigate,
  setIsSubmitting,
  setError,
  toast,
  onSubmit
}: ProcessManualPaymentParams): Promise<PaymentResult> {
  setIsSubmitting(true);
  
  try {
    logger.log("Processamento manual com configurações:", {
      manualCardStatus: settings.manualCardStatus,
      isDigitalProduct: formState.isDigitalProduct
    });
    
    // Gera ID de pagamento simulado para rastreamento
    const paymentId = `manual_${uuidv4()}`;
    
    // Determina status do pagamento com base nas configurações
    let paymentStatus = 'PENDING';
    
    // Verifica se deve usar configurações específicas do produto primeiro
    if (formState.useCustomProcessing && formState.manualCardStatus) {
      paymentStatus = formState.manualCardStatus;
      logger.log(`Usando configuração de status específica do produto: ${paymentStatus}`);
    } else if (settings.manualCardStatus) {
      paymentStatus = settings.manualCardStatus;
      logger.log(`Usando configuração de status global: ${paymentStatus}`);
    }
    
    // Detecta bandeira do cartão
    const brand = detectCardBrand(cardData.cardNumber);
    
    // Prepara o objeto de resultado de pagamento
    const paymentResult: PaymentResult = {
      success: paymentStatus !== 'DENIED',
      method: 'card',
      paymentId,
      status: paymentStatus,
      cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand,
      timestamp: new Date().toISOString(),
      deviceType
    };
    
    // Envia os dados de pagamento para criar um pedido
    logger.log("Enviando dados para criar pedido");
    
    // Chama onSubmit e aguarda o resultado
    const result = onSubmit ? await onSubmit(paymentResult) : null;
    logger.log("Pedido criado com sucesso");
    
    // Determina para onde navegar com base no status do pagamento
    const orderData = result ? {
      orderId: result.id,
      productName: result.productName,
      productPrice: result.productPrice,
      productId: result.productId,
      paymentMethod: result.paymentMethod,
      paymentStatus: paymentStatus
    } : {
      paymentStatus: paymentStatus
    };
    
    // Função auxiliar para determinar o caminho de redirecionamento com base no status
    const getRedirectPath = () => {
      if (paymentStatus === 'DENIED') {
        logger.log(`Redirecionando para página de falha devido ao status: ${paymentStatus}`);
        return '/payment-failed';
      } else if (paymentStatus === 'APPROVED') {
        logger.log(`Redirecionando para página de sucesso devido ao status: ${paymentStatus}`);
        return '/payment-success';
      } else {
        // Se o status for ANALYSIS ou qualquer outro, usa a página de sucesso mas indica que está em análise
        logger.log(`Redirecionando para página de sucesso com status em análise: ${paymentStatus}`);
        return '/payment-success';
      }
    };
    
    // Notificação toast com base no status
    if (paymentStatus !== 'DENIED') {
      toast({
        title: paymentStatus === 'APPROVED' ? "Pagamento Aprovado" : "Pagamento em Análise",
        description: paymentStatus === 'APPROVED' 
          ? "Seu pagamento foi aprovado com sucesso!" 
          : "Seu pagamento foi recebido e está em análise.",
        duration: 5000,
        variant: "default"
      });
    } else {
      toast({
        title: "Pagamento Recusado",
        description: "Seu pagamento foi recusado. Por favor, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    // Navega para a página apropriada
    const redirectPath = getRedirectPath();
    logger.log(`Redirecionando para: ${redirectPath} com estado:`, orderData);
    
    navigate(redirectPath, { 
      state: { orderData }
    });
    
    return paymentResult;
  } catch (error) {
    logger.error('Erro no processamento manual:', error);
    setError('Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.');
    
    // Mostrar toast de erro
    toast({
      title: "Erro no Processamento",
      description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      variant: "destructive",
      duration: 5000,
    });
    
    // Retorna um resultado de erro corretamente tipado
    return {
      success: false,
      method: 'card',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  } finally {
    setIsSubmitting(false);
  }
}

interface ProcessAutomaticPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  deviceType: DeviceType;
  setPaymentStatus?: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  navigate: (path: string, state?: any) => void;
  toast: (config: { title: string; description: string; variant?: "default" | "destructive"; duration?: number }) => void;
  onSubmit?: (data: any) => Promise<any> | any;
}

/**
 * Processa pagamento automático de cartão (modo de produção)
 */
async function processAutomaticPayment({
  cardData,
  formState,
  settings,
  isSandbox,
  deviceType,
  setPaymentStatus = () => {},
  setIsSubmitting,
  setError,
  navigate,
  toast,
  onSubmit
}: ProcessAutomaticPaymentParams): Promise<PaymentResult> {
  try {
    logger.log("Processando pagamento automático de cartão");
    
    // Detecta bandeira do cartão
    const brand = detectCardBrand(cardData.cardNumber);
    
    // Simula processamento bem-sucedido de pagamento via API
    const simulationResult = await simulateCardPayment(true);
    const paymentId = simulationResult.paymentId;
    
    setPaymentStatus('CONFIRMED');
    
    // Formata os dados para criar o pedido
    const orderData = {
      customer: formState.customerInfo,
      productId: formState.productId,
      productName: formState.productName,
      productPrice: formState.productPrice,
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'PAID',
      paymentId,
      cardDetails: {
        number: cardData.cardNumber.replace(/\D/g, '').slice(-4).padStart(16, '*'),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
        brand
      },
      orderDate: new Date().toISOString(),
      deviceType,
      isDigitalProduct: formState.isDigitalProduct
    };
    
    // Chama a função onSubmit se fornecida (para criar o pedido)
    if (onSubmit) {
      await onSubmit(orderData);
    }
    
    // Mostra mensagem de sucesso
    toast({
      title: "Pagamento aprovado!",
      description: "Seu pagamento foi processado com sucesso.",
      duration: 5000,
      variant: "default"
    });
    
    // Navega para a página de sucesso
    setTimeout(() => {
      navigate('/payment-success', { 
        state: { 
          orderData: {
            paymentId,
            productName: formState.productName,
            productPrice: formState.productPrice,
            paymentStatus: 'APPROVED'
          },
          automatic: true 
        } 
      });
    }, 2000);
    
    return { 
      success: true, 
      paymentId,
      method: 'card',
      status: 'CONFIRMED',
      timestamp: new Date().toISOString() 
    };
  } catch (error) {
    logger.error("Erro no processamento automático de cartão:", error);
    setError(error instanceof Error ? error.message : 'Falha ao processar pagamento');
    setIsSubmitting(false);
    
    // Navega para página de falha para erros persistentes
    navigate('/payment-failed', { 
      state: { 
        productName: formState.productName,
        error: error instanceof Error ? error.message : 'Falha ao processar pagamento'
      } 
    });
    
    return { 
      success: false, 
      error: 'Falha ao processar pagamento',
      method: 'card',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  }
}
