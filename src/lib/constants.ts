export const SITE_CONFIG = {
  nome: "Nortemedica - Distribuidora Hospitalar & Cirúrgica",
  nomeCurto: "Nortemedica",
  slogan: "Produtos e Equipamentos Médicos, Hospitalares, Laboratório e Assistência Técnica",
  cnpj: "06.273.744/0001-40",
  endereco: "Rua Guanabara, 1275 - Bairro Nossa Senhora das Graças, Porto Velho - RO",
  telefone: "(69) 3229-4500",
  whatsapp: "5569999887766",
  email: "contato@nortemedica.com.br",
  emailLicitacao: "licita@nortemedica.com",
  chavePix: "06273744000140",
  descontoPixPercentual: 10,
  maxParcelasCartao: 12,
  parcelasSemJuros: 6,
  valorFreteGratis: 1500.0
} as const;

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function getPixPrice(price: number): number {
  return price * (1 - SITE_CONFIG.descontoPixPercentual / 100);
}

export function calculateShippingOptions(cep: string, subtotal: number) {
  const cleanCep = cep.replace(/\D/g, "");
  const isRondonia = cleanCep.startsWith("76");
  const isFreteGratis = subtotal >= SITE_CONFIG.valorFreteGratis;

  const options = [
    {
      id: "pac",
      nome: "PAC - Encomenda Econômica",
      prazo: isRondonia ? "2 a 4 dias úteis" : "6 a 10 dias úteis",
      valor: isFreteGratis ? 0 : isRondonia ? 35 : 75,
      gratis: isFreteGratis
    },
    {
      id: "sedex",
      nome: "SEDEX - Envio Expresso",
      prazo: isRondonia ? "1 a 2 dias úteis" : "3 a 5 dias úteis",
      valor: isRondonia ? 55 : 120,
      gratis: false
    },
    {
      id: "transportadora",
      nome: "Transportadora Especializada em Carga Médica",
      prazo: isRondonia ? "2 a 3 dias úteis" : "5 a 8 dias úteis",
      valor: isFreteGratis ? 0 : isRondonia ? 45 : 90,
      gratis: isFreteGratis
    }
  ];

  return options.map((op) => ({
    ...op,
    valor_formatado: op.valor === 0 ? "GRÁTIS" : formatBRL(op.valor)
  }));
}
