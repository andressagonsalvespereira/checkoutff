
import React from 'react';
import { Control } from 'react-hook-form';
import ColorPickerField from './ColorPickerField';
import { FormValues } from './types';

interface FormColorFieldsProps {
  control: Control<FormValues>;
}

const FormColorFields: React.FC<FormColorFieldsProps> = ({ control }) => {
  return (
    <>
      <ColorPickerField
        name="button_color"
        control={control}
        label="Cor do Botão"
        description="Selecione a cor dos botões de ação no checkout"
      />
      
      <ColorPickerField
        name="button_text_color"
        control={control}
        label="Cor do Texto do Botão"
        description="Selecione a cor do texto dos botões"
      />
      
      <ColorPickerField
        name="heading_color"
        control={control}
        label="Cor dos Títulos"
        description="Selecione a cor dos títulos no checkout"
      />
    </>
  );
};

export default FormColorFields;
