
import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar a paginação de produtos
 */
export const useProductPagination = (totalItems: number) => {
  const [paginaAtual, definirPaginaAtual] = useState(1);
  const [tamanhoPagina, definirTamanhoPagina] = useState(5);

  // Resetar para a primeira página quando o total de itens mudar
  useEffect(() => {
    definirPaginaAtual(1);
  }, [totalItems]);

  const handleMudancaPagina = (pagina: number) => {
    definirPaginaAtual(pagina);
  };

  return {
    paginaAtual,
    tamanhoPagina,
    definirPaginaAtual,
    definirTamanhoPagina,
    handleMudancaPagina
  };
};
