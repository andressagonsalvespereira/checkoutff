
import { useState } from 'react';
import { CustomerInfo } from '@/types/order';

const initialCustomerInfo: CustomerInfo = {
  name: '',
  email: '',
  cpf: '',
  phone: ''
};

export const useCustomerInfo = () => {
  const [customerDetails, setCustomerDetails] = useState<CustomerInfo>(initialCustomerInfo);
  
  const handleSubmitCustomerInfo = (customerData: CustomerInfo) => {
    console.log('useCustomerInfo - Customer info submitted:', customerData);
    setCustomerDetails(customerData);
  };
  
  return {
    customerDetails,
    setCustomerDetails,
    handleSubmitCustomerInfo
  };
};
