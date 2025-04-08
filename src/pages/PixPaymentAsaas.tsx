import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { useAsaas } from '@/contexts/AsaasContext';
import { useOrders } from '@/contexts/OrderContext';
import { logger } from '@/utils/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode.react';

const PixPaymentAsaas: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { state } = useLocation();
  const { getProductBySlug } = useProducts();
  const { getOrderById } = useOrders();
  const { settings } = useAsaas();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [useFallback, setUseFallback] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProductAndPaymentData = async () => {
      try {
        if (!productSlug) throw new Error("Slug do produto não informado.");
        const foundProduct = await getProductBySlug(productSlug);
        if (!foundProduct) throw new Error("Produto não encontrado.");
        setProduct(foundProduct);

        if (!settings?.asaasApiKey) throw new Error("Chave da API do Asaas não configurada.");
        logger.log("Produto encontrado:", foundProduct);

        let orderData = state?.orderData;
        logger.log("Order data received via state:", orderData);

        if (!orderData || !orderData.pixDetails) {
          const orderId = localStorage.getItem('lastOrderId');
          if (!orderId) throw new Error("ID do pedido não encontrado.");

          const order = await getOrderById(orderId);
          if (!order || !order.pixDetails) {
            throw new Error("Dados do pagamento PIX não encontrados no Supabase.");
          }
          orderData = order;
        }

        logger.log("PIX details from orderData:", orderData.pixDetails);

        const qrCodeImage = orderData.pixDetails.qrCodeImage;
        if (!qrCodeImage || !qrCodeImage.startsWith("data:image/")) {
          logger.warn("qrCodeImage inválido ou ausente, usando fallback:", qrCodeImage);
          setUseFallback(true);
        }

        setPaymentData({
          pix: {
            payload: orderData.pixDetails.qrCode,
            qrCodeImage: qrCodeImage,
          },
        });
      } catch (error: any) {
        logger.error("Erro ao carregar dados do pagamento via Asaas:", error);
        toast({
          title: "Erro ao carregar cobrança",
          description: error.message || "Não foi possível carregar o pagamento.",
          variant: "destructive",
        });
        navigate('/payment-failed');
      } finally {
        setLoading(false);
      }
    };

    loadProductAndPaymentData();
  }, [productSlug, getProductBySlug, getOrderById, settings, state, toast, navigate]);

  // 🔁 Polling para checar status de pagamento
  useEffect(() => {
    const orderId = state?.orderData?.id || localStorage.getItem('lastOrderId');
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const latestOrder = await getOrderById(orderId);
        if (!latestOrder) return;

        const status = (latestOrder.payment_status || '').toUpperCase();
        logger.log('[Polling] Status atual do pedido:', status);

        if (status === 'PAID' || status === 'CONFIRMED') {
          logger.log('✅ Pagamento confirmado, redirecionando...');
          navigate('/payment-success', { state: { orderData: latestOrder } });
          clearInterval(interval);
        }

        if (status === 'DENIED' || status === 'CANCELLED') {
          logger.warn('❌ Pagamento negado, redirecionando...');
          navigate('/payment-failed', { state: { orderData: latestOrder } });
          clearInterval(interval);
        }
      } catch (error) {
        logger.error('[Polling] Erro ao verificar status do pedido:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state?.orderData?.id, getOrderById, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Carregando dados do pagamento...</span>
      </div>
    );
  }

  if (!product || !paymentData?.pix) {
    logger.error("Erro ao carregar dados do PIX:", { product, paymentData });
    return <div className="text-center text-red-500 mt-10">Erro ao carregar cobrança PIX.</div>;
  }

  logger.log("Rendering PIX payment page with data:", paymentData);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento PIX via Asaas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {useFallback || !paymentData.pix.qrCodeImage ? (
            <div className="mx-auto w-60 h-60 flex items-center justify-center">
              <QRCode
                value={paymentData.pix.payload}
                size={240}
                level="H"
                includeMargin={true}
              />
            </div>
          ) : (
            <img
              src={paymentData.pix.qrCodeImage}
              alt="QR Code PIX"
              className="mx-auto w-60 h-60 border rounded"
              onError={(e) => {
                logger.error("Erro ao carregar imagem do QR code:", e);
                setUseFallback(true);
              }}
              onLoad={() => logger.log("Imagem do QR code carregada com sucesso.")}
            />
          )}
          <div className="text-center">
            <p className="font-semibold">Escaneie o QR Code ou copie o código abaixo:</p>
            <p className="bg-gray-100 p-2 rounded break-all text-sm">{paymentData.pix.payload}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm mt-2">
              Produto: <strong>{product.nome}</strong> — R$ {Number(product.preco).toFixed(2)}
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigator.clipboard.writeText(paymentData.pix.payload)}>
              Copiar código PIX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixPaymentAsaas;
