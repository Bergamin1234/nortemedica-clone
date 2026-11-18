"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem, Product } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/constants";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  totalItems: number;
  subtotal: number;
  pixDiscount: number;
  totalPix: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product, quantity?: number, openDrawerAfter?: boolean) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  showToast: (text: string, type?: "success" | "error") => void;
  toasts: ToastMessage[];
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nortemedica_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, hydrated]);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const addToCart = useCallback(
    (product: Product, quantity = 1, openDrawerAfter = true) => {
      const qty = Math.max(1, quantity);
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.product.id === product.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
          return updated;
        }
        return [...prev, { product, quantity: qty }];
      });
      showToast(`${product.nome} adicionado ao carrinho!`);
      if (openDrawerAfter) {
        setIsDrawerOpen(true);
      }
    },
    [showToast]
  );

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  }, []);

  const removeFromCart = useCallback(
    (productId: number) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      showToast("Item removido do carrinho.");
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.product.preco_por * i.quantity, 0);
  const pixDiscount = (subtotal * SITE_CONFIG.descontoPixPercentual) / 100;
  const totalPix = subtotal - pixDiscount;

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        totalItems,
        subtotal,
        pixDiscount,
        totalPix,
        openDrawer,
        closeDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showToast,
        toasts
      }}
    >
      {children}
      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white flex items-center gap-2.5 animate-fade-in ${
              t.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            <span aria-hidden="true">{t.type === "success" ? "✓" : "!"}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
