
export interface ValidationErrors {
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

export const validateCardForm = (
  cardName: string,
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): ValidationErrors | null => {
  const errors: ValidationErrors = {};
  
  if (!cardName.trim()) {
    errors.cardName = 'Nome no cartão é obrigatório';
  }
  
  if (cardNumber.replace(/\s+/g, '').length < 16) {
    errors.cardNumber = 'Número do cartão inválido';
  }
  
  if (!expiryMonth) {
    errors.expiryMonth = 'Mês de validade é obrigatório';
  }
  
  if (!expiryYear) {
    errors.expiryYear = 'Ano de validade é obrigatório';
  }
  
  if (cvv.length < 3) {
    errors.cvv = 'CVV inválido';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};
