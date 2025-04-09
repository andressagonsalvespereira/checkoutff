
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleAlert, Loader2 } from 'lucide-react';

interface AddressInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
  helpText?: string;
}

const AddressInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  isLoading = false,
  helpText
}: AddressInputProps) => {
  return (
    <div className="space-y-1.5 relative">
      <Label htmlFor={id} className="mb-2 block">{label}</Label>
      <div className="relative">
        <Input 
          id={id} 
          value={value}
          onChange={onChange}
          className={`border ${error ? 'border-red-500' : 'border-gray-300'}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <div className="text-red-500 text-xs mt-1 flex items-center">
          <CircleAlert className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
      {helpText && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default AddressInput;
