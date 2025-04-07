import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';

// Define the context type
export interface AsaasContextType {
  settings: AsaasSettings;
  loading: boolean;
  saveSettings: (settings: AsaasSettings) => Promise<void>;
  updateSettings: (settings: AsaasSettings) => Promise<void>;
}

// Create the context with a default value
const AsaasContext = createContext<AsaasContextType | undefined>(undefined);

// Default settings
const defaultSettings: AsaasSettings = {
  isEnabled: false,
  apiKey: '',
  allowCreditCard: true,
  allowPix: true,
  manualCreditCard: false,
  sandboxMode: true,
  sandboxApiKey: '',
  productionApiKey: '',
  manualCardProcessing: false,
  manualPixPage: false,
  manualPaymentConfig: false,
  manualCardStatus: 'ANALYSIS',
  usePixAsaas: false,
  asaasApiKey: '',
};

export const AsaasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AsaasSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const { data: asaasConfigData, error: asaasConfigError } = await supabase
        .from('settings')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (asaasConfigError && asaasConfigError.code !== 'PGRST116') {
        console.error('Error fetching Asaas settings:', asaasConfigError);
        return;
      }

      const { data: asaasApiData, error: asaasApiError } = await supabase
        .from('asaas_config')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (asaasApiError && asaasApiError.code !== 'PGRST116') {
        console.error('Error fetching Asaas API keys:', asaasApiError);
      }

      if (asaasConfigData) {
        setSettings({
          isEnabled: asaasConfigData.asaas_enabled || false,
          apiKey: '',
          allowCreditCard: asaasConfigData.allow_credit_card || true,
          allowPix: asaasConfigData.allow_pix || true,
          manualCreditCard: asaasConfigData.manual_credit_card || false,
          sandboxMode: asaasConfigData.sandbox_mode || true,
          sandboxApiKey: asaasApiData?.sandbox_api_key || '',
          productionApiKey: asaasApiData?.production_api_key || '',
          manualCardProcessing: asaasConfigData.manual_card_processing || false,
          manualPixPage: asaasConfigData.manual_pix_page || false,
          manualPaymentConfig: asaasConfigData.manual_payment_config || false,
          manualCardStatus: (asaasConfigData.manual_card_status as ManualCardStatus) || 'ANALYSIS',
          usePixAsaas: asaasApiData?.use_pix_asaas || false, // ✅ Corrigido
          asaasApiKey: asaasApiData?.sandbox_api_key || '',
        });
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AsaasSettings) => {
    try {
      setLoading(true);

      const { error: settingsError } = await supabase.from('settings').insert({
        asaas_enabled: newSettings.isEnabled,
        allow_credit_card: newSettings.allowCreditCard,
        allow_pix: newSettings.allowPix,
        manual_credit_card: newSettings.manualCreditCard,
        sandbox_mode: newSettings.sandboxMode,
        manual_card_processing: newSettings.manualCardProcessing,
        manual_pix_page: newSettings.manualPixPage,
        manual_payment_config: newSettings.manualPaymentConfig,
        manual_card_status: newSettings.manualCardStatus,
      });

      if (settingsError) {
        console.error('Error saving settings:', settingsError);
        throw settingsError;
      }

      const { error: apiKeysError } = await supabase.from('asaas_config').insert({
        sandbox_api_key: newSettings.sandboxApiKey,
        production_api_key: newSettings.productionApiKey,
        use_pix_asaas: newSettings.usePixAsaas, // ✅ Salva corretamente
      });

      if (apiKeysError) {
        console.error('Error saving API keys:', apiKeysError);
        throw apiKeysError;
      }

      setSettings(newSettings);
    } catch (error) {
      console.error('Error in saveSettings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: AsaasSettings) => {
    try {
      setLoading(true);

      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (existingSettings) {
        const { error: settingsError } = await supabase
          .from('settings')
          .update({
            asaas_enabled: newSettings.isEnabled,
            allow_credit_card: newSettings.allowCreditCard,
            allow_pix: newSettings.allowPix,
            manual_credit_card: newSettings.manualCreditCard,
            sandbox_mode: newSettings.sandboxMode,
            manual_card_processing: newSettings.manualCardProcessing,
            manual_pix_page: newSettings.manualPixPage,
            manual_payment_config: newSettings.manualPaymentConfig,
            manual_card_status: newSettings.manualCardStatus,
          })
          .eq('id', existingSettings.id);

        if (settingsError) {
          console.error('Error updating settings:', settingsError);
          throw settingsError;
        }
      }

      const { data: existingApiKeys } = await supabase
        .from('asaas_config')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (existingApiKeys) {
        const { error: apiKeysError } = await supabase
          .from('asaas_config')
          .update({
            sandbox_api_key: newSettings.sandboxApiKey,
            production_api_key: newSettings.productionApiKey,
            use_pix_asaas: newSettings.usePixAsaas, // ✅ Atualiza corretamente
          })
          .eq('id', existingApiKeys.id);

        if (apiKeysError) {
          console.error('Error updating API keys:', apiKeysError);
          throw apiKeysError;
        }
      } else {
        const { error: apiKeysError } = await supabase.from('asaas_config').insert({
          sandbox_api_key: newSettings.sandboxApiKey,
          production_api_key: newSettings.productionApiKey,
          use_pix_asaas: newSettings.usePixAsaas,
        });

        if (apiKeysError) {
          console.error('Error creating API keys:', apiKeysError);
          throw apiKeysError;
        }
      }

      setSettings(newSettings);
    } catch (error) {
      console.error('Error in updateSettings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AsaasContext.Provider value={{ settings, loading, saveSettings, updateSettings }}>
      {children}
    </AsaasContext.Provider>
  );
};

export const useAsaas = (): AsaasContextType => {
  const context = useContext(AsaasContext);
  if (context === undefined) {
    throw new Error('useAsaas must be used within an AsaasProvider');
  }
  return context;
};
