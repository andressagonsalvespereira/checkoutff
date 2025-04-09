
import { useCallback } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { Product, CriarProdutoInput } from '@/types/product';

/**
 * Hook para operações de CRUD de produtos
 */
export const useProductOperations = () => {
  const { toast: exibirNotificacao } = useToast();
  const { 
    addProduct: adicionarProduto, 
    updateProduct: atualizarProduto, 
    deleteProduct: removerProduto,
    refreshProducts: atualizarProdutos
  } = useProducts();

  const handleAdicionarProduto = async (dadosFormulario: CriarProdutoInput) => {
    try {
      // Transformar o statusCartaoManual para custom_manual_status para compatibilidade com o backend
      const produtoData = {
        ...dadosFormulario,
        custom_manual_status: dadosFormulario.statusCartaoManual,
        override_global_status: dadosFormulario.usarProcessamentoPersonalizado
      };
      
      const novoProduto = await adicionarProduto(produtoData);
      exibirNotificacao({
        title: "Sucesso",
        description: "Produto adicionado com sucesso",
      });
      return true;
    } catch (erro) {
      console.error('Erro ao adicionar produto:', erro);
      exibirNotificacao({
        title: "Erro",
        description: "Falha ao adicionar produto",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleAtualizarProduto = async (id: string, dadosFormulario: CriarProdutoInput) => {
    try {
      // Transformar o statusCartaoManual para custom_manual_status para compatibilidade com o backend
      const produtoData = {
        ...dadosFormulario,
        custom_manual_status: dadosFormulario.statusCartaoManual,
        override_global_status: dadosFormulario.usarProcessamentoPersonalizado
      };
      
      await atualizarProduto(id, produtoData);
      exibirNotificacao({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });
      return true;
    } catch (erro) {
      console.error('Erro ao atualizar produto:', erro);
      exibirNotificacao({
        title: "Erro",
        description: "Falha ao atualizar produto",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoverProduto = async (id: string) => {
    try {
      await removerProduto(id);
      exibirNotificacao({
        title: "Sucesso",
        description: "Produto removido com sucesso",
      });
      return true;
    } catch (erro) {
      console.error('Erro ao remover produto:', erro);
      exibirNotificacao({
        title: "Erro",
        description: "Falha ao remover produto",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleAdicionarProduto,
    handleAtualizarProduto,
    handleRemoverProduto,
    atualizarProdutos
  };
};
