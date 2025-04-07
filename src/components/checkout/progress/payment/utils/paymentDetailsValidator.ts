
import { CardDetails, PixDetails } from '@/types/order';

/**
 * Validates card details
 * @param cardDetails Card details to validate
 * @returns Object with validation status and error message
 */
export const validateCardDetails = (cardDetails?: CardDetails): { isValid: boolean; errorMessage?: string } => {
  if (!cardDetails) {
    return { isValid: false, errorMessage: 'Detalhes do cartão não fornecidos' };
  }

  if (!cardDetails.number || cardDetails.number.trim().length < 13) {
    return { isValid: false, errorMessage: 'Número do cartão inválido' };
  }

  if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
    return { isValid: false, errorMessage: 'Data de validade do cartão inválida' };
  }

  if (!cardDetails.cvv || cardDetails.cvv.trim().length < 3) {
    return { isValid: false, errorMessage: 'Código de segurança inválido' };
  }

  return { isValid: true };
};

/**
 * Validates PIX details
 * @param pixDetails PIX details to validate
 * @returns Object with validation status and error message
 */
export const validatePixDetails = (pixDetails?: PixDetails): { isValid: boolean; errorMessage?: string } => {
  if (!pixDetails) {
    return { isValid: false, errorMessage: 'Detalhes do PIX não fornecidos' };
  }

  if (!pixDetails.qrCode && !pixDetails.qrCodeImage) {
    return { isValid: false, errorMessage: 'QR Code PIX não fornecido' };
  }

  return { isValid: true };
};
