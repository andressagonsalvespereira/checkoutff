
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, CreditCard } from 'lucide-react';
import { AsaasSettings } from '@/types/asaas';

interface AsaasIntegrationCardProps {
  formState: AsaasSettings;
  loading: boolean;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const AsaasIntegrationCard: React.FC<AsaasIntegrationCardProps> = ({
  formState,
  loading,
  onUpdateFormState,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Configurações de Pagamento
        </CardTitle>
        <CardDescription>
          Configure as opções de pagamento do seu checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Configurações Manuais</Label>
            <p className="text-sm text-muted-foreground">
              Ative para configurar manualmente os métodos de pagamento sem precisar do Asaas
            </p>
          </div>
          <Switch
            checked={formState.manualPaymentConfig || false}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, manualPaymentConfig: checked }))
            }
            disabled={loading}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Ativar Integração com Asaas</Label>
            <p className="text-sm text-muted-foreground">
              Ative para habilitar o processamento de pagamentos através do Asaas
            </p>
          </div>
          <Switch
            checked={formState.isEnabled}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, isEnabled: checked }))
            }
            disabled={loading}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Modo Sandbox</Label>
            <p className="text-sm text-muted-foreground">
              Use o sandbox do Asaas para testes (não processa pagamentos reais)
            </p>
          </div>
          <Switch
            checked={formState.sandboxMode}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, sandboxMode: checked }))
            }
            disabled={loading || !formState.isEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AsaasIntegrationCard;
