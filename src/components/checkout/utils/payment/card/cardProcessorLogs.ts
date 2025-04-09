
/**
 * Logs decisions made when resolving the card payment status.
 * Useful for debugging manual vs. automatic logic.
 */
export function logCardProcessingDecisions(
  useCustomProcessing: boolean,
  productManualStatus: string | undefined,
  globalManualStatus: string | undefined,
  resolvedStatus: string
): void {
  console.info('----- Card Processing Decision Log -----');
  console.info('Custom processing enabled for product:', useCustomProcessing);
  console.info('Product manual status:', productManualStatus || 'None');
  console.info('Global manual status:', globalManualStatus || 'None');
  console.info('Final resolved status:', resolvedStatus);
  console.info('--------------------------------------');
}
