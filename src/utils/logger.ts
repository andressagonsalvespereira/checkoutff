
/**
 * Utilitário de logging para centralizar e padronizar logs da aplicação
 * Controla exibição de logs baseado em ambiente de desenvolvimento
 */

const isDev = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log informativo (só exibido em desenvolvimento)
   * @param message Mensagem a ser logada
   * @param data Dados adicionais (opcional)
   */
  log: (message: string, data?: any) => {
    if (isDev) {
      if (data) {
        console.log(`[INFO] ${message}`, data);
      } else {
        console.log(`[INFO] ${message}`);
      }
    }
  },
  
  /**
   * Log de aviso (só exibido em desenvolvimento)
   * @param message Mensagem de aviso
   * @param data Dados adicionais (opcional)
   */
  warn: (message: string, data?: any) => {
    if (isDev) {
      if (data) {
        console.warn(`[WARN] ${message}`, data);
      } else {
        console.warn(`[WARN] ${message}`);
      }
    }
  },
  
  /**
   * Log de erro (exibido em todos os ambientes)
   * @param message Mensagem de erro
   * @param error Objeto de erro ou dados adicionais
   */
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
};
