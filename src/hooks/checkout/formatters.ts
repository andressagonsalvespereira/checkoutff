
/**
 * Formatter utilities for checkout form fields
 */

/**
 * Formats a CPF number with dots and hyphen
 */
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
};

/**
 * Formats a phone number with parentheses and hyphen
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

/**
 * Formats a CEP (postal code) with hyphen
 */
export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{1,3})/, '$1-$2').substring(0, 9);
};
