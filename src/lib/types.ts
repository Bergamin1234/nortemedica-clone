export interface Category {
  id: number;
  nome: string;
  slug: string;
  icone: string;
  descricao: string;
  ordem: number;
}

export interface Brand {
  id: number;
  nome: string;
  slug: string;
}

export interface Product {
  id: number;
  categoria_id: number;
  marca_id: number;
  nome: string;
  slug: string;
  sku: string;
  descricao_curta: string;
  descricao_longa: string;
  especificacoes: string;
  preco_de: number;
  preco_por: number;
  estoque: number;
  imagem_url: string;
  destaque: number;
  lancamento: number;
  oferta?: number;
  desconto_pix?: number;
  max_parcelas?: number;
  parcelas_sem_juros?: number;
  ativo: number;
  categoria_nome: string;
  categoria_slug: string;
  marca_nome: string;
  marca_slug: string;
}

export interface ProductOverride {
  nome?: string;
  sku?: string;
  marca_nome?: string;
  categoria_nome?: string;
  descricao_curta?: string;
  descricao_longa?: string;
  especificacoes?: string;
  imagem_url?: string;
  preco_de?: number;
  preco_por?: number;
  desconto_pix?: number;
  max_parcelas?: number;
  parcelas_sem_juros?: number;
  lancamento?: number;
  oferta?: number;
  estoque?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  nome: string;
  prazo: string;
  valor: number;
  valor_formatado: string;
  gratis: boolean;
}

export interface OrderRecord {
  codigo_pedido: string;
  tipo_cliente: "PF" | "PJ";
  nome_cliente: string;
  documento: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  subtotal: number;
  frete_tipo: string;
  frete_valor: number;
  desconto: number;
  total: number;
  metodo_pagamento: "PIX" | "CARTAO" | "BOLETO";
  status_pagamento: string;
  status_pedido: string;
  observacoes?: string;
  created_at: string;
  dados_pagamento: {
    copia_e_cola?: string;
    chave_pix?: string;
    parcelas?: number;
    valor_parcela?: number;
    vencimento?: string;
    linha_digitavel?: string;
  };
  itens: {
    produto_id: number;
    nome_produto: string;
    preco_unitario: number;
    quantidade: number;
    subtotal: number;
  }[];
}
