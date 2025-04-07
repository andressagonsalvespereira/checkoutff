
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
};

export const formatFullDate = (dateString: string) => {
  return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};
