"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/constants";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    subtotal,
    totalPix,
    closeDrawer,
    updateQuantity,
    removeFromCart
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Meu Carrinho">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl z-10 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="p-4 bg-blue-950 text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <h2 className="font-bold text-sm tracking-wide uppercase">Meu Carrinho</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
            className="w-8 h-8 rounded-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" aria-hidden="true" />
              <p className="font-semibold text-slate-600">Seu carrinho está vazio</p>
              <p className="text-xs text-slate-400 mt-1">
                Navegue pelas categorias e adicione equipamentos médicos.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center space-x-3 py-3.5">
                  <img
                    src={product.imagem_url}
                    alt={product.nome}
                    className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-white p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                      {product.marca_nome || "Nortemedica"}
                    </span>
                    <Link
                      href={`/produto/${product.slug}`}
                      onClick={closeDrawer}
                      className="text-xs font-semibold text-slate-800 hover:text-blue-950 truncate block"
                    >
                      {product.nome}
                    </Link>
                    <div className="text-xs text-slate-900 font-bold mt-1">
                      {formatBRL(product.preco_por)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-700 w-5 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remover ${product.nome}`}
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-300 hover:text-red-500 p-1.5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Subtotal:</span>
            <strong className="text-slate-800 text-sm">{formatBRL(subtotal)}</strong>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <span>Total no Pix à vista:</span>
            <strong className="text-sm font-black">{formatBRL(totalPix)}</strong>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/carrinho"
              onClick={closeDrawer}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-center text-xs transition"
            >
              Ver Carrinho
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs transition shadow flex items-center justify-center space-x-1 ${
                items.length === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <span>Finalizar Compra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
