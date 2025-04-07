
import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutCustomization {
  header_message: string;
  banner_image_url: string;
  show_banner: boolean;
  button_color: string;
  button_text_color: string;
  heading_color: string;
}

const CheckoutHeader = () => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 14,
    seconds: 59
  });
  const [customization, setCustomization] = useState<CheckoutCustomization>({
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '',
    show_banner: true,
    button_color: '#3b82f6',
    button_text_color: '#ffffff',
    heading_color: '#000000'
  });

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('checkout_customization')
          .select('header_message, banner_image_url, show_banner, button_color, button_text_color, heading_color')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching checkout customization:', error);
          return;
        }

        if (data) {
          setCustomization(data as CheckoutCustomization);
        }
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
      }
    };

    fetchCustomization();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="text-base md:text-lg">
            {customization.header_message} <span className="font-bold text-yellow-300">{formatTime(timeLeft.minutes, timeLeft.seconds)}</span>
          </div>
        </div>
      </header>
      
      {customization.show_banner && customization.banner_image_url && (
        <div className="w-full flex justify-center mt-2 mb-4">
          <div className="max-w-xl w-full px-4">
            <img 
              src={customization.banner_image_url} 
              alt="Checkout Banner" 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutHeader;
