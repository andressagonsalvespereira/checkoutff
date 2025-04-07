import { useState, useEffect } from 'react';
import { CheckoutFormState } from './checkout/types';
import { formatCPF, formatPhone, formatCEP } from './checkout/formatters';
import { validateCheckoutForm } from './checkout/validator';
import { useCepLookup } from './checkout/useCepLookup';
import { useAsaas } from '@/contexts/AsaasContext';

export function useCheckoutForm() {
  const { settings } = useAsaas();

  const [formState, setFormState] = useState<CheckoutFormState>({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    formErrors: {},
    selectedShipping: null,
    deliveryEstimate: null,
    useCustomProcessing: false,
    manualCardStatus: undefined
  });

  // Carrega configurações manuais do painel admin
  useEffect(() => {
    if (settings?.manualCardProcessing) {
      setFormState(prev => ({
        ...prev,
        useCustomProcessing: true,
        manualCardStatus: settings.manualCardStatus || undefined
      }));
    }
  }, [settings]);

  // Field setters
  const setFullName = (value: string) =>
    setFormState(prev => ({ ...prev, fullName: value }));

  const setEmail = (value: string) =>
    setFormState(prev => ({ ...prev, email: value }));

  const setCpf = (value: string) =>
    setFormState(prev => ({ ...prev, cpf: formatCPF(value) }));

  const setPhone = (value: string) =>
    setFormState(prev => ({ ...prev, phone: formatPhone(value) }));

  const setCep = (value: string) =>
    setFormState(prev => ({ ...prev, cep: formatCEP(value) }));

  const setStreet = (value: string) =>
    setFormState(prev => ({ ...prev, street: value }));

  const setNumber = (value: string) =>
    setFormState(prev => ({ ...prev, number: value }));

  const setComplement = (value: string) =>
    setFormState(prev => ({ ...prev, complement: value }));

  const setNeighborhood = (value: string) =>
    setFormState(prev => ({ ...prev, neighborhood: value }));

  const setCity = (value: string) =>
    setFormState(prev => ({ ...prev, city: value }));

  const setState = (value: string) =>
    setFormState(prev => ({ ...prev, state: value }));

  const setFormErrors = (errors: Record<string, string>) =>
    setFormState(prev => ({ ...prev, formErrors: errors }));

  const setSelectedShipping = (value: string | null) =>
    setFormState(prev => ({ ...prev, selectedShipping: value }));

  const setDeliveryEstimate = (value: string | null) =>
    setFormState(prev => ({ ...prev, deliveryEstimate: value }));

  const setUseCustomProcessing = (value: boolean) =>
    setFormState(prev => ({ ...prev, useCustomProcessing: value }));

  const setManualCardStatus = (value: string | undefined) =>
    setFormState(prev => ({ ...prev, manualCardStatus: value }));

  // CEP hook
  const { isSearchingCep, handleCepChange } = useCepLookup({
    formState,
    setFormState,
    setFormErrors
  });

  const validateForm = () => {
    const errors = validateCheckoutForm(formState);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
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
    setDeliveryEstimate,
    setUseCustomProcessing,
    setManualCardStatus,
    handleCepChange,
    validateForm
  };
}
