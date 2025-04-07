
import { z } from 'zod';

/**
 * Card validation schema using zod
 */
export const CardSchema = z.object({
  cardName: z
    .string()
    .min(3, { message: 'Name must have at least 3 characters' })
    .max(100, { message: 'Name too long' }),
  
  cardNumber: z
    .string()
    .min(13, { message: 'Invalid card number' })
    .max(19, { message: 'Invalid card number' })
    .refine(val => /^[0-9\s]+$/.test(val), {
      message: 'Card number must contain only digits'
    }),
  
  expiryMonth: z
    .string()
    .min(1, { message: 'Required' })
    .max(2, { message: 'Invalid' })
    .refine(val => {
      const month = parseInt(val);
      return month >= 1 && month <= 12;
    }, {
      message: 'Month must be between 1 and 12'
    }),
  
  expiryYear: z
    .string()
    .min(2, { message: 'Required' })
    .max(4, { message: 'Invalid' })
    .refine(val => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= (currentYear % 100) && year <= (currentYear % 100) + 20;
    }, {
      message: 'Invalid expiration year'
    }),
  
  cvv: z
    .string()
    .min(3, { message: 'Invalid CVV' })
    .max(4, { message: 'Invalid CVV' })
    .refine(val => /^[0-9]+$/.test(val), {
      message: 'CVV must contain only digits'
    }),
});

export type CardFormSchema = z.infer<typeof CardSchema>;
