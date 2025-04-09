
import React from 'react';
import AddressFinder from './address/AddressFinder';
import AddressFormFields from './address/AddressFormFields';
import AddressShippingOptions from './AddressShippingOptions';
import AddressFormHeader from './address/AddressFormHeader';
import AddressFormActions from './address/AddressFormActions';
import { useAddressForm, AddressData } from '@/hooks/useAddressForm';

interface AddressFormProps {
  onSubmit: (data: AddressData) => void;
  isCompleted: boolean;
}

const AddressForm = ({ onSubmit, isCompleted }: AddressFormProps) => {
  const {
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    errors,
    isLoading,
    selectedShipping,
    deliveryEstimate,
    hasValidAddress,
    handleCepChange,
    setStreet,
    handleNumberChange,
    setComplement,
    setNeighborhood,
    setCity,
    setState,
    selectShippingOption,
    handleContinue
  } = useAddressForm({ onSubmit });

  return (
    <div className={`transition-all duration-300 ${isCompleted ? 'opacity-70' : ''}`}>
      <AddressFormHeader isCompleted={isCompleted} />
      
      <div className="p-4 bg-white rounded-md mb-6 space-y-4">
        <AddressFinder 
          cep={cep} 
          onChange={handleCepChange} 
          error={errors.cep} 
          isLoading={isLoading}
          disabled={isCompleted}
        />
        
        <AddressFormFields 
          street={street}
          setStreet={setStreet}
          number={number}
          setNumber={handleNumberChange}
          complement={complement}
          setComplement={setComplement}
          neighborhood={neighborhood}
          setNeighborhood={setNeighborhood}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          errors={errors}
          disabled={isCompleted}
        />
        
        {/* Only show shipping options when we have a valid address */}
        {hasValidAddress && selectedShipping && (
          <AddressShippingOptions
            selectedShipping={selectedShipping}
            onSelectShipping={selectShippingOption}
            deliveryEstimate={deliveryEstimate}
          />
        )}
        
        <AddressFormActions 
          isCompleted={isCompleted} 
          onContinue={handleContinue} 
        />
      </div>
    </div>
  );
};

export default AddressForm;
