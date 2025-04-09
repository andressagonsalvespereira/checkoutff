import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Key } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type PixConfig = {
  id: number;
  chavepix: string;
  tipochave: string;
  beneficiario: string;
  copiaecola: string;
  mensagemopcional?: string;
};

export default function SimplePixPayment() {
  const [config, setConfig] = useState<PixConfig | null>(null);
  const [copied, setCopied] = useState(false);

  // Busca a configuração do PIX
  useEffect(() => {
    const fetchConfig = async () => {
      console.log("🔄 Buscando config PIX no Supabase...");
      const { data, error } = await supabase
        .from("pix_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("❌ Erro ao buscar config PIX:", error);
      } else if (data) {
        console.log("📦 Config PIX carregada:", data);
        setConfig(data as PixConfig);
      }
    };

    fetchConfig();
  }, []);

  const handleCopy = () => {
    if (config?.copiaecola) {
      navigator.clipboard.writeText(config.copiaecola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!config) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-lg text-gray-500 animate-pulse">
          Carregando configurações PIX...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Pagamento via PIX
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg shadow-md">
            {config.copiaecola ? (
              <QRCodeCanvas value={config.copiaecola} size={200} />
            ) : (
              <p className="text-red-500 text-center">
                Código Copia e Cola não configurado.
              </p>
            )}
            <p className="text-sm text-green-600 mt-2 text-center font-semibold">
              Escaneie para pagar
            </p>
          </div>
        </div>

        {/* Chave PIX */}
        <div>
          <label className="text-sm font-medium text-gray-700">Chave PIX</label>
          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 mt-2">
            <span className="text-sm text-gray-800 break-all">
              {config.chavepix || "Chave PIX não configurada"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="text-gray-600 hover:text-green-500 transition-colors"
              disabled={!config.copiaecola}
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} />
              )}
            </Button>
          </div>
        </div>

        {/* Informações do Beneficiário */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
          <p className="flex items-center">
            <User size={16} className="mr-2 text-green-500" />
            <strong>Beneficiário:</strong>{" "}
            {config.beneficiario || "Não configurado"}
          </p>
          <p className="flex items-center">
            <Key size={16} className="mr-2 text-green-500" />
            <strong>Tipo de chave:</strong>{" "}
            {config.tipochave || "Não configurado"}
          </p>
        </div>

        {/* Mensagem Opcional */}
        {config.mensagemopcional && (
          <div className="text-sm italic text-gray-500 text-center">
            {config.mensagemopcional}
          </div>
        )}

        {/* Instrução */}
        <div className="text-xs text-gray-500 text-center">
          Escaneie o QR Code ou copie os dados acima no seu aplicativo bancário.
        </div>
      </div>
    </div>
  );
}
