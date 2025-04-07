
/**
 * Common utility functions shared across payment handlers
 */

// Helper function to generate a random ID
export const randomId = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Simulate a delay for testing or UI feedback purposes
export const simulateProcessingDelay = (ms: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
