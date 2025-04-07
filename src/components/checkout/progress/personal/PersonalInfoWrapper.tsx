
import React from 'react';
import PersonalInfoSection from '@/components/checkout/PersonalInfoSection';

interface PersonalInfoWrapperProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  cpf: string;
  setCpf: (cpf: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  formErrors: Record<string, string>;
}

const PersonalInfoWrapper: React.FC<PersonalInfoWrapperProps> = (props) => {
  return <PersonalInfoSection {...props} />;
};

export default PersonalInfoWrapper;
