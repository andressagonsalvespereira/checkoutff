
import React from 'react';
import { Button } from '@/components/ui/button';

interface AddressFormActionsProps {
  isCompleted: boolean;
  onContinue: () => void;
}

const AddressFormActions: React.FC<AddressFormActionsProps> = ({ isCompleted, onContinue }) => {
  if (isCompleted) {
    return null;
  }
  
  return (
    <Button 
      onClick={onContinue}
      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
    >
      Continuar
    </Button>
  );
};

export default AddressFormActions;
