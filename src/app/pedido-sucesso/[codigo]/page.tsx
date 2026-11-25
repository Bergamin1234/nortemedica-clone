"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, CheckCircle2, Copy, MessageCircle, Printer, Store } from "lucide-react";
import type { OrderRecord } from "@/lib/types";
import { formatBRL, SITE_CONFIG } from "@/lib/constants";

export default function PedidoSucessoPage() {
  const params = useParams<{ codigo: string }>();
  const codigo = params?.codigo || "";
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`nortemedica_order_${codigo}`);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [codigo]);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 flex-1">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h1 className="text-2xl font-black text-blue-950">Pedido {codigo} Registrado!</h1>
        <p className="text-xs text-slate-500">
          Sua solicitação foi recebida pela nossa equipe comercial.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-950 text-white font-bold px-6 py-3 rounded-xl text-xs"
        >
          Voltar para a Loja
        </Link>
      </main>
    );
  }

  const pixPayload = order.dados_pagamento.copia_e_cola || "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixPayload)}`;
  const whatsMsg = encodeURIComponent(
    `Olá! Realizei o pedido ${order.codigo_pedido} na Nortemedica no valor de ${formatBRL(order.total)} e gostaria de confirmar o status.`
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-blue-950">
            Pedido Confirmado com Sucesso!
          </h1>
          <div className="inline-block bg-slate-100 px-4 py-2 rounded-xl font-mono font-bold text-sm border">
            Código: <span className="text-blue-950 font-black">{order.codigo_pedido}</span>
          </div>
        </div>

        {order.metodo_pagamento === "PIX" && pixPayload && (
          <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-3xl p-6 text-center space-y-5">
            <div>
              <h2 className="text-xl font-black text-emerald-950">
                Total no Pix: {formatBRL(order.total)}
              </h2>
              <p className="text-xs text-emerald-800 mt-1">
                Escaneie o QR Code ou copie o código Pix abaixo:
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-md border border-emerald-200 inline-block">
              <img src={qrUrl} alt="QR Code Pix" className="w-48 h-48 mx-auto" />
            </div>
            <div className="max-w-lg mx-auto flex space-x-2">
              <input
                type="text"
                readOnly
                value={pixPayload}
                className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
              />
              <button
                type="button"
                onClick={() => copyText(pixPayload)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copiado!" : "Copiar Pix"}</span>
              </button>
            </div>
          </div>
        )}

        {order.metodo_pagamento === "BOLETO" && order.dados_pagamento.linha_digitavel && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
            <p className="font-bold text-slate-900">
              Boleto Bancário — Vencimento: {order.dados_pagamento.vencimento}
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={order.dados_pagamento.linha_digitavel}
                className="flex-1 bg-white border rounded-xl px-3 py-2 font-mono"
              />
              <button
                type="button"
                onClick={() => copyText(order.dados_pagamento.linha_digitavel || "")}
                className="bg-slate-800 text-white font-bold px-4 py-2 rounded-xl"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-1.5">
            <h3 className="font-bold text-blue-950 text-sm mb-2">Entrega</h3>
            <p><strong>Cliente:</strong> {order.nome_cliente}</p>
            <p><strong>Documento:</strong> {order.documento}</p>
            <p><strong>Endereço:</strong> {order.endereco}, {order.numero} {order.complemento}</p>
            <p><strong>Cidade:</strong> {order.bairro} - {order.cidade}/{order.estado}</p>
            <p><strong>Envio:</strong> {order.frete_tipo}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border space-y-1.5">
            <h3 className="font-bold text-blue-950 text-sm mb-2">Financeiro</h3>
            <p className="flex justify-between"><span>Subtotal:</span> <strong>{formatBRL(order.subtotal)}</strong></p>
            <p className="flex justify-between"><span>Frete:</span> <strong>{order.frete_valor === 0 ? "Grátis" : formatBRL(order.frete_valor)}</strong></p>
            {order.desconto > 0 && (
              <p className="flex justify-between text-emerald-700"><span>Desconto Pix:</span> <strong>- {formatBRL(order.desconto)}</strong></p>
            )}
            <p className="flex justify-between text-sm font-black text-blue-950 pt-2 border-t">
              <span>Total:</span> <span className="text-emerald-600">{formatBRL(order.total)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center pt-4 border-t">
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${whatsMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Comprovante no WhatsApp</span>
          </a>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <Link
              href="/"
              className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Voltar à Loja</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
