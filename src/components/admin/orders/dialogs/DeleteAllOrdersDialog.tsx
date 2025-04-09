
import React from 'react';
import { PaymentMethod } from '@/types/order';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteAllOrdersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  paymentMethod: PaymentMethod | null;
}

const DeleteAllOrdersDialog: React.FC<DeleteAllOrdersDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  paymentMethod
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir todos os pedidos 
            {paymentMethod === 'PIX' ? ' via PIX' : ' via Cartão de Crédito'}?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir Todos
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllOrdersDialog;
