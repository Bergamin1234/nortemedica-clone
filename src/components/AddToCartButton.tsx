"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product, 1, true)}
      className="btn-nm-buy flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm"
    >
      <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
      <span>Comprar</span>
    </button>
  );
}
