
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardFormData } from '../CardForm';
import { detectCardBrand } from '@/components/checkout/utils/payment/cardDetection';
import { formatCardNumber } from '@/components/checkout/utils/cardValidation';
import { CreditCard } from 'lucide-react';

interface CardNumberFieldProps {
  disabled: boolean;
  error?: string;
}

const CardNumberField = ({ disabled, error }: CardNumberFieldProps) => {
  const { control, watch } = useFormContext<CardFormData>();
  const cardNumber = watch('cardNumber');
  const cardBrand = cardNumber && cardNumber.length >= 4 ? detectCardBrand(cardNumber) : '';
  
  return (
    <div className="space-y-1">
      <Label htmlFor="cardNumber">Número do cartão</Label>
      <div className="relative">
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => (
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              disabled={disabled}
              className={`${error ? "border-red-500" : ""} pr-16`}
              value={field.value}
              onChange={(e) => {
                const formattedValue = formatCardNumber(e.target.value);
                field.onChange(formattedValue);
              }}
              onBlur={field.onBlur}
            />
          )}
        />
        
        {cardBrand && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
            {cardBrand}
          </div>
        )}
        
        {!cardBrand && cardNumber && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CreditCard className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CardNumberField;
