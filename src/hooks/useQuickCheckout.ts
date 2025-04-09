
import { useProductLoader } from './checkout/useProductLoader';
import { useCustomerInfo } from './checkout/useCustomerInfo';
import { usePaymentProcessing } from './payment/usePaymentProcessing';
import { Product } from '@/types/product';

export const useQuickCheckout = (productId: string | undefined, preloadedProduct?: Product | null) => {
  // Carrega informações do produto
  const { product, loading } = useProductLoader(productId, preloadedProduct);
  
  // Gerencia informações do cliente
  const { customerDetails, setCustomerDetails, handleSubmitCustomerInfo } = useCustomerInfo();
  
  // Gerencia processamento do pagamento
  const { 
    paymentMethod, 
    setPaymentMethod, 
    isOrderSubmitted, 
    handlePaymentSubmit 
  } = usePaymentProcessing(product, customerDetails);

  return {
    product,
    loading,
    paymentMethod,
    setPaymentMethod,
    customerDetails,
    setCustomerDetails,
    isOrderSubmitted,
    handleSubmitCustomerInfo,
    handlePaymentSubmit
  };
};
