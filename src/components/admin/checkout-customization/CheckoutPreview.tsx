
import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { FormValues } from './types';

interface CheckoutPreviewProps {
  watch: UseFormWatch<FormValues>;
}

const CheckoutPreview: React.FC<CheckoutPreviewProps> = ({ watch }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Prévia do Checkout</h3>
      <div className="border rounded-md p-4 bg-gray-50">
        {watch('show_banner') && watch('banner_image_url') && (
          <div className="mb-4">
            <img 
              src={watch('banner_image_url')} 
              alt="Banner preview" 
              className="w-full h-auto rounded-md"
            />
          </div>
        )}
        
        <div 
          className="bg-gray-800 text-white p-3 text-center mb-4 rounded-md"
          style={{ color: '#ffffff' }}
        >
          {watch('header_message')}
        </div>
        
        <div className="space-y-4">
          <h3 
            className="text-lg font-medium"
            style={{ color: watch('heading_color') }}
          >
            Informações do Produto
          </h3>
          <div className="py-2 border-t border-b">
            <p>Produto de Exemplo</p>
            <p className="text-gray-500">R$ 99,90</p>
          </div>
          <button 
            className="w-full py-2 rounded-md text-center"
            style={{ 
              backgroundColor: watch('button_color'),
              color: watch('button_text_color')
            }}
          >
            {watch('button_text') || 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
