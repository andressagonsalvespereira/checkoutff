
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPaymentProps {
  message?: string;
}

const LoadingPayment: React.FC<LoadingPaymentProps> = ({ 
  message = 'Carregando opções de pagamento...' 
}) => {
  return (
    <div className="p-6 text-center">
      <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingPayment;
