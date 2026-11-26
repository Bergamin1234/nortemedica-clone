"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Barcode, ChevronRight, CreditCard, Lock, QrCode, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/constants";
import type { ShippingOption } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, pixDiscount, clearCart, showToast } = useCart();

  const [tipoCliente, setTipoCliente] = useState<"PF" | "PJ">("PF");
  const [nomeCliente, setNomeCliente] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [cep, setCep] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const [metodo, setMetodo] = useState<"PIX" | "CARTAO" | "BOLETO">("PIX");
  const [cartaoParcelas, setCartaoParcelas] = useState(1);
  const [observacoes, setObservacoes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const freteValor = selectedShipping?.valor ?? 0;
  const descontoAplicado = metodo === "PIX" ? pixDiscount : 0;
  const totalFinal = subtotal - descontoAplicado + freteValor;

  async function handleCepBlur() {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const viaRes = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const viaData = await viaRes.json();
      if (!viaData.erro) {
        setEndereco(viaData.logradouro || "");
        setBairro(viaData.bairro || "");
        setCidade(viaData.localidade || "");
        setEstado(viaData.uf || "");
      }

      const shipRes = await fetch(`/api/frete?cep=${clean}&subtotal=${subtotal}`);
      const shipData = await shipRes.json();
      if (shipData.success && shipData.opcoes?.length) {
        setShippingOptions(shipData.opcoes);
        setSelectedShipping(shipData.opcoes[0]);
      }
    } catch {
      // silent
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      showToast("Seu carrinho está vazio.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        tipo_cliente: tipoCliente,
        nome_cliente: nomeCliente,
        documento,
        email,
        telefone,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        frete_tipo: selectedShipping?.nome || "PAC - Encomenda Econômica",
        frete_valor: freteValor,
        desconto_pix_total: pixDiscount,
        metodo_pagamento: metodo,
        cartao_parcelas: cartaoParcelas,
        observacoes,
        itens: items.map(({ product, quantity }) => ({
          produto_id: product.id,
          nome_produto: product.nome,
          preco_unitario: product.preco_por,
          quantidade: quantity,
          subtotal: product.preco_por * quantity
        }))
      };

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        try {
          const existing = JSON.parse(localStorage.getItem("nortemedica_orders") || "[]");
          existing.unshift(data.order);
          localStorage.setItem("nortemedica_orders", JSON.stringify(existing));
          localStorage.setItem(`nortemedica_order_${data.order.codigo_pedido}`, JSON.stringify(data.order));
        } catch {
          // ignore storage errors
        }
        clearCart();
        router.push(`/pedido-sucesso/${data.order.codigo_pedido}`);
      } else {
        showToast(data.message || "Erro ao concluir pedido.", "error");
      }
    } catch {
      showToast("Erro de comunicação ao finalizar compra.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 flex-1">
        <h1 className="text-2xl font-black text-blue-950">Seu carrinho está vazio</h1>
        <p className="text-xs text-slate-500">
          Adicione equipamentos médicos antes de acessar o checkout.
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

  return (
    <div className="flex-1">
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
          <Link href="/" className="hover:text-blue-950 font-medium">
            Início
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <Link href="/carrinho" className="hover:text-blue-950 font-medium">
            Carrinho
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span className="text-slate-800 font-bold">Checkout Seguro</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-950">Finalização de Pedido</h1>
            <p className="text-xs text-slate-500">
              Preencha seus dados de entrega e pagamento com segurança criptografada
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Buyer Info */}
              <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-bold text-blue-950 text-base">
                      Identificação do Comprador
                    </h2>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setTipoCliente("PF")}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        tipoCliente === "PF"
                          ? "bg-white text-blue-950 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Pessoa Física
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoCliente("PJ")}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        tipoCliente === "PJ"
                          ? "bg-white text-blue-950 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Pessoa Jurídica / Hospital
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {tipoCliente === "PJ"
                        ? "Razão Social / Nome do Hospital ou Clínica *"
                        : "Nome Completo *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {tipoCliente === "PJ" ? "CNPJ *" : "CPF *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                      placeholder={
                        tipoCliente === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(69) 90000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      E-mail para Nota Fiscal *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="compras@clinica.com.br"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Step 2: Address & Shipping */}
              <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <span className="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-blue-950 text-base">Endereço e Frete</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      CEP * {cepLoading && <span className="text-blue-600 font-normal">buscando...</span>}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={9}
                      value={cep}
                      onBlur={handleCepBlur}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 8);
                        if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
                        setCep(v);
                      }}
                      placeholder="76804-131"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Logradouro *</label>
                    <input
                      type="text"
                      required
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">UF *</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={estado}
                      onChange={(e) => setEstado(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                {shippingOptions.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="block font-bold text-xs text-slate-800">
                      Escolha a modalidade de envio:
                    </span>
                    {shippingOptions.map((op) => (
                      <label
                        key={op.id}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
                          selectedShipping?.id === op.id
                            ? "border-blue-900 bg-blue-50/40"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="frete"
                            checked={selectedShipping?.id === op.id}
                            onChange={() => setSelectedShipping(op)}
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-800 block">
                              {op.nome}
                            </span>
                            <span className="text-[11px] text-slate-500">Prazo: {op.prazo}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">
                          {op.valor_formatado}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Step 3: Payment */}
              <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <span className="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-blue-950 text-base">Forma de Pagamento</h2>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setMetodo("PIX")}
                    className={`p-3.5 rounded-2xl border-2 font-bold flex flex-col items-center space-y-1 transition ${
                      metodo === "PIX"
                        ? "border-blue-900 bg-blue-50/50 text-blue-950"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>PIX</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      À vista
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodo("CARTAO")}
                    className={`p-3.5 rounded-2xl border-2 font-bold flex flex-col items-center space-y-1 transition ${
                      metodo === "CARTAO"
                        ? "border-blue-900 bg-blue-50/50 text-blue-950"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-900" />
                    <span>Cartão</span>
                    <span className="text-[10px] text-slate-500">Até 12x</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodo("BOLETO")}
                    className={`p-3.5 rounded-2xl border-2 font-bold flex flex-col items-center space-y-1 transition ${
                      metodo === "BOLETO"
                        ? "border-blue-900 bg-blue-50/50 text-blue-950"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <Barcode className="w-5 h-5 text-slate-700" />
                    <span>Boleto / PJ</span>
                    <span className="text-[10px] text-slate-500">À vista</span>
                  </button>
                </div>

                {metodo === "PIX" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                    <p className="font-bold">Pagamento instantâneo via PIX!</p>
                    <p>
                      Ao finalizar, exibiremos o QR Code e o código Pix Copia e Cola imediatamente.
                    </p>
                  </div>
                )}

                {metodo === "CARTAO" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Parcelamento</label>
                      <select
                        value={cartaoParcelas}
                        onChange={(e) => setCartaoParcelas(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      >
                        {Array.from({ length: 12 }, (_, idx) => idx + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}x de {formatBRL(totalFinal / n)} {n <= 6 ? "sem juros" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {metodo === "BOLETO" && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                    Boleto emitido com vencimento em 3 dias úteis. Para faturamento hospitalar PJ a
                    prazo, nossa equipe entra em contato após a confirmação.
                  </div>
                )}

                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1">
                    Observações de Entrega
                  </label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Instruções para recepção ou almoxarifado hospitalar..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </section>
            </div>

            {/* Sticky Summary */}
            <aside className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-blue-950 text-base border-b pb-3">
                  Resumo da Compra
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3 py-2 border-b border-slate-100 last:border-0"
                    >
                      <img
                        src={product.imagem_url}
                        alt={product.nome}
                        className="w-11 h-11 object-contain rounded border p-0.5 bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {product.nome}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          {quantity}x {formatBRL(product.preco_por)}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatBRL(product.preco_por * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <strong className="text-slate-800">{formatBRL(subtotal)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <strong className="text-slate-800">
                      {freteValor === 0 ? "Grátis" : formatBRL(freteValor)}
                    </strong>
                  </div>
                  {descontoAplicado > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span>Desconto Pix:</span>
                      <strong>- {formatBRL(descontoAplicado)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-slate-200 items-baseline">
                    <span className="font-black text-base text-slate-900">Total:</span>
                    <strong className="text-2xl font-black text-blue-950">
                      {formatBRL(totalFinal)}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-extrabold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span>{submitting ? "Processando..." : "Finalizar Compra Segura"}</span>
                </button>

                <p className="text-[11px] text-center text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  Seus dados estão 100% protegidos
                </p>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}
