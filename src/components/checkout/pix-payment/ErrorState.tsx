
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  message: string;
  retryAction: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, retryAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-red-800 mb-2">
        Erro ao gerar PIX
      </h3>
      <p className="text-red-700 text-center mb-6 max-w-md">
        {message}
      </p>
      <Button 
        onClick={retryAction}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Tentar novamente
      </Button>
    </div>
  );
};

export default ErrorState;
