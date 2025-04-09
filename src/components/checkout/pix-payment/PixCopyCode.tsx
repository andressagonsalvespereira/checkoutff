
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PixCopyCodeProps {
  code: string;
  onCopy: () => void;
}

const PixCopyCode: React.FC<PixCopyCodeProps> = ({ code, onCopy }) => {
  return (
    <div className="w-full max-w-md mb-4">
      <h3 className="text-lg font-semibold text-center mb-2">
        Código PIX
      </h3>
      <div className="flex items-center gap-2">
        <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs font-mono flex-1 overflow-x-auto whitespace-nowrap">
          {code}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onCopy}
          className="flex-shrink-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Clique no botão ao lado para copiar o código PIX
      </p>
    </div>
  );
};

export default PixCopyCode;
