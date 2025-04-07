
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertTriangle, Clock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

// Use string literals instead of enum
const MANUAL_CARD_STATUS = {
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  ANALYSIS: 'ANALYSIS'
} as const;

interface ManualPaymentSettingsProps {
  form: UseFormReturn<any>;
}

const ManualPaymentSettings: React.FC<ManualPaymentSettingsProps> = ({ form }) => {
  const showManualSettings = form.watch('manualCardProcessing');
  
  if (!showManualSettings) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Pagamento Manual</CardTitle>
        <CardDescription>
          Configure como os pagamentos manuais de cartão serão processados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Estas configurações se aplicam apenas quando o processamento manual de cartão está ativado.
            A configuração escolhida determinará para qual página o cliente será redirecionado após o pagamento.
          </AlertDescription>
        </Alert>
        
        <FormField
          control={form.control}
          name="manualCardStatus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status de pagamento manual</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 rounded-md border border-green-200 bg-green-50">
                    <RadioGroupItem value={MANUAL_CARD_STATUS.APPROVED} id="approved" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="approved" className="flex items-center text-base font-medium text-green-700">
                        <Check className="mr-2 h-5 w-5 text-green-600" />
                        Pagamento Aprovado
                      </Label>
                      <p className="text-sm text-green-600 mt-1">
                        O pagamento manual será automaticamente marcado como aprovado.
                        Redireciona para a página de sucesso.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-md border border-amber-200 bg-amber-50">
                    <RadioGroupItem value={MANUAL_CARD_STATUS.ANALYSIS} id="analysis" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="analysis" className="flex items-center text-base font-medium text-amber-700">
                        <Clock className="mr-2 h-5 w-5 text-amber-600" />
                        Pagamento em Análise
                      </Label>
                      <p className="text-sm text-amber-600 mt-1">
                        O pagamento será marcado como pendente de análise.
                        Redireciona para a página de sucesso com status "Em análise".
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-md border border-red-200 bg-red-50">
                    <RadioGroupItem value={MANUAL_CARD_STATUS.DENIED} id="denied" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="denied" className="flex items-center text-base font-medium text-red-700">
                        <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                        Pagamento Recusado
                      </Label>
                      <p className="text-sm text-red-600 mt-1">
                        O pagamento manual será <strong>automaticamente recusado</strong>.
                        Redireciona para a página de <strong>falha de pagamento</strong>.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Escolha o comportamento padrão para pagamentos manuais de cartão. Esta configuração afeta 
                diretamente para qual página o cliente será direcionado após o pagamento.
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ManualPaymentSettings;
