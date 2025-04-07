
export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  urlImagem: string;
  digital: boolean;
  slug: string;
  usarProcessamentoPersonalizado?: boolean;
  statusCartaoManual?: string;
}

export interface CriarProdutoInput {
  nome: string;
  descricao: string;
  preco: number;
  urlImagem: string;
  digital: boolean;
  usarProcessamentoPersonalizado?: boolean;
  statusCartaoManual?: string;
}
