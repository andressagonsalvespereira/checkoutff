import { logger } from '@/utils/logger';
import { PaymentStatus } from '@/types/order';

export const resolveManualStatus = (status: string | undefined): PaymentStatus => {
  logger.log('[resolveManualStatus] Recebido status:', status);
  if (!status) {
    logger.warn('[resolveManualStatus] Status vazio ou undefined, retornando PENDING');
    return 'PENDING';
  }

  const normalized = status.toUpperCase();
  switch (normalized) {
    case 'PAID':
    case 'CONFIRMED':
    case 'APPROVED':
      logger.log('[resolveManualStatus] Normalizado para: PAID');
      return 'PAID';
    case 'REJECTED':
    case 'DENIED':
    case 'CANCELLED':
      logger.log('[resolveManualStatus] Normalizado para: DENIED');
      return 'DENIED';
    default:
      logger.log('[resolveManualStatus] Não reconhecido → PENDING');
      return 'PENDING';
  }
};

export const isConfirmedStatus = (status: PaymentStatus): boolean => status === 'PAID';
export const isRejectedStatus = (status: PaymentStatus): boolean => status === 'DENIED';
export const isPendingStatus = (status: PaymentStatus): boolean => status === 'PENDING';
