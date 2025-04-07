
import { supabase } from '@/integrations/supabase/client';

export interface PixelSettings {
  googlePixelEnabled: boolean;
  googlePixelId: string;
  googlePageView: boolean;
  googlePurchase: boolean;
  metaPixelEnabled: boolean;
  metaPixelId: string;
  metaPageView: boolean;
  metaAddToCart: boolean;
  metaPurchase: boolean;
}

export interface TrackPurchaseData {
  value: number;
  transactionId: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const getPixelSettings = async (): Promise<PixelSettings> => {
  const { data, error } = await supabase
    .from('pixel_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching pixel settings:', error);
    return {
      googlePixelEnabled: false,
      googlePixelId: '',
      googlePageView: false,
      googlePurchase: false,
      metaPixelEnabled: false,
      metaPixelId: '',
      metaPageView: false,
      metaAddToCart: false,
      metaPurchase: false
    };
  }

  return {
    googlePixelEnabled: data.google_pixel_enabled || false,
    googlePixelId: data.google_pixel_id || '',
    googlePageView: data.google_page_view || false,
    googlePurchase: data.google_purchase || false,
    metaPixelEnabled: data.meta_pixel_enabled || false,
    metaPixelId: data.meta_pixel_id || '',
    metaPageView: data.meta_page_view || false,
    metaAddToCart: data.meta_add_to_cart || false,
    metaPurchase: data.meta_purchase || false
  };
};

export const updatePixelSettings = async (
  googlePixelEnabled: boolean, 
  googlePixelId: string, 
  googlePageView: boolean, 
  googlePurchase: boolean, 
  metaPixelEnabled: boolean, 
  metaPixelId: string, 
  metaPageView: boolean, 
  metaAddToCart: boolean, 
  metaPurchase: boolean
) => {
  const { error } = await supabase
    .from('pixel_settings')
    .update({
      google_pixel_enabled: googlePixelEnabled,
      google_pixel_id: googlePixelId,
      google_page_view: googlePageView,
      google_purchase: googlePurchase,
      meta_pixel_enabled: metaPixelEnabled,
      meta_pixel_id: metaPixelId,
      meta_page_view: metaPageView,
      meta_add_to_cart: metaAddToCart,
      meta_purchase: metaPurchase,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (error) {
    console.error('Error updating pixel settings:', error);
    throw error;
  }
};

export const initializePixels = (): void => {
  // Code to initialize pixels would go here
  console.log('Pixels initialized');
};

export const trackPageView = (): void => {
  // Code to track page views would go here
  console.log('Page view tracked');
};

export const trackPurchase = (data: TrackPurchaseData): void => {
  // Code to track purchases would go here
  console.log('Purchase tracked', data);
};
