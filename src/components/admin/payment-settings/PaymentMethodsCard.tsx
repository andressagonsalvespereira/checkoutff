
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, QrCode, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { AsaasSettings } from '@/types/asaas';

interface PaymentMethodsCardProps {
  formState: AsaasSettings;
  loading: boolean;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
  formState,
  loading,
  onUpdateFormState,
}) => {
  const isPaymentConfigEnabled = formState.isEnabled || formState.manualPaymentConfig;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
        <CardDescription>
          Configure quais métodos de pagamento estão disponíveis no seu checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPaymentConfigEnabled && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircleIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ative a integração com o Asaas ou as configurações manuais para ativar os métodos de pagamento.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="pix"
            checked={formState.allowPix}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, allowPix: !!checked }))
            }
            disabled={loading || !isPaymentConfigEnabled}
          />
          <div className="grid gap-1.5">
            <Label
              htmlFor="pix"
              className="text-base font-medium leading-none flex items-center"
            >
              <QrCode className="mr-2 h-4 w-4 text-green-600" />
              Pagamentos via PIX
            </Label>
            <p className="text-sm text-muted-foreground">
              Permitir que os clientes paguem usando PIX
            </p>
          </div>
        </div>
        
        {/* Manual PIX Processing Option */}
        {formState.allowPix && (
          <div className="mt-4 pl-8 border-l-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Página de PIX Manual</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar página de PIX manual para que os clientes possam copiar o código e pagar por fora do sistema
                </p>
              </div>
              <Switch
                checked={formState.manualPixPage || false}
                onCheckedChange={(checked) => 
                  onUpdateFormState(prev => ({ ...prev, manualPixPage: checked }))
                }
                disabled={loading || !isPaymentConfigEnabled || !formState.allowPix}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="credit-card"
            checked={formState.allowCreditCard}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, allowCreditCard: !!checked }))
            }
            disabled={loading || !isPaymentConfigEnabled}
          />
          <div className="grid gap-1.5">
            <Label
              htmlFor="credit-card"
              className="text-base font-medium leading-none flex items-center"
            >
              <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
              Pagamentos via Cartão de Crédito
            </Label>
            <p className="text-sm text-muted-foreground">
              Permitir que os clientes paguem usando cartões de crédito
            </p>
          </div>
        </div>
        
        {/* Manual Card Processing Option */}
        {formState.allowCreditCard && (
          <div className="mt-4 pl-8 border-l-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Processamento Manual de Cartão</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar revisão manual de pagamentos com cartão de crédito em vez de processamento automático
                </p>
              </div>
              <Switch
                checked={formState.manualCardProcessing}
                onCheckedChange={(checked) => 
                  onUpdateFormState(prev => ({ ...prev, manualCardProcessing: checked }))
                }
                disabled={loading || !isPaymentConfigEnabled || !formState.allowCreditCard}
              />
            </div>
            
            {formState.manualCardProcessing && (
              <Alert variant="warning" className="mt-2 bg-amber-50 border-amber-200">
                <AlertCircleIcon className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Com o processamento manual ativado, os pagamentos com cartão não serão processados automaticamente. 
                  Em vez disso, os clientes serão redirecionados para uma página de revisão manual.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {(!formState.allowPix && !formState.allowCreditCard && isPaymentConfigEnabled) && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>
              Pelo menos um método de pagamento deve estar habilitado para que o checkout funcione.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
