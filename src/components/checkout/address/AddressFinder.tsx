
import React from 'react';
import AddressInput from '../AddressInput';

interface AddressFinderProps {
  cep: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isLoading: boolean;
  disabled?: boolean;
}

const AddressFinder = ({ cep, onChange, error, isLoading, disabled }: AddressFinderProps) => {
  return (
    <AddressInput
      id="cep"
      label="CEP"
      value={cep}
      onChange={onChange}
      placeholder="00000-000"
      error={error}
      disabled={disabled}
      isLoading={isLoading}
      helpText="Digite o CEP para buscar o endereço automaticamente"
    />
  );
};

export default AddressFinder;
