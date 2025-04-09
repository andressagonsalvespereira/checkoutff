
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface AddressShippingOptionsProps {
  selectedShipping: string | null;
  onSelectShipping: (option: string) => void;
  deliveryEstimate: string | null;
  isDigitalProduct?: boolean;
}

const AddressShippingOptions = ({
  selectedShipping,
  onSelectShipping,
  deliveryEstimate,
  isDigitalProduct = false
}: AddressShippingOptionsProps) => {
  
  if (isDigitalProduct) {
    return (
      <div className="mt-4 p-4 border border-green-100 bg-green-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700 font-medium">Entrega via Email</span>
        </div>
        <p className="mt-2 text-sm text-green-600">
          Você receberá os dados de acesso em seu email cadastrado imediatamente após a confirmação do pagamento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      <div className="text-sm font-medium mb-2">Opções de Entrega</div>
      
      <div className="space-y-2">
        <div 
          className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between ${
            selectedShipping === 'standard' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelectShipping('standard')}
        >
          <div>
            <div className="font-medium">Frete</div>
            {deliveryEstimate && 
              <div className="text-sm text-gray-500">
                Entrega estimada: {deliveryEstimate}
              </div>
            }
          </div>
          <div className="flex items-center text-green-500 font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Grátis
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressShippingOptions;
