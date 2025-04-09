
/**
 * Utility functions for card brand detection
 */

/**
 * Detecta a bandeira do cartão com base nos primeiros dígitos
 */
export const detectCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // More detailed card brand detection
  if (cleanNumber.startsWith('4')) {
    return 'VISA';
  } else if (/^5[1-5]/.test(cleanNumber)) {
    return 'MASTERCARD';
  } else if (/^3[47]/.test(cleanNumber)) {
    return 'AMEX';
  } else if (/^6(?:011|5)/.test(cleanNumber)) {
    return 'DISCOVER';
  } else if (/^(36|38|30[0-5])/.test(cleanNumber)) {
    return 'DINERS';
  } else if (/^(606282|3841)/.test(cleanNumber)) {
    return 'HIPERCARD';
  } else if (/^50[0-9]/.test(cleanNumber)) {
    return 'AURA';
  } else if (/^(4011|431274|438935|451416|457393|4576|457631|457632|504175|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))/.test(cleanNumber)) {
    return 'ELO';
  } else {
    return 'DESCONHECIDA';
  }
};
