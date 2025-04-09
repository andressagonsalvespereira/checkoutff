
import { z } from 'zod';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';

// Define form validation schema
export const PaymentSettingsSchema = z.object({
  isEnabled: z.boolean().default(false),
  manualCardProcessing: z.boolean().default(false),
  manualCardStatus: z.enum(['APPROVED', 'DENIED', 'ANALYSIS']).default('ANALYSIS'),
  manualCreditCard: z.boolean().default(false),
  allowPix: z.boolean().default(true),
  allowCreditCard: z.boolean().default(true),
  sandboxMode: z.boolean().default(true),
  sandboxApiKey: z.string().optional(),
  productionApiKey: z.string().optional(),
  manualPixPage: z.boolean().default(false),
  manualPaymentConfig: z.boolean().default(false),
  apiKey: z.string().optional(),
});

export type PaymentSettingsFormValues = z.infer<typeof PaymentSettingsSchema>;

// Function to convert FormValues to AsaasSettings
export const formValuesToAsaasSettings = (values: PaymentSettingsFormValues): AsaasSettings => {
  return {
    isEnabled: values.isEnabled ?? false,
    apiKey: values.apiKey || '',
    allowPix: values.allowPix ?? true,
    allowCreditCard: values.allowCreditCard ?? true,
    manualCreditCard: values.manualCreditCard ?? false,
    sandboxMode: values.sandboxMode ?? true,
    sandboxApiKey: values.sandboxApiKey || '',
    productionApiKey: values.productionApiKey || '',
    manualCardProcessing: values.manualCardProcessing ?? false,
    manualCardStatus: values.manualCardStatus as ManualCardStatus,
    manualPixPage: values.manualPixPage ?? false,
    manualPaymentConfig: values.manualPaymentConfig ?? false,
  };
};

// Function to convert AsaasSettings to FormValues
export const asaasSettingsToFormValues = (settings: AsaasSettings): PaymentSettingsFormValues => {
  return {
    isEnabled: settings.isEnabled,
    manualCardProcessing: settings.manualCardProcessing,
    manualCardStatus: settings.manualCardStatus as ManualCardStatus,
    manualCreditCard: settings.manualCreditCard,
    allowPix: settings.allowPix,
    allowCreditCard: settings.allowCreditCard,
    sandboxMode: settings.sandboxMode,
    sandboxApiKey: settings.sandboxApiKey || '',
    productionApiKey: settings.productionApiKey || '',
    manualPixPage: settings.manualPixPage,
    manualPaymentConfig: settings.manualPaymentConfig,
    apiKey: settings.apiKey || '',
  };
};
