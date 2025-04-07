
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CriarProdutoInput } from '@/types/product';
import ProductFormFields from './ProductFormFields';

interface AddProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: CriarProdutoInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleUseCustomProcessingChange?: (checked: boolean) => void;
  handleManualCardStatusChange?: (value: string) => void;
  handleAddProduct: () => void;
}

const AddProductDialog = ({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleSwitchChange,
  handleUseCustomProcessingChange,
  handleManualCardStatusChange,
  handleAddProduct
}: AddProductDialogProps) => {
  const addDescriptionId = "add-product-description";
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent 
        aria-describedby={addDescriptionId} 
        aria-labelledby="add-product-title"
      >
        <DialogHeader>
          <DialogTitle id="add-product-title">Adicionar Novo Produto</DialogTitle>
          <DialogDescription id={addDescriptionId}>
            Preencha os detalhes do novo produto que você deseja adicionar ao seu catálogo.
          </DialogDescription>
        </DialogHeader>
        <ProductFormFields 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSwitchChange={handleSwitchChange}
          handleUseCustomProcessingChange={handleUseCustomProcessingChange}
          handleManualCardStatusChange={handleManualCardStatusChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddProduct}>
            Adicionar Produto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
