
import React from 'react';
import { Input } from '@/components/ui/input';
import { CircleAlert, Loader2 } from 'lucide-react';

interface CepInputProps {
  cep: string;
  handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isSearchingCep?: boolean;
}

const CepInput = ({
  cep,
  handleCepChange,
  error,
  isSearchingCep = false
}: CepInputProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="relative">
        <label htmlFor="cep" className="block text-sm mb-1">CEP</label>
        <div className="relative">
          <Input
            id="cep"
            value={cep}
            onChange={handleCepChange}
            className={`h-9 pr-10 ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="00000-000"
            disabled={isSearchingCep}
          />
          {isSearchingCep && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <CircleAlert className="h-3 w-3 mr-1" />
            {error}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Digite o CEP para buscar o endereço automaticamente.
        </p>
      </div>
    </div>
  );
};

export default CepInput;
