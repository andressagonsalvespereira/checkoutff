
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCEP } from './formatters';
import { CheckoutFormState } from './types';

interface UseCepLookupProps {
  formState: CheckoutFormState;
  setFormState: React.Dispatch<React.SetStateAction<CheckoutFormState>>;
  setFormErrors: (errors: Record<string, string>) => void;
}

export function useCepLookup({ formState, setFormState, setFormErrors }: UseCepLookupProps) {
  const { toast } = useToast();
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  /**
   * Handles CEP input change and fetches address data
   */
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCEP(e.target.value);
    
    // Update the CEP in the form state
    setFormState(prev => ({ ...prev, cep: formattedCep }));
    
    // Reset shipping options if CEP is cleared or modified
    if (formattedCep.length < 9) {
      setFormState(prev => ({ 
        ...prev, 
        selectedShipping: null, 
        deliveryEstimate: null 
      }));
    }
    
    if (formattedCep.replace(/\D/g, '').length === 8) {
      setIsSearchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${formattedCep.replace(/\D/g, '')}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          // Update address fields with API response
          setFormState(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
            // Shipping options will be set when the user completes their address
          }));
          
          // Clear previous errors for these fields
          const newErrors = {...formState.formErrors};
          delete newErrors.cep;
          delete newErrors.street;
          delete newErrors.neighborhood;
          delete newErrors.city;
          delete newErrors.state;
          setFormErrors(newErrors);
          
          toast({
            title: "CEP encontrado",
            description: "Endereço preenchido automaticamente",
            duration: 3000,
          });
          
          // If the API returned a complete address, we can set shipping options
          if (data.logradouro && data.bairro && data.localidade && data.uf) {
            // Calculate estimated delivery date
            const today = new Date();
            const deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + 7); // Average of 7 days
            
            const formattedDate = deliveryDate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            
            // Only set shipping options if address is complete
            setFormState(prev => ({
              ...prev,
              selectedShipping: 'free',
              deliveryEstimate: `Chegará em ${formattedDate}`
            }));
          }
          
        } else {
          setFormErrors({ ...formState.formErrors, cep: 'CEP não encontrado' });
          setFormState(prev => ({ 
            ...prev, 
            selectedShipping: null, 
            deliveryEstimate: null 
          }));
          
          toast({
            title: "CEP não encontrado",
            description: "Por favor, verifique o CEP informado ou preencha o endereço manualmente",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setFormErrors({ ...formState.formErrors, cep: 'Erro ao buscar CEP' });
        setFormState(prev => ({ 
          ...prev, 
          selectedShipping: null, 
          deliveryEstimate: null 
        }));
        
        toast({
          title: "Erro ao buscar CEP",
          description: "Houve um problema ao consultar o CEP. Por favor, preencha o endereço manualmente",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  return {
    isSearchingCep,
    handleCepChange
  };
}
