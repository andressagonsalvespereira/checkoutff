
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Control } from 'react-hook-form';
import { FormValues } from './types';

interface FormBasicFieldsProps {
  control: Control<FormValues>;
}

const FormBasicFields: React.FC<FormBasicFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="header_message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem do Cabeçalho</FormLabel>
            <FormControl>
              <Input placeholder="Digite a mensagem do cabeçalho" {...field} />
            </FormControl>
            <FormDescription>
              Esta mensagem será exibida no topo da página de checkout.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="button_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto dos Botões</FormLabel>
            <FormControl>
              <Input placeholder="Digite o texto para os botões" {...field} />
            </FormControl>
            <FormDescription>
              Este texto será exibido nos botões de finalização de compra.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="show_banner"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Exibir Banner</FormLabel>
              <FormDescription>
                Ative para exibir o banner no topo do checkout
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default FormBasicFields;
