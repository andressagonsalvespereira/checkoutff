
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardFormData } from '../CardForm';

interface CardNameFieldProps {
  disabled: boolean;
  error?: string;
}

const CardNameField = ({ disabled, error }: CardNameFieldProps) => {
  const { register } = useFormContext<CardFormData>();
  
  return (
    <div className="space-y-1">
      <Label htmlFor="cardName">Nome no cartão</Label>
      <Input
        id="cardName"
        placeholder="Nome como aparece no cartão"
        disabled={disabled}
        className={error ? "border-red-500" : ""}
        {...register('cardName')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CardNameField;
