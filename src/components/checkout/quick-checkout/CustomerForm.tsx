
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerInfo } from '@/types/order';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CustomerFormProps {
  customerDetails: CustomerInfo;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  onSubmit: (data: CustomerInfo) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  customerDetails, 
  setCustomerDetails, 
  onSubmit 
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCustomerData = () => {
    if (!customerDetails.name || customerDetails.name.trim().length < 3) {
      return "Nome completo é obrigatório (mínimo 3 caracteres)";
    }
    
    if (!customerDetails.email || !customerDetails.email.includes('@')) {
      return "E-mail inválido";
    }
    
    const cpf = customerDetails.cpf ? customerDetails.cpf.replace(/\D/g, '') : '';
    if (!cpf || cpf.length !== 11) {
      return "CPF inválido";
    }
    
    const phone = customerDetails.phone ? customerDetails.phone.replace(/\D/g, '') : '';
    if (!phone || phone.length < 10) {
      return "Telefone inválido";
    }
    
    return null;
  };

  const handleSubmit = () => {
    const error = validateCustomerData();
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError(null);
    onSubmit(customerDetails);
  };

  // Function to format CPF
  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  };

  // Function to format phone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Informações do Cliente</h3>
      
      {validationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {validationError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Nome completo"
          value={customerDetails.name}
          onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="E-mail"
          type="email"
          value={customerDetails.email}
          onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="CPF"
          value={customerDetails.cpf}
          onChange={(e) => setCustomerDetails({...customerDetails, cpf: formatCpf(e.target.value)})}
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Telefone"
          value={customerDetails.phone}
          onChange={(e) => setCustomerDetails({...customerDetails, phone: formatPhone(e.target.value)})}
        />
        <Button 
          onClick={handleSubmit}
          disabled={!customerDetails.name || !customerDetails.email || !customerDetails.cpf}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Continuar para Pagamento
        </Button>
      </div>
    </div>
  );
};

export default CustomerForm;
