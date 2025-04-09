
import React from 'react';
import { Input } from '@/components/ui/input';
import AddressField from '@/components/checkout/address/AddressField';

interface AddressFieldsProps {
  street: string;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  complement: string;
  setComplement: React.Dispatch<React.SetStateAction<string>>;
  neighborhood: string;
  setNeighborhood: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  formErrors: Record<string, string>;
  isSearchingCep?: boolean;
}

const AddressFields = ({
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
  formErrors,
  isSearchingCep = false
}: AddressFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-1">
          <AddressField
            id="street"
            label="Endereço"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            error={formErrors.street}
            disabled={isSearchingCep}
            placeholder="Rua, Avenida, etc."
          />
        </div>
        <div className="sm:col-span-1">
          <AddressField
            id="number"
            label="Número"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            error={formErrors.number}
            disabled={isSearchingCep}
            placeholder="123"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <AddressField
          id="complement"
          label="Complemento (opcional)"
          value={complement}
          onChange={(e) => setComplement(e.target.value)}
          disabled={isSearchingCep}
          placeholder="Apto, Bloco, Casa, etc."
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <AddressField
            id="neighborhood"
            label="Bairro"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            error={formErrors.neighborhood}
            disabled={isSearchingCep}
            placeholder="Seu bairro"
          />
        </div>
        <div className="sm:col-span-1">
          <AddressField
            id="city"
            label="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={formErrors.city}
            disabled={isSearchingCep}
            placeholder="Sua cidade"
          />
        </div>
        <div className="sm:col-span-1">
          <AddressField
            id="state"
            label="Estado"
            value={state}
            onChange={(e) => setState(e.target.value)}
            error={formErrors.state}
            disabled={isSearchingCep}
            placeholder="UF"
          />
        </div>
      </div>
    </>
  );
};

export default AddressFields;
