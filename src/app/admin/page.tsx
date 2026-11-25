"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Download,
  Lock,
  LogOut,
  Package,
  Pencil,
  Receipt,
  RotateCcw,
  Save,
  Search,
  Store,
  Wallet,
  X
} from "lucide-react";
import { getAllProducts } from "@/lib/catalog";
import { formatBRL } from "@/lib/constants";
import type { OrderRecord, Product } from "@/lib/types";

interface ProductOverride {
  nome?: string;
  marca_nome?: string;
  preco_por?: number;
  estoque?: number;
}

const OVERRIDES_KEY = "nortemedica_product_overrides";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"dashboard" | "produtos" | "pedidos">("dashboard");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [overrides, setOverrides] = useState<Record<number, ProductOverride>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProductOverride>({});
  const [copiedReport, setCopiedReport] = useState(false);

  const baseProducts = getAllProducts();

  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("nm_admin_auth");
      if (savedAuth === "1") setAuthenticated(true);
      const savedOrders = JSON.parse(localStorage.getItem("nortemedica_orders") || "[]");
      if (Array.isArray(savedOrders)) setOrders(savedOrders);
      const savedOverrides = JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}");
      if (savedOverrides && typeof savedOverrides === "object") {
        setOverrides(savedOverrides);
      }
    } catch {
      // ignore
    }
  }, []);

  const products: Product[] = baseProducts.map((p) => {
    const ov = overrides[p.id];
    if (!ov) return p;
    return {
      ...p,
      nome: ov.nome ?? p.nome,
      marca_nome: ov.marca_nome ?? p.marca_nome,
      preco_por: ov.preco_por ?? p.preco_por,
      estoque: ov.estoque ?? p.estoque
    };
  });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const cleanUser = user.trim().toLowerCase();
    if (
      (cleanUser === "admin" && pass === "admin123") ||
      (cleanUser === "nortemedica" && pass === "nortemedica2026")
    ) {
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

  function startEditing(p: Product) {
    setEditingId(p.id);
    setEditForm({
      nome: p.nome,
      marca_nome: p.marca_nome,
      preco_por: p.preco_por,
      estoque: p.estoque
    });
  }

  function saveEdit(id: number) {
    const updated = {
      ...overrides,
      [id]: {
        nome: editForm.nome?.trim() || undefined,
        marca_nome: editForm.marca_nome?.trim().toUpperCase() || undefined,
        preco_por: typeof editForm.preco_por === "number" ? editForm.preco_por : undefined,
        estoque: typeof editForm.estoque === "number" ? editForm.estoque : undefined
      }
    };
    setOverrides(updated);
    setEditingId(null);
    try {
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  function clearOverrides() {
    setOverrides({});
    try {
      localStorage.removeItem(OVERRIDES_KEY);
    } catch {
      // ignore
    }
  }

  function copyAdjustmentsReport() {
    const lines = Object.entries(overrides).map(([idStr, ov]) => {
      const orig = baseProducts.find((p) => p.id === Number(idStr));
      return `SKU ${orig?.sku || idStr} | Marca: ${orig?.marca_nome} -> ${ov.marca_nome ?? orig?.marca_nome} | Nome: ${ov.nome ?? orig?.nome} | Preço: ${ov.preco_por ?? orig?.preco_por}`;
    });
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  function downloadAdjustmentsJson() {
    const payload = Object.entries(overrides).map(([idStr, ov]) => {
      const orig = baseProducts.find((p) => p.id === Number(idStr));
      return {
        id: Number(idStr),
        sku: orig?.sku,
        slug: orig?.slug,
        antes: {
          nome: orig?.nome,
          marca_nome: orig?.marca_nome,
          preco_por: orig?.preco_por,
          estoque: orig?.estoque
        },
        depois: ov
      };
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ajustes-catalogo-nortemedica.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authenticated) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 py-16 bg-slate-900">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-blue-950 p-8 text-center text-white border-b-4 border-emerald-500">
            <img
              src="/images/icon.png"
              alt="Ícone Nortemedica"
              className="w-16 h-16 mx-auto mb-3 object-contain"
            />
            <img
              src="/images/logo-white.png"
              alt="Logo Nortemedica"
              className="h-8 mx-auto object-contain"
            />
            <p className="text-[11px] text-slate-300 mt-2 uppercase tracking-wider font-semibold">
              Painel Administrativo Nortemedica
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
                  placeholder="Digite seu usuário"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Senha</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Digite sua senha"
                  required
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

  const overrideCount = Object.keys(overrides).length;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
      <div className="bg-blue-950 text-white rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <img src="/images/logo-white.png" alt="Nortemedica" className="h-8 w-auto" />
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
        <div className="space-y-4">
          {overrideCount > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-emerald-900">
                <strong>{overrideCount} produto(s) editado(s) localmente.</strong> Exporte ou copie
                os ajustes para publicar definitivamente no catálogo global.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyAdjustmentsReport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                >
                  {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReport ? "Copiado!" : "Copiar Relatório"}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadAdjustmentsJson}
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar JSON</span>
                </button>
                <button
                  type="button"
                  onClick={clearOverrides}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>
          )}

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
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    const isModified = Boolean(overrides[p.id]);
                    return (
                      <tr key={p.id} className={isModified ? "bg-emerald-50/40" : "hover:bg-slate-50"}>
                        <td className="py-2.5 px-4">
                          <img
                            src={p.imagem_url}
                            alt={p.nome}
                            className="w-10 h-10 object-contain rounded border p-0.5 bg-white"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.nome ?? ""}
                              onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs font-semibold"
                            />
                          ) : (
                            <Link
                              href={`/produto/${p.slug}`}
                              className="font-bold text-slate-800 hover:text-blue-900 block"
                            >
                              {p.nome}
                            </Link>
                          )}
                          <span className="text-[11px] font-mono text-slate-400">{p.sku}</span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-blue-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.marca_nome ?? ""}
                              onChange={(e) =>
                                setEditForm({ ...editForm, marca_nome: e.target.value })
                              }
                              className="w-36 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs font-bold uppercase"
                            />
                          ) : (
                            p.marca_nome
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-black text-emerald-600">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.preco_por ?? 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  preco_por: parseFloat(e.target.value) || 0
                                })
                              }
                              className="w-28 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs font-bold"
                            />
                          ) : (
                            formatBRL(p.preco_por)
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-bold">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.estoque ?? 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  estoque: parseInt(e.target.value) || 0
                                })
                              }
                              className="w-20 px-2.5 py-1.5 border border-blue-300 rounded-lg text-xs font-bold"
                            />
                          ) : (
                            `${p.estoque} un`
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {isEditing ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => saveEdit(p.id)}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                                title="Salvar"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                                title="Cancelar"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditing(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-950 hover:text-white text-slate-700 font-bold transition"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
