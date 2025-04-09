// src/components/checkout/CheckoutProgressContainer.tsx

import React from 'react';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useAsaas } from '@/contexts/AsaasContext';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';
import PersonalInfoWrapper from './personal/PersonalInfoWrapper';
import AddressSectionWrapper from './address/AddressSectionWrapper';
import PaymentMethodWrapper from './payment/PaymentMethodWrapper';
import OrderSummaryWrapper from './order/OrderSummaryWrapper';
import { useCheckoutOrder } from '@/hooks/payment/order/useCheckoutContainerOrder';

interface CheckoutProgressContainerProps {
  paymentMethod: 'card' | 'pix';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'pix'>>;
  productDetails: ProductDetailsType;
  handlePayment: (paymentData: any) => void;
  isProcessing: boolean;
}

const CheckoutProgressContainer: React.FC<CheckoutProgressContainerProps> = ({
  paymentMethod,
  setPaymentMethod,
  productDetails,
  handlePayment,
  isProcessing
}) => {
  const {
    formState,
    isSearchingCep,
    setFullName,
    setEmail,
    setCpf,
    setPhone,
    setCep,
    setStreet,
    setNumber,
    setComplement,
    setNeighborhood,
    setCity,
    setState,
    setSelectedShipping,
    handleCepChange,
  } = useCheckoutForm();
  
  const { settings } = useAsaas();

  const handleOrderCreated = (paymentData: any) => {
    console.log("Ordem criada com sucesso, chamando handlePayment com dados:", paymentData);
    
    const paymentInfo = {
      ...paymentData,
      customerData: {
        name: formState.fullName,
        email: formState.email,
        cpf: formState.cpf,
        phone: formState.phone,
        address: formState.street ? {
          street: formState.street,
          number: formState.number,
          complement: formState.complement,
          neighborhood: formState.neighborhood,
          city: formState.city,
          state: formState.state,
          postalCode: formState.cep.replace(/\D/g, '')
        } : undefined
      },
    };
    
    handlePayment(paymentInfo);
  };

  const { createOrder, isProcessing: isProcessingOrder } = useCheckoutOrder({
    formState,
    productDetails,
    handlePayment: handleOrderCreated
  });
  
  const customerData = {
    name: formState.fullName,
    email: formState.email,
    cpf: formState.cpf,
    phone: formState.phone,
    address: formState.street ? {
      street: formState.street,
      number: formState.number,
      complement: formState.complement,
      neighborhood: formState.neighborhood,
      city: formState.city,
      state: formState.state,
      postalCode: formState.cep.replace(/\D/g, '')
    } : undefined
  };

  React.useEffect(() => {
    if (settings) {
      if (paymentMethod === 'card' && !settings.allowCreditCard) {
        if (settings.allowPix) {
          setPaymentMethod('pix');
        }
      } else if (paymentMethod === 'pix' && !settings.allowPix) {
        if (settings.allowCreditCard) {
          setPaymentMethod('card');
        }
      }
    }
  }, [settings, paymentMethod, setPaymentMethod]);

  const combinedProcessing = isProcessing || isProcessingOrder;

  return (
    <>
      <PersonalInfoWrapper 
        fullName={formState.fullName} 
        setFullName={setFullName}
        email={formState.email}
        setEmail={setEmail}
        cpf={formState.cpf}
        setCpf={setCpf}
        phone={formState.phone}
        setPhone={setPhone}
        formErrors={formState.formErrors}
      />
      
      <AddressSectionWrapper 
        cep={formState.cep}
        handleCepChange={handleCepChange}
        street={formState.street}
        setStreet={setStreet}
        number={formState.number}
        setNumber={setNumber}
        complement={formState.complement}
        setComplement={setComplement}
        neighborhood={formState.neighborhood}
        setNeighborhood={setNeighborhood}
        city={formState.city}
        setCity={setCity}
        state={formState.state}
        setState={setState}
        formErrors={formState.formErrors}
        isSearchingCep={isSearchingCep}
        isDigitalProduct={productDetails.isDigital}
        selectedShipping={formState.selectedShipping}
        setSelectedShipping={setSelectedShipping}
        deliveryEstimate={formState.deliveryEstimate}
      />
      
      <PaymentMethodWrapper 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        createOrder={createOrder}
        productDetails={productDetails}
        customerData={customerData}
        isProcessing={combinedProcessing}
      />
      
      <OrderSummaryWrapper 
        productDetails={productDetails}
      />
    </>
  );
};

export default CheckoutProgressContainer;
