
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardFormData } from '../CardForm';

interface CardExpiryFieldsProps {
  disabled: boolean;
  monthError?: string;
  yearError?: string;
}

const CardExpiryFields = ({ 
  disabled, 
  monthError, 
  yearError 
}: CardExpiryFieldsProps) => {
  const { control, watch } = useFormContext<CardFormData>();
  const monthValue = watch('expiryMonth');
  const yearValue = watch('expiryYear');
  
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="expiryMonth">Mês</Label>
        <Controller
          name="expiryMonth"
          control={control}
          render={({ field }) => (
            <Input
              id="expiryMonth"
              placeholder="MM"
              value={field.value}
              onChange={(e) => {
                // Allow only numbers and limit to 2 digits
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 2) {
                  // Ensure month is between 1-12
                  if (value.length === 2) {
                    const month = parseInt(value);
                    if (month > 12) {
                      field.onChange('12');
                    } else if (month < 1 && value !== '01' && value !== '00') {
                      field.onChange('01');
                    } else {
                      field.onChange(value);
                    }
                  } else {
                    field.onChange(value);
                  }
                }
              }}
              onBlur={(e) => {
                // Format single digit month to have leading zero on blur
                const value = e.target.value;
                if (value.length === 1 && !isNaN(parseInt(value))) {
                  field.onChange(`0${value}`);
                }
                field.onBlur();
              }}
              disabled={disabled}
              className={monthError ? "border-red-500" : ""}
              maxLength={2}
            />
          )}
        />
        {monthError && <p className="text-xs text-red-500">{monthError}</p>}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="expiryYear">Ano</Label>
        <Controller
          name="expiryYear"
          control={control}
          render={({ field }) => (
            <Input
              id="expiryYear"
              placeholder="AA"
              value={field.value}
              onChange={(e) => {
                // Allow only numbers and limit to 2 digits
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 2) {
                  field.onChange(value);
                }
              }}
              onBlur={field.onBlur}
              disabled={disabled}
              className={yearError ? "border-red-500" : ""}
              maxLength={2}
            />
          )}
        />
        {yearError && <p className="text-xs text-red-500">{yearError}</p>}
      </div>
    </>
  );
};

export default CardExpiryFields;
