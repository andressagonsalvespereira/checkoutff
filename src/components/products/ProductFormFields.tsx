
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CriarProdutoInput } from '@/types/product';

interface ProductFormFieldsProps {
  formData: CriarProdutoInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleUseCustomProcessingChange?: (checked: boolean) => void;
  handleManualCardStatusChange?: (value: string) => void;
}

const ProductFormFields = ({ 
  formData, 
  handleInputChange, 
  handleSwitchChange,
  handleUseCustomProcessingChange,
  handleManualCardStatusChange
}: ProductFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nome" className="text-right">Nome*</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preco" className="text-right">Preço (R$)*</Label>
        <Input
          id="preco"
          name="preco"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.preco || ''}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="descricao" className="text-right">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          value={formData.descricao || ''}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="urlImagem" className="text-right">URL da Imagem</Label>
        <Input
          id="urlImagem"
          name="urlImagem"
          value={formData.urlImagem || ''}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="digital" className="text-right">Produto Digital</Label>
        <div className="flex items-center space-x-2 col-span-3">
          <Switch
            id="digital"
            checked={formData.digital}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="digital" className="cursor-pointer">
            {formData.digital ? "Produto Digital" : "Produto Físico"}
          </Label>
        </div>
      </div>
      
      {/* Seção de configuração de processamento de pagamento específica */}
      <div className="border-t mt-4 pt-4">
        <h3 className="font-medium mb-2">Configurações de Processamento de Pagamento</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="usarProcessamentoPersonalizado" className="text-right">Processamento de Pagamento Personalizado</Label>
          <div className="flex items-center space-x-2 col-span-3">
            <Switch
              id="usarProcessamentoPersonalizado"
              checked={formData.usarProcessamentoPersonalizado || false}
              onCheckedChange={handleUseCustomProcessingChange}
            />
            <Label htmlFor="usarProcessamentoPersonalizado" className="cursor-pointer">
              {formData.usarProcessamentoPersonalizado ? "Usar configurações personalizadas" : "Usar configurações globais"}
            </Label>
          </div>
        </div>
        
        {formData.usarProcessamentoPersonalizado && (
          <div className="grid grid-cols-4 items-center gap-4 mt-2">
            <Label htmlFor="statusCartaoManual" className="text-right">Status do Pagamento com Cartão</Label>
            <div className="col-span-3">
              <Select 
                value={formData.statusCartaoManual || 'ANALISE'} 
                onValueChange={handleManualCardStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APROVADO">Auto-aprovado</SelectItem>
                  <SelectItem value="NEGADO">Auto-recusado</SelectItem>
                  <SelectItem value="ANALISE">Análise manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormFields;
