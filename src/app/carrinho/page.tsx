"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Lock, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/constants";

export default function CarrinhoPage() {
  const { items, subtotal, pixDiscount, totalPix, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex-1">
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
          <Link href="/" className="hover:text-blue-950 font-medium">
            Início
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span className="text-slate-800 font-bold">Carrinho de Compras</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-blue-950">Carrinho de Compras</h1>
            <p className="text-xs text-slate-500">
              Revise os itens selecionados antes de prosseguir para o checkout
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Seu carrinho está vazio</h2>
            <p className="text-xs text-slate-500">
              Adicione equipamentos e suprimentos médicos hospitalares para iniciar sua compra.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Produto</th>
                      <th className="py-3 px-4">Unitário</th>
                      <th className="py-3 px-4">Qtd</th>
                      <th className="py-3 px-4">Subtotal</th>
                      <th className="py-3 px-4 text-right">Remover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(({ product, quantity }) => (
                      <tr key={product.id} className="border-b border-slate-100 text-xs text-slate-700">
                        <td className="py-4 px-4 flex items-center space-x-3">
                          <img
                            src={product.imagem_url}
                            alt={product.nome}
                            className="w-16 h-16 object-contain rounded-xl border border-slate-200 bg-white p-1 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-blue-900 uppercase block">
                              {product.marca_nome}
                            </span>
                            <Link
                              href={`/produto/${product.slug}`}
                              className="font-bold text-slate-800 hover:text-blue-950 text-sm"
                            >
                              {product.nome}
                            </Link>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {formatBRL(product.preco_por)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm text-slate-800 w-6 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                          {formatBRL(product.preco_por * quantity)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            aria-label={`Remover ${product.nome}`}
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-300 hover:text-red-600 transition p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                <Link
                  href="/"
                  className="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Continuar Comprando</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h2 className="font-black text-blue-950 text-base border-b pb-3">
                  Resumo do Pedido
                </h2>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <strong className="text-slate-900 text-sm">{formatBRL(subtotal)}</strong>
                  </div>
                  {pixDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="font-semibold">Desconto no PIX:</span>
                      <strong className="font-black text-sm">- {formatBRL(pixDiscount)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">Total no Cartão:</span>
                    <strong className="text-blue-950 text-lg font-black">
                      {formatBRL(subtotal)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-emerald-700 text-sm">Total no PIX:</span>
                    <strong className="text-emerald-600 text-xl font-black">
                      {formatBRL(totalPix)}
                    </strong>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl text-center text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Prosseguir para o Checkout</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  Ambiente Seguro com Criptografia SSL
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
