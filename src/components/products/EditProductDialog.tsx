
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { CriarProdutoInput } from '@/types/product';
import ProductFormFields from './ProductFormFields';

interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: CriarProdutoInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleUseCustomProcessingChange?: (checked: boolean) => void;
  handleManualCardStatusChange?: (value: string) => void;
  handleUpdateProduct: () => void;
}

const EditProductDialog = ({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleSwitchChange,
  handleUseCustomProcessingChange,
  handleManualCardStatusChange,
  handleUpdateProduct
}: EditProductDialogProps) => {
  const editDescriptionId = "edit-product-description";
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        aria-describedby={editDescriptionId}
        aria-labelledby="edit-product-title"
      >
        <DialogHeader>
          <DialogTitle id="edit-product-title">Editar Produto</DialogTitle>
          <DialogDescription id={editDescriptionId}>
            Atualize os detalhes do produto existente em seu catálogo.
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
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleUpdateProduct}
          >
            Atualizar Produto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
