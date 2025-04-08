import { useState, useRef, useEffect } from 'react';
import {
  Order,
  CardDetails,
  PixDetails,
  PaymentMethod,
  PaymentStatus,
  DeviceType,
} from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/contexts/order';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';
import { detectDeviceType } from '@/hooks/payment/utils/deviceDetection';
import { logger } from '@/utils/logger';
import { resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';

interface FormState {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep: string;
  useCustomProcessing?: boolean;
  manualCardStatus?: string;
}

interface UseCheckoutOrderProps {
  formState: FormState;
  productDetails: ProductDetailsType;
  handlePayment: (result: {
    orderId: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    cardDetails?: CardDetails;
    pixDetails?: PixDetails;
    orderJustCreated: boolean;
  }) => void;
}

const globalPaymentsInProgress = new Map<string, boolean>();

export const useCheckoutOrder = ({
  formState,
  productDetails,
  handlePayment,
}: UseCheckoutOrderProps) => {
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const orderCreatedRef = useRef<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isProcessing) {
      timeout = setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        logger.warn('[useCheckoutOrder] Resetando estado de processamento após timeout');
      }, 30000);
    }
    return () => clearTimeout(timeout);
  }, [isProcessing]);

  const createOrder = async (
    paymentId: string,
    baseStatus: 'pending' | 'confirmed',
    cardDetails?: CardDetails,
    pixDetails?: PixDetails
  ): Promise<Order> => {
    try {
      logger.log('[useCheckoutOrder] 🔄 Iniciando criação do pedido com paymentId:', paymentId);

      if (isProcessing || processingRef.current || globalPaymentsInProgress.has(paymentId)) {
        logger.warn('[useCheckoutOrder] ⚠️ Já em processamento:', paymentId);
        throw new Error('Pedido em processamento. Aguarde...');
      }

      if (orderCreatedRef.current === paymentId) {
        logger.warn('[useCheckoutOrder] ⚠️ Pedido duplicado com paymentId:', paymentId);
        throw new Error('ID de pagamento já utilizado.');
      }

      setIsProcessing(true);
      processingRef.current = true;
      globalPaymentsInProgress.set(paymentId, true);

      const customer = {
        name: formState.fullName,
        email: formState.email,
        cpf: formState.cpf,
        phone: formState.phone,
        address: formState.street
          ? {
              street: formState.street,
              number: formState.number,
              complement: formState.complement,
              neighborhood: formState.neighborhood,
              city: formState.city,
              state: formState.state,
              postalCode: formState.cep.replace(/\D/g, ''),
            }
          : undefined,
      };

      const isPixPayment = !cardDetails && pixDetails;
      const resolved = (formState.useCustomProcessing && !isPixPayment)
        ? resolveManualStatus(formState.manualCardStatus)
        : baseStatus.toUpperCase();

      const finalStatus: PaymentStatus =
        resolved === 'CONFIRMED' ? 'PAID' :
        resolved === 'REJECTED' ? 'DENIED' :
        'PENDING';

      const deviceType: DeviceType = detectDeviceType();

      const newOrder = await addOrder({
        customer,
        productId: productDetails.id,
        productName: productDetails.name,
        productPrice: productDetails.price,
        paymentMethod: cardDetails ? 'CREDIT_CARD' : 'PIX',
        paymentStatus: finalStatus,
        paymentId,
        asaasPaymentId: paymentId,
        cardDetails,
        pixDetails: isPixPayment ? {
          qrCode: pixDetails?.qrCode || 'QR_CODE_NOT_AVAILABLE',
          qrCodeImage: pixDetails?.qrCodeImage || '',
          expirationDate: pixDetails?.expirationDate || new Date().toISOString(),
        } : undefined,
        orderDate: new Date().toISOString(),
        deviceType,
        isDigitalProduct: productDetails.isDigital,
        // 🆕 Adicionando copia_e_cola se for PIX
        ...(isPixPayment && pixDetails?.qrCode
          ? { copia_e_cola: pixDetails.qrCode }
          : {}),
      });

      logger.log('[useCheckoutOrder] ✅ Pedido criado com ID:', newOrder.id);
      localStorage.setItem('lastOrderId', newOrder.id!.toString());

      toast({
        title: 'Pedido criado com sucesso!',
        description: 'Seu pedido foi registrado.',
        variant: 'default',
      });

      orderCreatedRef.current = paymentId;

      handlePayment({
        orderId: newOrder.id!,
        status: finalStatus,
        paymentMethod: newOrder.paymentMethod,
        cardDetails,
        pixDetails,
        orderJustCreated: true,
      });

      return newOrder;
    } catch (error) {
      logger.error('[useCheckoutOrder] ❌ Erro ao criar pedido:', error);
      toast({
        title: 'Erro ao criar pedido',
        description: 'Não foi possível concluir o pedido.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        processingRef.current = false;
        globalPaymentsInProgress.delete(paymentId);
        logger.log('[useCheckoutOrder] 🔚 Finalizando processamento do pedido');
      }, 2000);
    }
  };

  return {
    createOrder,
    isProcessing,
  };
};
