
import React, { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import CheckoutFooter from './CheckoutFooter';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CheckoutContainerProps {
  children: React.ReactNode;
}

interface CheckoutCustomization {
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  header_message?: string;
  banner_image_url?: string;
  show_banner?: boolean;
  heading_color?: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ children }) => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CheckoutCustomization>({
    button_color: '#3b82f6',
    button_text_color: '#ffffff',
    button_text: 'Finalizar Pagamento',
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '',
    show_banner: true,
    heading_color: '#000000'
  });
  const [isCustomizationLoaded, setIsCustomizationLoaded] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        console.log("Fetching checkout customization...");
        
        const { data, error } = await supabase
          .from('checkout_customization')
          .select('*')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          // Using more specific error logging
          if (error.code === "PGRST116") {
            console.log("No checkout customization found, using defaults");
          } else {
            console.error('Error fetching checkout customization:', error);
          }
          
          // Continue with defaults
          setIsCustomizationLoaded(true);
          return;
        }

        if (data) {
          console.log("Checkout customization loaded:", data);
          // Ensure all required fields have values, falling back to defaults if needed
          const safeData: CheckoutCustomization = {
            button_color: data.button_color || '#3b82f6',
            button_text_color: data.button_text_color || '#ffffff',
            button_text: data.button_text || 'Finalizar Pagamento',
            header_message: data.header_message || 'Oferta por tempo limitado!',
            banner_image_url: data.banner_image_url || '',
            show_banner: data.show_banner ?? true,
            heading_color: data.heading_color || '#000000'
          };
          
          setCustomization(safeData);
        }
        
        setIsCustomizationLoaded(true);
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
        // Continue with defaults even on error
        setIsCustomizationLoaded(true);
      }
    };

    fetchCustomization();
  }, []);

  // Add CSS variables for checkout button styling
  const customStyles = {
    '--button-color': customization.button_color || '#3b82f6',
    '--button-text-color': customization.button_text_color || '#ffffff',
    '--button-text': `'${customization.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': customization.heading_color || '#000000',
  } as React.CSSProperties;

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 touch-manipulation" style={customStyles}>
      <CheckoutHeader />
      <main className="max-w-xl mx-auto py-2 px-4">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
