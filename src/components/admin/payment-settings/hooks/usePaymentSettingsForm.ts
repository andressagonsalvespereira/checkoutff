
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAsaas } from '@/contexts/AsaasContext';
import { 
  PaymentSettingsSchema, 
  PaymentSettingsFormValues, 
  formValuesToAsaasSettings, 
  asaasSettingsToFormValues 
} from '../../utils/formUtils';
import { AsaasSettings } from '@/types/asaas';

export const usePaymentSettingsForm = () => {
  const { toast } = useToast();
  const { settings, updateSettings, loading } = useAsaas();
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<AsaasSettings>({
    isEnabled: false,
    manualCardProcessing: false,
    manualCardStatus: 'ANALYSIS',
    manualCreditCard: false,
    allowPix: true,
    allowCreditCard: true,
    sandboxMode: true,
    sandboxApiKey: '',
    productionApiKey: '',
    manualPixPage: false,
    manualPaymentConfig: false,
    apiKey: '',
  });

  const form = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(PaymentSettingsSchema),
    defaultValues: {
      isEnabled: false,
      manualCardProcessing: false,
      manualCardStatus: 'ANALYSIS',
      manualCreditCard: false,
      allowPix: true,
      allowCreditCard: true,
      sandboxMode: true,
      sandboxApiKey: '',
      productionApiKey: '',
      manualPixPage: false,
      manualPaymentConfig: false,
      apiKey: '',
    },
  });

  useEffect(() => {
    if (settings && !loading) {
      const formValues = asaasSettingsToFormValues(settings);
      form.reset(formValues);
      setFormState(settings);
    }
  }, [settings, loading, form]);

  // Update formState when the form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormState(formValuesToAsaasSettings(value as PaymentSettingsFormValues));
    });
    
    // Ensure proper cleanup for the subscription
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: PaymentSettingsFormValues) => {
    setIsSaving(true);
    try {
      // Calculate apiKey based on sandbox mode
      const apiKey = data.sandboxMode 
        ? data.sandboxApiKey || ''
        : data.productionApiKey || '';
        
      const settingsToUpdate = formValuesToAsaasSettings({
        ...data,
        apiKey
      });
      
      await updateSettings(settingsToUpdate);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de pagamento foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormState = (
    updater: (prev: AsaasSettings) => AsaasSettings
  ) => {
    const newFormState = updater(formState);
    form.reset(asaasSettingsToFormValues(newFormState));
  };

  return {
    form,
    formState,
    loading,
    isSaving,
    onSubmit,
    updateFormState
  };
};
