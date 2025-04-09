
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';

interface ColorPickerFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  description?: string;
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  name,
  control,
  label,
  description
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center space-x-4">
            <FormControl>
              <input
                type="color"
                {...field}
                className="w-12 h-10 p-1 border rounded cursor-pointer"
              />
            </FormControl>
            <div className="flex-1">
              <input
                type="text"
                value={field.value}
                onChange={field.onChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ColorPickerField;
