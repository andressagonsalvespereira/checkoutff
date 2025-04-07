
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAsaas } from '@/contexts/AsaasContext';
import AdminLayout from '@/components/layout/AdminLayout';

const AsaasSettings: React.FC = () => {
  const { settings, saveSettings } = useAsaas();
  const { toast } = useToast();

  const [sandboxApiKey, setSandboxApiKey] = useState<string>(settings?.sandboxApiKey || '');
  const [productionApiKey, setProductionApiKey] = useState<string>(settings?.productionApiKey || '');
  const [sandboxMode, setSandboxMode] = useState<boolean>(settings?.sandboxMode || false);
  const [allowCreditCard, setAllowCreditCard] = useState<boolean>(settings?.allowCreditCard || false);
  const [allowPix, setAllowPix] = useState<boolean>(settings?.allowPix || false);
  const [manualCardProcessing, setManualCardProcessing] = useState<boolean>(settings?.manualCardProcessing || false);

  // Update state when settings change
  useEffect(() => {
    if (settings) {
      setSandboxApiKey(settings.sandboxApiKey || '');
      setProductionApiKey(settings.productionApiKey || '');
      setSandboxMode(settings.sandboxMode || false);
      setAllowCreditCard(settings.allowCreditCard || false);
      setAllowPix(settings.allowPix || false);
      setManualCardProcessing(settings.manualCardProcessing || false);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings({
        isEnabled: true,
        apiKey: sandboxMode ? sandboxApiKey : productionApiKey,
        sandboxApiKey,
        productionApiKey,
        sandboxMode,
        allowCreditCard,
        allowPix,
        manualCreditCard: manualCardProcessing,
        manualCardProcessing,
        manualPixPage: false,
        manualPaymentConfig: false,
        manualCardStatus: 'ANALYSIS',
        usePixAsaas: false,
        asaasApiKey: ''
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações do Asaas foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Function to handle switch changes
  const handleSwitchChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      return (value: boolean) => {
        setter(value);
      };
    },
    []
  );

  return (
    <AdminLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configurações do Asaas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sandboxApiKey">Chave da API Sandbox</Label>
            <Input
              id="sandboxApiKey"
              value={sandboxApiKey}
              onChange={(e) => setSandboxApiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productionApiKey">Chave da API Produção</Label>
            <Input
              id="productionApiKey"
              value={productionApiKey}
              onChange={(e) => setProductionApiKey(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="sandboxMode">Modo Sandbox</Label>
            <Switch
              id="sandboxMode"
              checked={sandboxMode}
              onCheckedChange={handleSwitchChange(setSandboxMode)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="allowCreditCard">Permitir Cartão de Crédito</Label>
            <Switch
              id="allowCreditCard"
              checked={allowCreditCard}
              onCheckedChange={handleSwitchChange(setAllowCreditCard)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="allowPix">Permitir PIX</Label>
            <Switch
              id="allowPix"
              checked={allowPix}
              onCheckedChange={handleSwitchChange(setAllowPix)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="manualCardProcessing">Processamento Manual de Cartão</Label>
            <Switch
              id="manualCardProcessing"
              checked={manualCardProcessing}
              onCheckedChange={handleSwitchChange(setManualCardProcessing)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveSettings}
            className="bg-green-600 hover:bg-green-700"
          >
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default AsaasSettings;
