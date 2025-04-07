
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface ProductTableActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTableActions = ({ product, onEdit, onDelete }: ProductTableActionsProps) => {
  const { toast } = useToast();
  
  const copyCheckoutLink = (productSlug: string) => {
    console.log('Copying checkout link for slug:', productSlug);
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${productSlug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        toast({
          title: "Link copiado",
          description: "Link de checkout copiado para a área de transferência",
        });
      })
      .catch(err => {
        console.error('Error copying link:', err);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        });
      });
  };

  const openCheckoutLink = (productSlug: string) => {
    console.log('Opening checkout link for slug:', productSlug);
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${productSlug}`;
    window.open(checkoutUrl, '_blank');
  };
  
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyCheckoutLink(product.slug)}
        title="Copiar link de checkout"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openCheckoutLink(product.slug)}
        title="Abrir checkout"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => onEdit(product)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Edit className="h-4 w-4 mr-1" />
        Editar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(product)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
};

export default ProductTableActions;
