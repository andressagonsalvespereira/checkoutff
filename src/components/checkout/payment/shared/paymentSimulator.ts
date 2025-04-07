
import { v4 as uuidv4 } from 'uuid';

/**
 * Simula o processamento de pagamento com cartão de crédito
 * Útil para testes e demonstrações
 * @returns Objeto com resultado da simulação de pagamento
 */
export const simulateCardPayment = async (shouldSucceed = true) => {
  // Simula um processamento assíncrono
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!shouldSucceed) {
    throw new Error('Simulação de erro no processamento do cartão');
  }
  
  return {
    paymentId: `sim_${uuidv4()}`,
    status: 'CONFIRMED',
    message: 'Pagamento simulado processado com sucesso',
    timestamp: new Date().toISOString()
  };
};

/**
 * Simula a geração de QR Code PIX
 * Útil para testes e demonstrações
 * @returns Objeto com dados de QR Code PIX simulados
 */
export const simulatePixQrCodeGeneration = async () => {
  // Simula um processamento assíncrono
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Data de expiração: 30 minutos a partir de agora
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  
  return {
    paymentId: `pix_${uuidv4()}`,
    qrCode: '00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925SIMULADOR PIX PAGAMENTO6009Sao Paulo62070503***63048A9D',
    qrCodeImage: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925SIMULADOR PIX PAGAMENTO6009Sao Paulo62070503***63048A9D',
    expirationDate: expirationDate,
    status: 'PENDING'
  };
};
