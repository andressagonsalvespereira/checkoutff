import React, { useEffect, useState, useMemo } from 'react';
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
import { usePaymentPolling } from '@/contexts/order/hooks/usePaymentPolling';

const PixPaymentAsaas: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getProductBySlug } = useProducts();
  const { getOrderById } = useOrders();
  const { settings } = useAsaas();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Memoiza dados de navegação
  const orderId = useMemo(() => state?.orderData?.id || localStorage.getItem('lastOrderId'), [state]);
  const orderDataFromState = useMemo(() => state?.orderData, [state]);

  // Redireciona se não houver orderId
  useEffect(() => {
    if (!orderId) {
      logger.warn('[PixPaymentAsaas] Nenhum orderId encontrado! Redirecionando...');
      navigate('/checkout');
    }
  }, [orderId, navigate]);

  // Inicia polling de pagamento
  usePaymentPolling({
    orderId,
    enabled: !!orderId,
    orderData: orderDataFromState,
  });

  // Carrega dados do produto e pagamento
  useEffect(() => {
    const loadProductAndPaymentData = async () => {
      try {
        if (!productSlug) throw new Error('Slug do produto não informado.');
        if (!orderId) throw new Error('ID do pedido não encontrado.');

        const foundProduct = await getProductBySlug(productSlug);
        if (!foundProduct) throw new Error('Produto não encontrado.');
        setProduct(foundProduct);

        if (!settings?.asaasApiKey) {
          throw new Error('Chave da API do Asaas não configurada.');
        }

        let orderData = orderDataFromState;

        if (!orderData || !orderData.pixDetails) {
          const order = await getOrderById(orderId);
          if (!order || !order.pixDetails) {
            throw new Error('Dados do pagamento PIX não encontrados.');
          }
          orderData = order;
        }

        const qrCodeImage = orderData.pixDetails.qrCodeImage;
        const isValidImage = qrCodeImage?.startsWith('data:image/');

        if (!isValidImage) {
          setUseFallback(true);
          logger.warn('[PixPaymentAsaas] QR Code inválido ou ausente, ativando fallback.');
        }

        setPaymentData({
          pix: {
            payload: orderData.pixDetails.qrCode,
            qrCodeImage: qrCodeImage,
          },
        });
      } catch (error: any) {
        logger.error('[PixPaymentAsaas] Erro ao carregar dados do pagamento', error);
        toast({
          title: 'Erro ao carregar cobrança',
          description: error.message || 'Erro inesperado ao carregar dados do pagamento.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProductAndPaymentData();
  }, [productSlug, orderId, getProductBySlug, getOrderById, orderDataFromState, settings, toast]);

  if (!orderId || loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Carregando dados do pagamento...</span>
      </div>
    );
  }

  if (!product || !paymentData?.pix) {
    logger.error('[PixPaymentAsaas] Erro ao exibir dados do PIX', { product, paymentData });
    return (
      <div className="text-center text-red-500 mt-10">
        Erro ao carregar cobrança PIX. Tente novamente mais tarde.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData.pix.payload);
    toast({
      title: 'Código PIX copiado!',
      description: 'Cole no app do banco para concluir o pagamento.',
    });
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento PIX via Asaas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code */}
          {useFallback || !paymentData.pix.qrCodeImage ? (
            <div className="mx-auto w-60 h-60 flex items-center justify-center">
              <QRCode value={paymentData.pix.payload} size={240} level="H" includeMargin />
            </div>
          ) : (
            <img
              src={paymentData.pix.qrCodeImage}
              alt="QR Code PIX"
              className="mx-auto w-60 h-60 border rounded"
              onError={() => {
                logger.warn('[PixPaymentAsaas] Erro ao carregar imagem QR Code. Usando fallback.');
                setUseFallback(true);
              }}
              onLoad={() => logger.log('[PixPaymentAsaas] QR Code carregado com sucesso')}
            />
          )}

          {/* Copia e Cola */}
          <div className="text-center">
            <p className="font-semibold">Escaneie o QR Code ou copie o código abaixo:</p>
            <p className="bg-gray-100 p-2 rounded break-all text-sm">{paymentData.pix.payload}</p>
          </div>

          {/* Produto */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mt-2">
              Produto: <strong>{product.nome}</strong> — R$ {Number(product.preco).toFixed(2)}
            </p>
          </div>

          {/* Botão copiar */}
          <div className="flex justify-center">
            <Button onClick={handleCopy}>Copiar código PIX</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PixPaymentAsaas;
