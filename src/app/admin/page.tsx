"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, LogOut, Package, Receipt, Search, Store, Wallet } from "lucide-react";
import { getAllProducts } from "@/lib/catalog";
import { formatBRL } from "@/lib/constants";
import type { OrderRecord } from "@/lib/types";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("admin123");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"dashboard" | "produtos" | "pedidos">("dashboard");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const products = getAllProducts();

  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("nm_admin_auth");
      if (savedAuth === "1") setAuthenticated(true);
      const savedOrders = JSON.parse(localStorage.getItem("nortemedica_orders") || "[]");
      if (Array.isArray(savedOrders)) setOrders(savedOrders);
    } catch {
      // ignore
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (user === "admin" && pass === "admin123") {
      setAuthenticated(true);
      setError("");
      try {
        sessionStorage.setItem("nm_admin_auth", "1");
      } catch {
        // ignore
      }
    } else {
      setError("Usuário ou senha incorretos.");
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    try {
      sessionStorage.removeItem("nm_admin_auth");
    } catch {
      // ignore
    }
  }

  function updateOrderStatus(code: string, newStatus: string) {
    const updated = orders.map((o) =>
      o.codigo_pedido === code ? { ...o, status_pedido: newStatus } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("nortemedica_orders", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  if (!authenticated) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 py-16 bg-slate-900">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-blue-950 p-8 text-center text-white border-b-4 border-emerald-500">
            <img
              src="/images/icon.png"
              alt="Ícone Norte Médica"
              className="w-16 h-16 mx-auto mb-3 object-contain"
            />
            <img
              src="/images/logo-white.png"
              alt="Logo Norte Médica"
              className="h-8 mx-auto object-contain"
            />
            <p className="text-[11px] text-slate-300 mt-2 uppercase tracking-wider font-semibold">
              Painel Administrativo
            </p>
          </div>

          <div className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Usuário</label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-950 hover:bg-blue-900 text-white font-extrabold py-3.5 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Lock className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>

            <p className="text-center text-xs text-slate-400">
              Padrão: <strong className="text-slate-700 font-mono">admin</strong> /{" "}
              <strong className="text-slate-700 font-mono">admin123</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status_pedido !== "Cancelado")
    .reduce((acc, o) => acc + o.total, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.marca_nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
      <div className="bg-blue-950 text-white rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <img src="/images/logo-white.png" alt="Norte Médica" className="h-8 w-auto" />
          <span className="text-xs bg-emerald-500 text-blue-950 font-black px-2 py-0.5 rounded uppercase">
            Admin
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("dashboard")}
            className={`px-3.5 py-2 rounded-xl transition ${
              tab === "dashboard" ? "bg-emerald-500 text-blue-950" : "bg-blue-900 text-slate-200"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setTab("produtos")}
            className={`px-3.5 py-2 rounded-xl transition ${
              tab === "produtos" ? "bg-emerald-500 text-blue-950" : "bg-blue-900 text-slate-200"
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("pedidos")}
            className={`px-3.5 py-2 rounded-xl transition ${
              tab === "pedidos" ? "bg-emerald-500 text-blue-950" : "bg-blue-900 text-slate-200"
            }`}
          >
            Pedidos ({orders.length})
          </button>
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" /> Loja
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Faturamento</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {formatBRL(totalRevenue)}
              </strong>
            </div>
            <Wallet className="w-10 h-10 text-emerald-600" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Pedidos</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {orders.length}
              </strong>
            </div>
            <Receipt className="w-10 h-10 text-blue-900" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Produtos Ativos</span>
              <strong className="text-2xl font-black text-slate-900 block mt-1">
                {products.length}
              </strong>
            </div>
            <Package className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      )}

      {tab === "produtos" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar entre os 190 produtos por nome, SKU ou marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs focus:outline-none"
            />
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-[10px] uppercase text-slate-500 sticky top-0">
                <tr>
                  <th className="py-3 px-4">Foto</th>
                  <th className="py-3 px-4">Produto / SKU</th>
                  <th className="py-3 px-4">Marca</th>
                  <th className="py-3 px-4">Preço</th>
                  <th className="py-3 px-4">Estoque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4">
                      <img
                        src={p.imagem_url}
                        alt={p.nome}
                        className="w-10 h-10 object-contain rounded border p-0.5 bg-white"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <Link
                        href={`/produto/${p.slug}`}
                        className="font-bold text-slate-800 hover:text-blue-900 block"
                      >
                        {p.nome}
                      </Link>
                      <span className="text-[11px] font-mono text-slate-400">{p.sku}</span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-blue-900">{p.marca_nome}</td>
                    <td className="py-2.5 px-4 font-black text-emerald-600">
                      {formatBRL(p.preco_por)}
                    </td>
                    <td className="py-2.5 px-4 font-bold">{p.estoque} un</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "pedidos" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Pagamento</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      Nenhum pedido realizado neste navegador ainda. Faça uma compra de teste no
                      checkout!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.codigo_pedido} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-950">
                        <Link href={`/pedido-sucesso/${o.codigo_pedido}`} className="hover:underline">
                          {o.codigo_pedido}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="block text-slate-800">{o.nome_cliente}</strong>
                        <span className="text-[11px] text-slate-400">
                          {o.cidade} - {o.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">{o.metodo_pagamento}</td>
                      <td className="py-3 px-4 font-black text-emerald-600">
                        {formatBRL(o.total)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={o.status_pedido}
                          onChange={(e) => updateOrderStatus(o.codigo_pedido, e.target.value)}
                          className="border rounded-lg px-2 py-1 text-xs font-bold bg-slate-50"
                        >
                          <option>Em Processamento</option>
                          <option>Separando Estoque</option>
                          <option>Enviado</option>
                          <option>Concluído</option>
                          <option>Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
