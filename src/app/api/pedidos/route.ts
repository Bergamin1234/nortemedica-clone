import { NextRequest, NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";
import type { OrderRecord } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.nome_cliente || !body.documento || !body.email || !body.itens?.length) {
      return NextResponse.json(
        { success: false, message: "Preencha todos os campos obrigatórios e adicione itens." },
        { status: 400 }
      );
    }

    const subtotal = body.itens.reduce(
      (sum: number, item: { preco_unitario: number; quantidade: number }) =>
        sum + Number(item.preco_unitario) * Number(item.quantidade),
      0
    );

    const metodo = (body.metodo_pagamento || "PIX") as "PIX" | "CARTAO" | "BOLETO";
    const desconto =
      metodo === "PIX"
        ? body.desconto_pix_total !== undefined
          ? Math.max(0, Number(body.desconto_pix_total))
          : (subtotal * SITE_CONFIG.descontoPixPercentual) / 100
        : 0;
    const freteValor = Number(body.frete_valor || 0);
    const total = subtotal - desconto + freteValor;

    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codigoPedido = `NM-${dateStamp}-${randomCode}`;

    const dadosPagamento: OrderRecord["dados_pagamento"] = {};
    if (metodo === "PIX") {
      dadosPagamento.chave_pix = SITE_CONFIG.chavePix;
      dadosPagamento.copia_e_cola = `00020126580014BR.GOV.BCB.PIX0114${SITE_CONFIG.chavePix}52040000530398654${total.toFixed(2)}5802BR5925NORTEMEDICA COM E REP LTDA6011PORTO VELHO62070503***6304${randomCode}`;
    } else if (metodo === "CARTAO") {
      const parcelas = Math.max(1, Math.min(12, Number(body.cartao_parcelas || 1)));
      dadosPagamento.parcelas = parcelas;
      dadosPagamento.valor_parcela = total / parcelas;
    } else if (metodo === "BOLETO") {
      const venc = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      dadosPagamento.vencimento = venc.toLocaleDateString("pt-BR");
      const cents = String(Math.round(total * 100)).padStart(10, "0");
      dadosPagamento.linha_digitavel = `34191.79001 01043.510047 91020.150008 7 ${dateStamp}${cents}`;
    }

    const order: OrderRecord = {
      codigo_pedido: codigoPedido,
      tipo_cliente: body.tipo_cliente === "PJ" ? "PJ" : "PF",
      nome_cliente: body.nome_cliente,
      documento: body.documento,
      email: body.email,
      telefone: body.telefone,
      cep: body.cep,
      endereco: body.endereco,
      numero: body.numero,
      complemento: body.complemento || "",
      bairro: body.bairro,
      cidade: body.cidade,
      estado: body.estado,
      subtotal,
      frete_tipo: body.frete_tipo || "PAC",
      frete_valor: freteValor,
      desconto,
      total,
      metodo_pagamento: metodo,
      status_pagamento: metodo === "CARTAO" ? "Aprovado" : "Aguardando Pagamento",
      status_pedido: "Em Processamento",
      observacoes: body.observacoes || "",
      created_at: now.toISOString(),
      dados_pagamento: dadosPagamento,
      itens: body.itens
    };

    return NextResponse.json({ success: true, order });
  } catch {
    return NextResponse.json(
      { success: false, message: "Erro ao processar o pedido." },
      { status: 500 }
    );
  }
}
