import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, User, Key, Star, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type PixConfig = {
  id: number;
  chavepix: string;
  tipochave: string;
  beneficiario: string;
  copiaecola: string;
  mensagemopcional?: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
};

export default function PixPaymentManual() {
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const [config, setConfig] = useState<PixConfig | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showQRCode, setShowQRCode] = useState(true); // Controla a visibilidade do QR Code

  useEffect(() => {
    if (!productSlug) {
      navigate("/checkout");
    }
  }, [productSlug]);

  // Timer para o tempo limite de pagamento (15 minutos)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          navigate("/checkout", { state: { message: "O tempo para pagamento expirou." } });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Temporizador para ocultar o QR Code e simular pagamento aprovado após 10 segundos
  useEffect(() => {
    console.log("Iniciando temporizador de 10 segundos...");
    const qrTimer = setTimeout(() => {
      console.log("10 segundos atingidos! Ocultando QR Code e mostrando mensagem...");
      setShowQRCode(false); // Oculta o QR Code
      setPaymentConfirmed(true); // Mostra a mensagem de pagamento aprovado
    }, 10000); // 10 segundos

    return () => {
      console.log("Limpando temporizador de 10 segundos...");
      clearTimeout(qrTimer);
    };
  }, []);

  // Redirecionamento após a mensagem de pagamento aprovado
  useEffect(() => {
    if (paymentConfirmed) {
      console.log("Pagamento confirmado! Redirecionando em 2 segundos...");
      const redirectTimer = setTimeout(() => {
        console.log("Redirecionando para /download-manual...");
        navigate("/download-manual");
      }, 2000); // 2 segundos após a mensagem

      return () => {
        console.log("Limpando temporizador de redirecionamento...");
        clearTimeout(redirectTimer);
      };
    }
  }, [paymentConfirmed, navigate]);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("pix_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Erro ao buscar config PIX:", error);
      } else {
        setConfig(data as PixConfig);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, slug")
        .eq("slug", productSlug)
        .single();

      if (error) {
        console.error("Erro ao buscar produto:", error);
      } else {
        setProduct(data as Product);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleCopy = () => {
    if (config?.copiaecola) {
      navigator.clipboard.writeText(config.copiaecola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!config || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-lg text-gray-500 animate-pulse">
          Carregando pagamento...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      {/* Timer Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center py-3 rounded-lg mb-6 flex items-center justify-center space-x-2">
        <Clock size={20} />
        <p className="text-lg font-semibold">
          Oferta com tempo limitado! {formatTime(timeLeft)}
        </p>
      </div>

      {/* Payment Confirmation Message */}
      {paymentConfirmed && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center flex items-center justify-center space-x-2">
          <Check size={20} />
          <p className="text-lg font-semibold">Pagamento Aprovado!</p>
        </div>
      )}

      {/* Payment Section */}
      {showQRCode && (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center border-b border-gray-200 py-4 px-6">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full mr-3">
              <Check size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              1. Pagamento via PIX
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <QRCodeCanvas value={config.copiaecola} size={200} />
                <p className="text-sm text-green-600 mt-2 text-center">
                  Escaneie agora!
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Chave PIX
              </label>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 mt-2">
                <span className="text-sm text-gray-800 break-all">
                  {config.chavepix}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-green-500 transition-colors"
                >
                  {copied ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
              <p className="flex items-center">
                <User size={16} className="mr-2 text-green-500" />
                <strong>Beneficiário:</strong> {config.beneficiario}
              </p>
              <p className="flex items-center">
                <Key size={16} className="mr-2 text-green-500" />
                <strong>Tipo de chave:</strong> {config.tipochave}
              </p>
            </div>

            {config.mensagemopcional && (
              <div className="text-sm italic text-gray-500">
                {config.mensagemopcional}
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Escaneie o QR Code ou copie os dados acima no seu aplicativo
              bancário.
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-white rounded-full mr-3">
            2
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            O que nossos clientes dizem
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Reinaldo Martins da Silva
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Excelente serviço, recomendo!
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Juliana Nascimento
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Produto de alta qualidade, entrega rápida!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Summary Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-white rounded-full mr-3">
            3
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Resumo do Pedido
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-sm space-y-3 text-gray-700">
            <p>
              <strong>Sua Compra:</strong> {product.name}
            </p>
            <p>
              <strong>Valor:</strong> R$ {product.price.toFixed(2)}
            </p>
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse"
            onClick={() => {
              setShowQRCode(false);
              setPaymentConfirmed(true);
            }}
          >
            <Check size={18} />
            <span>Confirmar Pagamento</span>
          </Button>
        </div>
      </div>
    </div>
  );
}