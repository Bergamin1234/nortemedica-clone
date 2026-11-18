"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartButton() {
  const { totalItems, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Abrir carrinho de compras (${totalItems} itens)`}
      className="relative flex items-center space-x-2.5 bg-slate-100 hover:bg-blue-50 text-blue-950 px-3.5 py-2 md:py-2.5 rounded-xl border border-slate-200 transition group"
    >
      <div className="relative">
        <ShoppingCart
          className="w-5 h-5 text-blue-950 group-hover:text-red-600 transition"
          aria-hidden="true"
        />
        {totalItems > 0 && (
          <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white font-black text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow">
            {totalItems}
          </span>
        )}
      </div>
      <span className="hidden md:inline font-bold text-xs uppercase tracking-wider text-slate-700">
        Meu Carrinho
      </span>
    </button>
  );
}
