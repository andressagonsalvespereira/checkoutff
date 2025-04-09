import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CheckoutCustomization {
  id: number;
  header_message: string;
  banner_image_url: string;
  show_banner: boolean;
  button_color: string;
  button_text_color: string;
  heading_color: string;
  button_text?: string; // Make button_text optional to handle both old and new db schemas
}

interface CheckoutCustomizationContextType {
  customization: CheckoutCustomization | null;
  loading: boolean;
  error: string | null;
  updateCustomization: (data: Partial<CheckoutCustomization>) => Promise<void>;
  uploadBannerImage: (file: File) => Promise<string | null>;
  refreshCustomization: () => Promise<void>;
}

const CheckoutCustomizationContext = createContext<CheckoutCustomizationContextType | undefined>(undefined);

export const useCheckoutCustomization = () => {
  const context = useContext(CheckoutCustomizationContext);
  if (!context) {
    throw new Error('useCheckoutCustomization must be used within a CheckoutCustomizationProvider');
  }
  return context;
};

interface CheckoutCustomizationProviderProps {
  children: ReactNode;
}

export const CheckoutCustomizationProvider: React.FC<CheckoutCustomizationProviderProps> = ({ children }) => {
  const [customization, setCustomization] = useState<CheckoutCustomization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomization = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use 'any' to bypass type checking for the table name
      const { data, error: fetchError } = await (supabase as any)
        .from('checkout_customization')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Set a default button_text if not present in the data
      const customizationData = {
        ...data,
        button_text: data.button_text || 'Finalizar Pagamento'
      };

      setCustomization(customizationData as CheckoutCustomization);
    } catch (err) {
      console.error('Error fetching checkout customization:', err);
      setError('Falha ao carregar configurações de personalização do checkout');
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomization = async () => {
    await fetchCustomization();
  };

  const updateCustomization = async (data: Partial<CheckoutCustomization>) => {
    try {
      setLoading(true);
      setError(null);

      if (!customization?.id) {
        throw new Error('No customization record found to update');
      }

      // Filter out any properties that don't exist in the database
      // This is to prevent errors when trying to save properties that don't exist in the schema
      const { data: tableInfo } = await supabase
        .from('checkout_customization')
        .select('*')
        .limit(1);

      // Create an object with only the properties that exist in the database schema
      const filteredData: Record<string, any> = {};
      if (tableInfo && tableInfo.length > 0) {
        const schemaKeys = Object.keys(tableInfo[0]);
        
        for (const key in data) {
          if (schemaKeys.includes(key)) {
            filteredData[key] = data[key as keyof typeof data];
          }
        }
      } else {
        // Fallback to a safer update with known columns
        const safeKeys = ['header_message', 'banner_image_url', 'show_banner', 'button_color', 'button_text_color', 'heading_color'];
        for (const key of safeKeys) {
          if (key in data) {
            filteredData[key] = data[key as keyof typeof data];
          }
        }
      }

      // Add the updated_at timestamp
      filteredData.updated_at = new Date().toISOString();

      // Use 'any' to bypass type checking for the table name
      const { error: updateError } = await (supabase as any)
        .from('checkout_customization')
        .update(filteredData)
        .eq('id', customization.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Personalização atualizada',
        description: 'As configurações do checkout foram atualizadas com sucesso',
      });

      await fetchCustomization();
    } catch (err) {
      console.error('Error updating checkout customization:', err);
      setError('Falha ao atualizar configurações de personalização');
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações de personalização',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadBannerImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `checkout-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      toast({
        title: 'Imagem enviada',
        description: 'A imagem do banner foi enviada com sucesso',
      });

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading banner image:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a imagem do banner',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchCustomization();
  }, []);

  const value = {
    customization,
    loading,
    error,
    updateCustomization,
    uploadBannerImage,
    refreshCustomization
  };

  return (
    <CheckoutCustomizationContext.Provider value={value}>
      {children}
    </CheckoutCustomizationContext.Provider>
  );
};
