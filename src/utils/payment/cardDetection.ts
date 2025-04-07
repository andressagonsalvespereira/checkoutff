
/**
 * Detects card brand based on card number pattern
 * @param cardNumber Credit card number
 * @returns Detected card brand
 */
export function detectCardBrand(cardNumber: string): string {
  // Remove spaces and non-numeric characters
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Check for card patterns
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  } else if (/^5[1-5]/.test(cleanNumber)) {
    return 'mastercard';
  } else if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  } else if (/^(6011|65|64[4-9])/.test(cleanNumber)) {
    return 'discover';
  } else if (/^(62|88)/.test(cleanNumber)) {
    return 'unionpay';
  } else if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) {
    return 'diners';
  } else if (/^(50|5[6-8]|6[0-9])/.test(cleanNumber)) {
    return 'elo'; // Brazilian Elo card
  } else if (/^(636368|438935|504175|451416|636297|5067)/.test(cleanNumber)) {
    return 'elo'; // More Elo patterns
  } else if (/^(384100|384140|384160|606282|637095|637568)/.test(cleanNumber)) {
    return 'hipercard'; // Brazilian Hipercard
  } else if (/^60/.test(cleanNumber)) {
    return 'hipercard'; // More Hipercard patterns
  }

  return 'unknown';
}

/**
 * Validates a card number using the Luhn algorithm
 * @param cardNumber Credit card number to validate
 * @returns Boolean indicating if card number is valid
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-numeric characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}
