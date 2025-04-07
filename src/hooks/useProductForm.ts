
import { useState, useCallback } from 'react';
import { CriarProdutoInput } from '@/types/product';

// Estado inicial do formulário
const estadoInicialFormulario: CriarProdutoInput = {
  nome: '',
  descricao: '',
  preco: 0,
  urlImagem: '',
  digital: false,
  usarProcessamentoPersonalizado: false,
  statusCartaoManual: 'ANALISE'
};

/**
 * Hook para gerenciar o estado do formulário de produtos
 */
export const useProductForm = () => {
  const [dadosFormulario, definirDadosFormulario] = useState<CriarProdutoInput>(estadoInicialFormulario);
  
  const redefinirFormulario = useCallback(() => {
    definirDadosFormulario(estadoInicialFormulario);
  }, []);

  const manipularMudancaInput = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: nome, value: valor } = e.target;
    
    if (nome === 'preco') {
      definirDadosFormulario(prev => ({
        ...prev,
        [nome]: parseFloat(valor) || 0
      }));
    } else {
      definirDadosFormulario(prev => ({
        ...prev,
        [nome]: valor
      }));
    }
  }, []);

  const manipularMudancaSwitch = useCallback((checked: boolean) => {
    definirDadosFormulario(prev => ({
      ...prev,
      digital: checked
    }));
  }, []);

  const manipularMudancaProcessamentoPersonalizado = useCallback((checked: boolean) => {
    definirDadosFormulario(prev => ({
      ...prev,
      usarProcessamentoPersonalizado: checked
    }));
  }, []);

  const manipularMudancaStatusCartaoManual = useCallback((value: string) => {
    definirDadosFormulario(prev => ({
      ...prev,
      statusCartaoManual: value
    }));
  }, []);

  return {
    dadosFormulario,
    definirDadosFormulario,
    redefinirFormulario,
    manipularMudancaInput,
    manipularMudancaSwitch,
    manipularMudancaProcessamentoPersonalizado,
    manipularMudancaStatusCartaoManual
  };
};
