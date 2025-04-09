
import { useEffect, useRef } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';
import { useProductForm } from './useProductForm';
import { useProductDialogs } from './useProductDialogs';
import { useProductPagination } from './useProductPagination';
import { useProductOperations } from './useProductOperations';

export const useGerenciamentoProdutos = () => {
  // Ref para controlar se o componente já foi montado
  const isMountedRef = useRef(false);
  
  // Obtém os produtos e estado do contexto
  const { 
    products: produtos, 
    loading: carregando, 
    error: erro,
    isOffline: estaOffline
  } = useProducts();

  // Hooks especializados
  const { 
    dadosFormulario, 
    definirDadosFormulario, 
    redefinirFormulario,
    manipularMudancaInput,
    manipularMudancaSwitch,
    manipularMudancaProcessamentoPersonalizado,
    manipularMudancaStatusCartaoManual
  } = useProductForm();

  const {
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
  } = useProductDialogs();

  const {
    paginaAtual,
    tamanhoPagina,
    handleMudancaPagina
  } = useProductPagination(produtos.length);

  const {
    handleAdicionarProduto,
    handleAtualizarProduto,
    handleRemoverProduto,
    atualizarProdutos
  } = useProductOperations();

  // Log de debug para monitorar montagem/desmontagem
  useEffect(() => {
    console.log('Hook useGerenciamentoProdutos montado, isMounted:', isMountedRef.current);
    isMountedRef.current = true;
    
    return () => {
      console.log('Hook useGerenciamentoProdutos desmontado');
      isMountedRef.current = false;
    };
  }, []);

  // Lidar com o clique no botão editar
  const handleEditarClique = (produto: Product) => {
    definirProdutoEmEdicao(produto);
    definirDadosFormulario({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      urlImagem: produto.urlImagem || '',
      digital: produto.digital,
      usarProcessamentoPersonalizado: produto.usarProcessamentoPersonalizado || false,
      statusCartaoManual: produto.statusCartaoManual || 'ANALISE'
    });
    definirDialogoEdicaoAberto(true);
  };

  // Lidar com o clique no botão excluir
  const handleRemoverClique = (produto: Product) => {
    definirProdutoParaRemover(produto);
    definirDialogoRemocaoAberto(true);
  };

  // Manipuladores para operações CRUD
  const handleAddProduct = async () => {
    const sucesso = await handleAdicionarProduto(dadosFormulario);
    if (sucesso) {
      redefinirFormulario();
      definirDialogoAdicaoAberto(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!produtoEmEdicao) return;
    
    const sucesso = await handleAtualizarProduto(produtoEmEdicao.id, dadosFormulario);
    if (sucesso) {
      definirDialogoEdicaoAberto(false);
      definirProdutoEmEdicao(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!produtoParaRemover) return;
    
    const sucesso = await handleRemoverProduto(produtoParaRemover.id);
    if (sucesso) {
      definirDialogoRemocaoAberto(false);
      definirProdutoParaRemover(null);
    }
  };

  return {
    // Estado dos produtos
    products: produtos,
    loading: carregando,
    error: erro,
    isOffline: estaOffline,
    
    // Estado do formulário
    formData: dadosFormulario,
    handleInputChange: manipularMudancaInput,
    handleSwitchChange: manipularMudancaSwitch,
    handleUseCustomProcessingChange: manipularMudancaProcessamentoPersonalizado,
    handleManualCardStatusChange: manipularMudancaStatusCartaoManual,
    resetForm: redefinirFormulario,
    
    // Estado dos diálogos
    isAddDialogOpen: dialogoAdicaoAberto,
    setIsAddDialogOpen: definirDialogoAdicaoAberto,
    isEditDialogOpen: dialogoEdicaoAberto,
    setIsEditDialogOpen: definirDialogoEdicaoAberto,
    isDeleteDialogOpen: dialogoRemocaoAberto,
    setIsDeleteDialogOpen: definirDialogoRemocaoAberto,
    editingProduct: produtoEmEdicao,
    productToDelete: produtoParaRemover,
    
    // Manipuladores de ações
    handleAddProduct,
    handleEditClick: handleEditarClique,
    handleDeleteClick: handleRemoverClique,
    handleUpdateProduct,
    handleDeleteProduct,
    refreshProducts: atualizarProdutos,
    
    // Paginação
    currentPage: paginaAtual,
    pageSize: tamanhoPagina,
    handlePageChange: handleMudancaPagina
  };
};

// Exportando com o nome antigo para manter compatibilidade
export const useProductManagement = useGerenciamentoProdutos;
