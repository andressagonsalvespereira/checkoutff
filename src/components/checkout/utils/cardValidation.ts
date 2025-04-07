
import { z } from 'zod';

// Utility function to get current month and year
const getCurrentDate = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
    year: now.getFullYear() % 100 // Get last two digits of year
  };
};

// Card validation schema with Zod
export const CardSchema = z.object({
  cardName: z.string().min(3, 'Nome no cartão precisa ter pelo menos 3 caracteres'),
  
  // Card number should be between 13-19 digits, we'll strip spaces for validation
  cardNumber: z.string()
    .min(13, 'Número do cartão inválido')
    .refine((val) => /^[\d\s]{13,19}$/.test(val), 'Número do cartão inválido'),
  
  // Month: 01-12
  expiryMonth: z.string()
    .refine((val) => /^(0[1-9]|1[0-2])$/.test(val), 'Mês inválido'),
  
  // Year: current year or later, two digits
  expiryYear: z.string()
    .refine((val) => /^\d{2}$/.test(val), 'Ano inválido')
    .refine(
      (val) => {
        const currentYear = getCurrentDate().year;
        const inputYear = parseInt(val, 10);
        return inputYear >= currentYear;
      }, 
      'O cartão está expirado'
    ),
  
  // CVV: 3-4 digits
  cvv: z.string()
    .refine((val) => /^\d{3,4}$/.test(val), 'CVV inválido')
});

// Refine to check if the card is not expired
export const validateCardExpiry = (month: string, year: string) => {
  const currentDate = getCurrentDate();
  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);
  
  // If the expiry year is greater than current year, the card is not expired
  if (expYear > currentDate.year) {
    return true;
  }
  
  // If the expiry year is the current year, check if the month is current or future
  if (expYear === currentDate.year && expMonth >= currentDate.month) {
    return true;
  }
  
  return false;
};

// Update the schema refinement to use the extracted function
CardSchema.refine(
  (data) => validateCardExpiry(data.expiryMonth, data.expiryYear),
  {
    message: "O cartão está expirado",
    path: ["expiryYear"] // This will show the error on the year field
  }
);

// Function to format card number with spaces
export const formatCardNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format with space every 4 digits
  let formatted = '';
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += ' ';
    }
    formatted += digits[i];
  }
  
  return formatted;
};

// Validate all card fields at once and return errors if any
export const validateCardForm = (
  cardName: string,
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
) => {
  try {
    CardSchema.parse({
      cardName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv
    });
    return null; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error format to a simpler object
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
      return errors;
    }
    
    return { general: 'Erro desconhecido na validação do cartão' };
  }
};

