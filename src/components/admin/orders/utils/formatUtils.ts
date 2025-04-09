
import { format } from 'date-fns';

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
