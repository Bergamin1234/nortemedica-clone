"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Minus, Plus, ShoppingCart, Truck, Zap } from "lucide-react";
import type { Product, ShippingOption } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export function ProductBuyActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const { addToCart } = useCart();
  const router = useRouter();

  function handleBuyNow() {
    addToCart(product, qty, false);
    router.push("/checkout");
  }

  async function handleCalcShipping(e: React.FormEvent) {
    e.preventDefault();
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setShippingError("Digite um CEP válido com 8 números.");
      setShippingOptions(null);
      return;
    }

    setShippingError("");
    setShippingLoading(true);
    try {
      const res = await fetch(
        `/api/frete?cep=${clean}&subtotal=${encodeURIComponent(product.preco_por * qty)}`
      );
      const data = await res.json();
      if (data.success && data.opcoes) {
        setShippingOptions(data.opcoes);
      } else {
        setShippingError(data.message || "Erro ao calcular frete.");
      }
    } catch {
      setShippingError("Não foi possível consultar o frete no momento.");
    } finally {
      setShippingLoading(false);
    }
  }

  const whatsMsg = encodeURIComponent(
    `Olá, gostaria de solicitar uma cotação para o produto: ${product.nome} (Código: ${product.sku})`
  );

  return (
    <div className="space-y-5">
      {/* Quantity */}
      <div className="flex items-center space-x-4">
        <label htmlFor="prod-qty" className="text-xs font-bold text-slate-700 uppercase">
          Quantidade:
        </label>
        <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            id="prod-qty"
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
            className="w-12 h-10 text-center font-bold text-sm border-0 focus:outline-none text-slate-800"
          />
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="w-10 h-10 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Buy Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleBuyNow}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
        >
          <Zap className="w-4 h-4 text-yellow-300" aria-hidden="true" />
          <span>Comprar Agora</span>
        </button>

        <button
          type="button"
          onClick={() => addToCart(product, qty, true)}
          className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-3.5 px-6 rounded-2xl shadow transition flex items-center justify-center space-x-2 text-sm"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>

      {/* WhatsApp Quote */}
      <a
        href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${whatsMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition flex items-center justify-center space-x-2"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
        <span>Solicitar Cotação para Clínica / Hospital no WhatsApp</span>
      </a>

      {/* Shipping Simulator */}
      <div className="border-t border-slate-200 pt-5">
        <label
          htmlFor="simular-cep"
          className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5"
        >
          <Truck className="w-4 h-4 text-blue-900" aria-hidden="true" />
          Simular Frete e Prazo de Entrega:
        </label>
        <form onSubmit={handleCalcShipping} className="flex space-x-2 max-w-sm">
          <input
            id="simular-cep"
            type="text"
            placeholder="00000-000"
            maxLength={9}
            value={cep}
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 8);
              if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
              setCep(v);
            }}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <button
            type="submit"
            disabled={shippingLoading}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-60"
          >
            {shippingLoading ? "..." : "Calcular"}
          </button>
        </form>

        {shippingError && <p className="mt-2 text-xs text-red-600 font-medium">{shippingError}</p>}

        {shippingOptions && (
          <div className="mt-3 text-xs space-y-1.5">
            {shippingOptions.map((op) => (
              <div
                key={op.id}
                className="flex justify-between items-center p-2.5 bg-slate-100 rounded-xl"
              >
                <span>
                  <strong className="text-slate-800">{op.nome}</strong>{" "}
                  <span className="text-slate-500">({op.prazo})</span>
                </span>
                <span className="font-bold text-emerald-700 shrink-0 ml-2">
                  {op.valor_formatado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
