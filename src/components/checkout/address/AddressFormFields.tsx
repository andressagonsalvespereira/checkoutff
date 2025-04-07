
import React from 'react';
import { Input } from '@/components/ui/input';
import AddressField from '@/components/checkout/address/AddressField';

interface AddressFieldsProps {
  street: string;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: (value: string) => void;
  complement: string;
  setComplement: React.Dispatch<React.SetStateAction<string>>;
  neighborhood: string;
  setNeighborhood: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  errors: Record<string, string>;
  disabled?: boolean;
}

const AddressFormFields = ({
  street,
  setStreet,
  number,
  setNumber,
  complement,
  setComplement,
  neighborhood,
  setNeighborhood,
  city,
  setCity,
  state,
  setState,
  errors,
  disabled = false
}: AddressFieldsProps) => {
  // Modified handler to extract the value and pass it to the parent component
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <AddressField
          id="street"
          label="Endereço"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          error={errors.street}
          disabled={disabled}
          placeholder="Rua, Avenida, etc."
        />
        <AddressField
          id="number"
          label="Número"
          value={number}
          onChange={handleNumberChange}
          error={errors.number}
          disabled={disabled}
          placeholder="123"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <AddressField
          id="complement"
          label="Complemento (opcional)"
          value={complement}
          onChange={(e) => setComplement(e.target.value)}
          disabled={disabled}
          placeholder="Apto, Bloco, Casa, etc."
        />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <AddressField
          id="neighborhood"
          label="Bairro"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          error={errors.neighborhood}
          disabled={disabled}
          placeholder="Seu bairro"
        />
        <AddressField
          id="city"
          label="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={errors.city}
          disabled={disabled}
          placeholder="Sua cidade"
        />
        <AddressField
          id="state"
          label="Estado"
          value={state}
          onChange={(e) => setState(e.target.value)}
          error={errors.state}
          disabled={disabled}
          placeholder="UF"
        />
      </div>
    </>
  );
};

export default AddressFormFields;
