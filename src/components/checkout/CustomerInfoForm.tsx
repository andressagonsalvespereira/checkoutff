
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleAlert } from 'lucide-react';

interface CustomerInfoFormProps {
  onSubmit: (data: CustomerData) => void;
  isCompleted: boolean;
}

export interface CustomerData {
  fullName: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

const CustomerInfoForm = ({ onSubmit, isCompleted }: CustomerInfoFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCPFCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      // CPF format: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14);
    } else {
      // CNPJ format: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
        .substring(0, 18);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!cpfCnpj.trim()) {
      newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    } else {
      const digits = cpfCnpj.replace(/\D/g, '');
      if (digits.length !== 11 && digits.length !== 14) {
        newErrors.cpfCnpj = 'CPF/CNPJ inválido';
      }
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Celular é obrigatório';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        newErrors.phone = 'Celular inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateFields()) {
      onSubmit({
        fullName,
        email,
        cpfCnpj,
        phone
      });
    }
  };

  return (
    <div className={`transition-all duration-300 ${isCompleted ? 'opacity-70' : ''}`}>
      <div className="bg-black text-white p-3 mb-4 flex items-center">
        <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-red-600 text-white mr-2">
          1
        </span>
        <h2 className="font-medium text-lg">Informações Pessoais</h2>
      </div>
      
      <div className="p-4 bg-white rounded-md mb-6 space-y-4">
        <div>
          <Label htmlFor="fullName" className="mb-2 block">Nome completo</Label>
          <Input 
            id="fullName" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`border ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Digite seu nome completo"
            disabled={isCompleted}
          />
          {errors.fullName && (
            <div className="text-red-500 text-xs mt-1 flex items-center">
              <CircleAlert className="h-3 w-3 mr-1" />
              {errors.fullName}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="email" className="mb-2 block">E-mail</Label>
          <Input 
            id="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Digite seu e-mail"
            disabled={isCompleted}
          />
          {errors.email && (
            <div className="text-red-500 text-xs mt-1 flex items-center">
              <CircleAlert className="h-3 w-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="cpfCnpj" className="mb-2 block">CPF/CNPJ</Label>
          <Input 
            id="cpfCnpj" 
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(formatCPFCNPJ(e.target.value))}
            className={`border ${errors.cpfCnpj ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Digite seu CPF ou CNPJ"
            disabled={isCompleted}
          />
          {errors.cpfCnpj && (
            <div className="text-red-500 text-xs mt-1 flex items-center">
              <CircleAlert className="h-3 w-3 mr-1" />
              {errors.cpfCnpj}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone" className="mb-2 block">Celular</Label>
          <Input 
            id="phone" 
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="(00) 00000-0000"
            disabled={isCompleted}
          />
          {errors.phone && (
            <div className="text-red-500 text-xs mt-1 flex items-center">
              <CircleAlert className="h-3 w-3 mr-1" />
              {errors.phone}
            </div>
          )}
        </div>
        
        {!isCompleted && (
          <button 
            onClick={handleContinue}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoForm;
