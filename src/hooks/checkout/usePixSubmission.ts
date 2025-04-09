
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CustomerData {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
}

interface ProductData {
  productId?: string;
  productName?: string;
  productPrice?: number;
}

interface UsePixSubmissionProps {
  customerData?: CustomerData;
  productData?: ProductData;
  onSubmit: () => void;
}

export const usePixSubmission = ({
  customerData,
  productData,
  onSubmit
}: UsePixSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [wasClicked, setWasClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Use a ref to prevent parallel processing
  const isSubmittingRef = useRef(false);

  const validateCustomerData = () => {
    if (!customerData) {
      console.error("PIX: customerData is null or undefined");
      return "Informações do cliente não fornecidas";
    }
    
    if (!customerData.name || customerData.name.trim().length < 3) {
      console.error("PIX validation failed: Invalid name", customerData.name);
      return "Nome completo é obrigatório (mínimo 3 caracteres)";
    }
    
    if (!customerData.email || !customerData.email.includes('@')) {
      console.error("PIX validation failed: Invalid email", customerData.email);
      return "E-mail inválido";
    }
    
    const cpf = customerData.cpf ? customerData.cpf.replace(/\D/g, '') : '';
    if (!cpf || cpf.length !== 11) {
      console.error("PIX validation failed: Invalid CPF", customerData.cpf);
      return "CPF inválido";
    }
    
    const phone = customerData.phone ? customerData.phone.replace(/\D/g, '') : '';
    if (!phone || phone.length < 10) {
      console.error("PIX validation failed: Invalid phone", customerData.phone);
      return "Telefone inválido";
    }
    
    console.log("PIX: Customer data validation passed", {
      name: customerData.name,
      email: customerData.email,
      cpf: cpf.substring(0, 3) + '...',
      phone: phone.substring(0, 3) + '...'
    });
    
    return null;
  };

  const handlePixSubmit = () => {
    // Prevent parallel processing and multiple clicks
    if (isProcessing || wasClicked || isSubmittingRef.current) {
      console.log("PIX button already clicked or processing in progress, ignoring click");
      return;
    }
    
    // Set both state and ref to track submission
    setWasClicked(true);
    setIsProcessing(true);
    isSubmittingRef.current = true;
    
    console.log("PIX button clicked, validating customer data:", {
      customerName: customerData?.name,
      customerEmail: customerData?.email,
      productName: productData?.productName,
      productPrice: productData?.productPrice
    });
    
    const error = validateCustomerData();
    if (error) {
      setValidationError(error);
      toast({
        title: "Erro de validação",
        description: error,
        variant: "destructive",
      });
      
      // Reset submission flags after error
      setTimeout(() => {
        setWasClicked(false);
        setIsProcessing(false);
        isSubmittingRef.current = false;
      }, 2000);
      return;
    }
    
    setValidationError(null);
    console.log("PIX: Data validated, initiating order processing");
    
    try {
      // First register the order
      console.log("PIX: Calling onSubmit to register order");
      onSubmit();
      
      // Then redirect to the PIX payment screen
      setTimeout(() => {
        console.log("PIX: Redirecting to PIX payment page with:", {
          productId: productData?.productId,
          productName: productData?.productName,
          customerName: customerData?.name
        });
        
        navigate('/pix-payment-manual', { 
          state: { 
            orderData: {
              productId: productData?.productId,
              productName: productData?.productName,
              productPrice: productData?.productPrice,
              paymentMethod: 'PIX'
            },
            customerData
          } 
        });
      }, 500);
    } catch (error) {
      console.error("PIX: Error processing payment:", error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pagamento PIX. Tente novamente.",
        variant: "destructive",
      });
      
      // Reset submission flags after error
      setTimeout(() => {
        setWasClicked(false);
        setIsProcessing(false);
        isSubmittingRef.current = false;
      }, 2000);
    }
  };

  return {
    validationError,
    wasClicked,
    isProcessing,
    handlePixSubmit
  };
};
