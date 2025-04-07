
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardFormData } from '../CardForm';

interface CVVFieldProps {
  disabled: boolean;
  error?: string;
}

const CVVField = ({ disabled, error }: CVVFieldProps) => {
  const { control } = useFormContext<CardFormData>();
  
  return (
    <div className="space-y-1">
      <Label htmlFor="cvv">CVV</Label>
      <Controller
        name="cvv"
        control={control}
        render={({ field }) => (
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            value={field.value}
            onChange={(e) => {
              // Allow only numbers and limit to 3 digits
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 3) {
                field.onChange(value);
              }
            }}
            onBlur={field.onBlur}
            disabled={disabled}
            className={error ? "border-red-500" : ""}
            maxLength={3}
          />
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CVVField;
