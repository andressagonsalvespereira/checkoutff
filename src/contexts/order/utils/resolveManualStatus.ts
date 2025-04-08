import { logger } from '@/utils/logger';

export const resolveManualStatus = (status: string | undefined): string => {
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
      logger.log('[resolveManualStatus] Normalizado para: CONFIRMED');
      return 'CONFIRMED';
    case 'REJECTED':
    case 'DENIED':
    case 'CANCELLED':
      logger.log('[resolveManualStatus] Normalizado para: REJECTED');
      return 'REJECTED';
    default:
      logger.log('[resolveManualStatus] Não reconhecido → PENDING');
      return 'PENDING';
  }
};

export const isConfirmedStatus = (status: string): boolean => status === 'CONFIRMED';
export const isRejectedStatus = (status: string): boolean => status === 'REJECTED';