
import React from 'react';
import { Input } from '@/components/ui/input';
import { CircleAlert } from 'lucide-react';

interface AddressFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

const AddressField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false
}: AddressFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm mb-1">{label}</label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className={`h-9 ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <CircleAlert className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default AddressField;
