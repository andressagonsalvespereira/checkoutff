
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  initializePixels, 
  trackPageView as trackPageViewService,
  getPixelSettings,
  PixelSettings,
  TrackPurchaseData
} from '@/services/pixelService';

interface PixelContextType {
  pixelSettings: PixelSettings | null;
  isInitialized: boolean;
  trackPurchase: (data: TrackPurchaseData) => void;
  trackPageView: () => void; // Add this property to fix the type error
}

const PixelContext = createContext<PixelContextType>({
  pixelSettings: null,
  isInitialized: false,
  trackPurchase: () => {},
  trackPageView: () => {} // Add default implementation
});

export const usePixel = () => useContext(PixelContext);

interface PixelProviderProps {
  children: ReactNode;
}

export const PixelProvider: React.FC<PixelProviderProps> = ({ children }) => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [pixelSettings, setPixelSettings] = React.useState<PixelSettings | null>(null);

  // Inicializa pixels no primeiro carregamento
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getPixelSettings();
        setPixelSettings(settings);
        
        // Verifica se temos configurações e se algum pixel está habilitado
        if (settings && (
          (settings.googlePixelEnabled && settings.googlePixelId) || 
          (settings.metaPixelEnabled && settings.metaPixelId)
        )) {
          await initializePixels();
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Erro ao inicializar pixels:', error);
      }
    };
    
    fetchSettings();
  }, []);

  // Rastreia visualizações de página quando a localização muda
  useEffect(() => {
    if (isInitialized) {
      trackPageViewService();
    }
  }, [location.pathname, isInitialized]);

  // Function to track page views explicitly
  const trackPageView = () => {
    if (isInitialized) {
      trackPageViewService();
    }
  };

  // Function to track purchases
  const trackPurchase = (data: TrackPurchaseData) => {
    if (isInitialized) {
      import('@/services/pixelService').then(module => {
        module.trackPurchase(data);
      });
    }
  };

  return (
    <PixelContext.Provider value={{ 
      pixelSettings, 
      isInitialized, 
      trackPurchase,
      trackPageView // Add the function to the context value
    }}>
      {children}
    </PixelContext.Provider>
  );
};

export default PixelProvider;
