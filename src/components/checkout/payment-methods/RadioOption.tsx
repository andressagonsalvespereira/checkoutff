
import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface RadioOptionProps {
  id: string;
  value: string;
  label: string;
  Icon: LucideIcon;
  iconColor: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({ id, value, label, Icon, iconColor }) => {
  return (
    <div className="flex-1 flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 cursor-pointer">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex items-center cursor-pointer">
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        <span>{label}</span>
      </Label>
    </div>
  );
};

export default RadioOption;
