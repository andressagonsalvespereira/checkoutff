
import { useState, useCallback } from 'react';
import { Product } from '@/types/product';

/**
 * Hook para gerenciar os diálogos de produto
 */
export const useProductDialogs = () => {
  const [dialogoAdicaoAberto, definirDialogoAdicaoAberto] = useState(false);
  const [dialogoEdicaoAberto, definirDialogoEdicaoAberto] = useState(false);
  const [dialogoRemocaoAberto, definirDialogoRemocaoAberto] = useState(false);
  const [produtoEmEdicao, definirProdutoEmEdicao] = useState<Product | null>(null);
  const [produtoParaRemover, definirProdutoParaRemover] = useState<Product | null>(null);

  return {
    dialogoAdicaoAberto,
    definirDialogoAdicaoAberto,
    dialogoEdicaoAberto,
    definirDialogoEdicaoAberto,
    dialogoRemocaoAberto,
    definirDialogoRemocaoAberto,
    produtoEmEdicao,
    definirProdutoEmEdicao,
    produtoParaRemover,
    definirProdutoParaRemover
  };
};
