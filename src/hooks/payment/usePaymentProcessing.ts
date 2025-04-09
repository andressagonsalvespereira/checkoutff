
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/contexts/OrderContext';
import { usePixel } from '@/contexts/PixelContext';
import { CustomerInfo, PaymentMethod, PaymentStatus } from '@/types/order';
import { Product } from '@/types/product';
import { logger } from '@/utils/logger';

interface PaymentData {
  status?: PaymentStatus | string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  brand?: string;
  qrCodeBase64?: string;
  qrCodeImage?: string;
  expirationDate?: string;
  [key: string]: any;
}

export const usePaymentProcessing = (
  product: Product | null,
  customerDetails: CustomerInfo
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const { trackPurchase } = usePixel();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  
  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    try {
      logger.log("Starting handlePaymentSubmit with data:", {
        customerDetails,
        productDetails: product ? {
          id: product.id,
          name: product.nome,
          price: product.preco,
          isDigital: product.digital
        } : 'No product available',
        paymentMethod,
        paymentStatus: paymentData.status
      });
      
      if (!product) {
        logger.error("Trying to submit payment without product data");
        throw new Error("Dados do produto não disponíveis");
      }
      
      const orderData = {
        product: product,
        customer: customerDetails,
        payment: {
          method: paymentMethod,
          ...paymentData
        }
      };
      
      logger.log("Submitting order with payment data:", {
        customerId: customerDetails.name,
        customerEmail: customerDetails.email,
        productId: product.id,
        productName: product.nome,
        productPrice: product.preco,
        paymentMethod,
        cardDetails: paymentData.cardNumber ? {
          brand: paymentData.brand || 'Desconhecida',
          last4: paymentData.cardNumber.slice(-4),
        } : undefined,
        isDigitalProduct: product.digital,
        useCustomProcessing: product.usarProcessamentoPersonalizado,
        manualCardStatus: product.statusCartaoManual,
        paymentDataStatus: paymentData.status
      });
      
      // Normalize the status based on the input
      let paymentStatus: PaymentStatus;
      
      // If the status is coming from paymentData, make sure it's valid
      if (paymentData.status) {
        if (paymentData.status === 'CONFIRMED') {
          paymentStatus = 'PAID';
        } else if (typeof paymentData.status === 'string' && 
                 ['PENDING', 'PAID', 'APPROVED', 'DENIED', 'ANALYSIS', 'CANCELLED'].includes(paymentData.status)) {
          paymentStatus = paymentData.status as PaymentStatus;
        } else {
          paymentStatus = 'PENDING'; // Default fallback
        }
      } else {
        paymentStatus = 'PENDING'; // Default when no status is provided
      }
      
      logger.log("Final normalized payment status:", paymentStatus);
      
      const newOrder = await addOrder({
        customer: customerDetails,
        productId: product.id,
        productName: product.nome,
        productPrice: product.preco,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        isDigitalProduct: product.digital,
        cardDetails: paymentData.cardNumber ? {
          number: paymentData.cardNumber,
          expiryMonth: paymentData.expiryMonth,
          expiryYear: paymentData.expiryYear,
          cvv: paymentData.cvv,
          brand: paymentData.brand || 'Desconhecida'
        } : undefined,
        pixDetails: paymentMethod === 'PIX' ? {
          qrCode: paymentData.qrCodeBase64,
          qrCodeImage: paymentData.qrCodeImage,
          expirationDate: paymentData.expirationDate
        } : undefined
      });
      
      logger.log("Order successfully created:", newOrder);
      
      setIsOrderSubmitted(true);
      
      trackPurchase({
        value: product.preco,
        transactionId: `order-${newOrder.id}`,
        products: [{
          id: product.id,
          name: product.nome,
          price: product.preco,
          quantity: 1
        }]
      });
      
      if (paymentMethod === 'PIX' || ['PAID', 'APPROVED'].includes(paymentStatus)) {
        toast({
          title: "Pedido realizado com sucesso!",
          description: paymentMethod === 'PIX' 
            ? "Utilize o QR code PIX para finalizar o pagamento." 
            : "Seu pagamento foi aprovado.",
          duration: 5000,
        });
      }
      
      return newOrder;
    } catch (error) {
      logger.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    isOrderSubmitted,
    handlePaymentSubmit
  };
};
