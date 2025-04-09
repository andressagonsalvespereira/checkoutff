
/**
 * Validates a CPF number
 * @param cpf CPF to validate (can be formatted or just numbers)
 * @returns true if valid, false otherwise
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  cpf = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cpf.length !== 11) {
    return false;
  }
  
  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
    return false;
  }
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  
  return remainder === parseInt(cpf.charAt(10));
};

/**
 * Validates if a CVV is valid (3 digits and not 000)
 * @param cvv CVV to validate
 * @returns true if valid, false otherwise
 */
export const validateCVV = (cvv: string): boolean => {
  // Remove non-numeric characters
  const cleanedCvv = cvv.replace(/\D/g, '');
  
  // Must be 3 digits and not 000
  return cleanedCvv.length === 3 && cleanedCvv !== '000';
};
