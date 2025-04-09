import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { useAsaas } from '@/contexts/AsaasContext';
import { useOrders } from '@/contexts/OrderContext';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import CheckoutProgressContainer from '@/components/checkout/progress/CheckoutProgressContainer';
import ProductNotFound from '@/components/checkout/quick-checkout/ProductNotFound';
import { PaymentMethod, PaymentStatus } from '@/types/order';
import { logger } from '@/utils/logger';
import {
  resolveManualStatus,
  isConfirmedStatus,
  isRejectedStatus
} from '@/contexts/order/utils/resolveManualStatus';

const Checkout: React.FC = () => {
  const { productSlug } = useParams<{ productSlug?: string }>();
  const { products, getProductById, getProductBySlug } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useAsaas();
  const { addOrder } = useOrders();
  const orderCreatedRef = React.useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let product = null;
        if (productSlug) {
          product = await getProductBySlug(productSlug);
        } else if (products && products.length > 0) {
          product = products[0];
        }

        if (product) {
          logger.log("Produto encontrado:", product);
          setSelectedProduct(product);
        } else {
          toast({
            title: "Produto não encontrado",
            description: productSlug 
              ? `Não encontramos o produto \"${productSlug}\"`
              : "Nenhum produto disponível",
            variant: "destructive",
          });
        }
      } catch (error) {
        logger.error("Erro ao buscar produto:", error);
        toast({
          title: "Erro ao carregar produto",
          description: "Ocorreu um erro ao tentar carregar os detalhes do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, products, getProductBySlug, getProductById, toast]);

  useEffect(() => {
    if (settings) {
      if (paymentMethod === 'card' && !settings.allowCreditCard && settings.allowPix) {
        setPaymentMethod('pix');
      } else if (paymentMethod === 'pix' && !settings.allowPix && settings.allowCreditCard) {
        setPaymentMethod('card');
      }
    }
  }, [settings, paymentMethod]);

  const handlePayment = async (paymentData: any) => {
    logger.log("Iniciando processamento de pagamento com dados:", paymentData);
    setIsProcessing(true);

    try {
      if (!selectedProduct) throw new Error("Produto não disponível para finalizar o pedido");

      if (paymentData.orderJustCreated || orderCreatedRef.current) {
        orderCreatedRef.current = true;

        const normalized = resolveManualStatus(paymentData.status);

        toast({
          title: isConfirmedStatus(normalized) ? "Pedido aprovado!" :
                 normalized === 'PENDING' ? "Pedido pendente!" :
                 "Pagamento recusado!",
          description: isConfirmedStatus(normalized)
            ? "Seu pedido foi registrado com sucesso."
            : normalized === 'PENDING'
            ? "Seu pagamento está em análise ou aguardando ação."
            : "Seu pagamento foi recusado. Tente novamente ou use outro método.",
          duration: 5000,
          variant: isRejectedStatus(normalized) ? 'destructive' : 'default'
        });

        if (paymentMethod === 'pix') {
          const path = settings?.usePixAsaas && settings?.asaasApiKey
            ? `/pix-asaas/${selectedProduct.slug}`
            : `/pix-payment/${selectedProduct.slug}`;
          navigate(path, { state: { orderData: paymentData } });
          return;
        }

        if (isConfirmedStatus(normalized)) {
          navigate('/payment-success', { state: { orderData: paymentData } });
        } else if (normalized === 'PENDING') {
          navigate('/payment-pending', { state: { orderData: paymentData } });
        } else {
          navigate('/payment-failed', { state: { orderData: paymentData } });
        }

        return;
      }

      const paymentMethodEnum: PaymentMethod = paymentMethod === 'card' ? 'CREDIT_CARD' : 'PIX';
      const paymentStatusEnum: PaymentStatus = paymentData.status === 'confirmed' ? 'PAID' : 'PENDING';

      orderCreatedRef.current = true;

      const orderData = {
        customer: paymentData.customerData || {
          name: paymentData.customerName || "Cliente",
          email: paymentData.customerEmail || "cliente@exemplo.com",
          cpf: paymentData.customerCpf || "00000000000",
          phone: paymentData.customerPhone || ""
        },
        productId: selectedProduct.id,
        productName: selectedProduct.nome,
        productPrice: selectedProduct.preco,
        paymentMethod: paymentMethodEnum,
        paymentStatus: paymentStatusEnum,
        isDigitalProduct: selectedProduct.digital,
        paymentId: paymentData.id,
        cardDetails: paymentMethod === 'card' && paymentData.cardDetails ? {
          number: paymentData.cardDetails.number,
          expiryMonth: paymentData.cardDetails.expiryMonth,
          expiryYear: paymentData.cardDetails.expiryYear,
          cvv: paymentData.cardDetails.cvv,
          brand: paymentData.cardDetails.brand || 'Desconhecida'
        } : undefined,
        pixDetails: paymentMethod === 'pix' && paymentData.pixDetails ? {
          qrCode: paymentData.pixDetails.qrCode,
          qrCodeImage: paymentData.pixDetails.qrCodeImage,
          expirationDate: paymentData.pixDetails.expirationDate
        } : undefined
      };

      logger.log("Criando pedido com dados:", orderData);
      const newOrder = await addOrder(orderData);
      logger.log("Pedido criado com sucesso:", newOrder);

      toast({
        title: "Pedido realizado com sucesso!",
        description: paymentMethod === 'pix' 
          ? "Utilize o QR code PIX para finalizar o pagamento." 
          : "Seu pagamento foi processado.",
        duration: 5000,
      });

      navigate('/payment-success');
    } catch (error) {
      logger.error('Erro ao processar pagamento:', error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <CheckoutContainer>
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Carregando dados do produto...</span>
        </div>
      </CheckoutContainer>
    );
  }

  if (!selectedProduct) {
    return (
      <CheckoutContainer>
        <ProductNotFound slug={productSlug || 'Produto não encontrado'} />
      </CheckoutContainer>
    );
  }

  const productDetails = {
    id: selectedProduct.id,
    name: selectedProduct.nome,
    price: selectedProduct.preco,
    image: selectedProduct.urlImagem,
    description: selectedProduct.descricao,
    isDigital: selectedProduct.digital
  };

  return (
    <CheckoutContainer>
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Finalizar Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutProgressContainer 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            productDetails={productDetails}
            handlePayment={handlePayment}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>
    </CheckoutContainer>
  );
};

export default Checkout;
