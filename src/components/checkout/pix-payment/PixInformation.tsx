
import React from 'react';
import { Clock, Info } from 'lucide-react';

export interface PixInformationProps {
  expirationDate: string;
  isDigitalProduct: boolean;
}

const PixInformation: React.FC<PixInformationProps> = ({ expirationDate, isDigitalProduct }) => {
  // Format expiration date for display
  const formatExpirationDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting expiration date:', e);
      return dateStr; // fallback to original string if formatting fails
    }
  };

  const formattedExpiration = formatExpirationDate(expirationDate);

  return (
    <div className="w-full max-w-md">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
        <div className="flex items-start mb-3">
          <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Validade do PIX</p>
            <p>{formattedExpiration}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Instruções</p>
            <p>
              {isDigitalProduct 
                ? "Após o pagamento, você receberá acesso ao produto digital em seu e-mail." 
                : "Após o pagamento, seu pedido será processado para envio."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixInformation;
