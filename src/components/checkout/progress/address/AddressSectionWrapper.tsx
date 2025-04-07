
import React from 'react';
import AddressSection from '@/components/checkout/AddressSection';
import { ChangeEvent } from 'react';

interface AddressSectionWrapperProps {
  cep: string;
  handleCepChange: (e: ChangeEvent<HTMLInputElement>) => void;
  street: string;
  setStreet: (street: string) => void;
  number: string;
  setNumber: (number: string) => void;
  complement: string;
  setComplement: (complement: string) => void;
  neighborhood: string;
  setNeighborhood: (neighborhood: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  formErrors: Record<string, string>;
  isSearchingCep: boolean;
  isDigitalProduct: boolean;
  selectedShipping: string;
  setSelectedShipping: (shipping: string) => void;
  deliveryEstimate: string;
}

const AddressSectionWrapper: React.FC<AddressSectionWrapperProps> = (props) => {
  return <AddressSection {...props} />;
};

export default AddressSectionWrapper;
