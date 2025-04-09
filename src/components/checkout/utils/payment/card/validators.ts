
import { CardFormData } from '../../../payment-methods/CardForm';
import { validateCardForm } from '../../cardValidation';

/**
 * Validates card data and returns validation errors if any
 */
export const validateCardData = (cardData: CardFormData) => {
  return validateCardForm(
    cardData.cardName,
    cardData.cardNumber,
    cardData.expiryMonth,
    cardData.expiryYear,
    cardData.cvv
  );
};
