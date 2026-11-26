"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Lock,
  LogOut,
  Package,
  Pencil,
  Percent,
  Receipt,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Store,
  Tag,
  Upload,
  Wallet,
  X
} from "lucide-react";
import { getAllBrands, getAllCategories, getAllProducts } from "@/lib/catalog";
import { formatBRL, SITE_CONFIG } from "@/lib/constants";
import { useCatalogOverrides } from "@/context/CatalogOverridesContext";
import type { OrderRecord, Product, ProductOverride } from "@/lib/types";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"dashboard" | "produtos" | "pedidos">("produtos");
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductOverride>({});
  const [copiedReport, setCopiedReport] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    overrides,
    applyProductOverride,
    saveProductOverride,
    resetProductOverride,
    clearAllOverrides
  } = useCatalogOverrides();

  const baseProducts = getAllProducts();
  const allBrands = getAllBrands();
  const allCategories = getAllCategories();

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

  const products: Product[] = baseProducts.map(applyProductOverride);

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

  function openEditModal(p: Product) {
    const isOferta = p.oferta !== undefined ? p.oferta : p.preco_de > p.preco_por ? 1 : 0;
    setEditingProduct(p);
    setEditForm({
      nome: p.nome,
      sku: p.sku,
      marca_nome: p.marca_nome,
      categoria_nome: p.categoria_nome,
      descricao_curta: p.descricao_curta,
      descricao_longa: p.descricao_longa,
      especificacoes: p.especificacoes,
      imagem_url: p.imagem_url,
      preco_por: p.preco_por,
      preco_de: p.preco_de,
      desconto_pix: p.desconto_pix ?? SITE_CONFIG.descontoPixPercentual,
      max_parcelas: p.max_parcelas ?? SITE_CONFIG.maxParcelasCartao,
      parcelas_sem_juros: p.parcelas_sem_juros ?? SITE_CONFIG.parcelasSemJuros,
      lancamento: p.lancamento,
      oferta: isOferta,
      estoque: p.estoque
    });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 700;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setEditForm((prev) => ({ ...prev, imagem_url: dataUrl }));
        }
      };
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSaveModal(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    const precoPor = Math.max(0, Number(editForm.preco_por) || 0);
    let precoDe = Math.max(0, Number(editForm.preco_de) || 0);
    const oferta = editForm.oferta === 1 ? 1 : 0;
    if (oferta === 1 && precoDe <= precoPor) {
      precoDe = Number((precoPor * 1.15).toFixed(2));
    }

    const cleanOverride: ProductOverride = {
      nome: editForm.nome?.trim() || editingProduct.nome,
      sku: editForm.sku?.trim() || editingProduct.sku,
      marca_nome: (editForm.marca_nome?.trim() || editingProduct.marca_nome).toUpperCase(),
      categoria_nome: editForm.categoria_nome || editingProduct.categoria_nome,
      descricao_curta: editForm.descricao_curta?.trim() ?? editingProduct.descricao_curta,
      descricao_longa: editForm.descricao_longa?.trim() ?? editingProduct.descricao_longa,
      especificacoes: editForm.especificacoes?.trim() ?? editingProduct.especificacoes,
      imagem_url: editForm.imagem_url?.trim() || editingProduct.imagem_url,
      preco_por: precoPor,
      preco_de: precoDe,
      desconto_pix: Math.min(90, Math.max(0, Number(editForm.desconto_pix ?? 10))),
      max_parcelas: Math.min(24, Math.max(1, Number(editForm.max_parcelas ?? 12))),
      parcelas_sem_juros: Math.min(24, Math.max(1, Number(editForm.parcelas_sem_juros ?? 6))),
      lancamento: editForm.lancamento === 1 ? 1 : 0,
      oferta,
      estoque: Math.max(0, Number(editForm.estoque ?? editingProduct.estoque))
    };

    saveProductOverride(editingProduct.id, cleanOverride);
    setSavedFeedback(`Produto "${cleanOverride.nome}" atualizado com sucesso!`);
    setEditingProduct(null);
    setTimeout(() => setSavedFeedback(null), 4000);
  }

  function copyAdjustmentsReport() {
    const lines = Object.entries(overrides).map(([idStr, ov]) => {
      const orig = baseProducts.find((p) => p.id === Number(idStr));
      return [
        `ID ${ov.sku ?? orig?.sku} (${ov.nome ?? orig?.nome})`,
        `  Empresa/Marca: ${orig?.marca_nome} -> ${ov.marca_nome ?? orig?.marca_nome}`,
        `  Preço: ${orig?.preco_por} -> ${ov.preco_por ?? orig?.preco_por} (De: ${ov.preco_de ?? orig?.preco_de})`,
        `  Desconto Pix: ${ov.desconto_pix ?? 10}% | Parcelas: ${ov.max_parcelas ?? 12}x (${ov.parcelas_sem_juros ?? 6}x s/ juros)`,
        `  Lançamento: ${ov.lancamento ? "SIM" : "NÃO"} | Oferta: ${ov.oferta ? "SIM" : "NÃO"}`
      ].join("\n");
    });
    navigator.clipboard.writeText(lines.join("\n\n"));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  function downloadAdjustmentsJson() {
    const payload = Object.entries(overrides).map(([idStr, ov]) => {
      const orig = baseProducts.find((p) => p.id === Number(idStr));
      return {
        id: Number(idStr),
        sku_original: orig?.sku,
        slug: orig?.slug,
        alteracoes: ov
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
                  placeholder="Digite seu usuário (ex: nortemedica)"
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

  const uniqueBrandsList = Array.from(
    new Set([...allBrands.map((b) => b.nome), ...products.map((p) => p.marca_nome)])
  ).sort();

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.marca_nome.toLowerCase().includes(search.toLowerCase()) ||
      p.descricao_curta.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = !filterBrand || p.marca_nome === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const overrideCount = Object.keys(overrides).length;

  // Live preview calculations inside modal
  const previewPrecoPor = Math.max(0, Number(editForm.preco_por) || 0);
  const previewPrecoDe = Math.max(0, Number(editForm.preco_de) || 0);
  const previewDescontoPix = Math.min(90, Math.max(0, Number(editForm.desconto_pix ?? 10)));
  const previewMaxParcelas = Math.min(24, Math.max(1, Number(editForm.max_parcelas ?? 12)));
  const previewSemJuros = Math.min(
    previewMaxParcelas,
    Math.max(1, Number(editForm.parcelas_sem_juros ?? 6))
  );
  const previewPrecoPix = previewPrecoPor * (1 - previewDescontoPix / 100);
  const previewValorParcela = previewPrecoPor / previewMaxParcelas;
  const previewValorSemJuros = previewPrecoPor / previewSemJuros;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
      {/* Top Admin Bar */}
      <div className="bg-blue-950 text-white rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-3">
          <img src="/images/logo-white.png" alt="Nortemedica" className="h-8 w-auto" />
          <span className="text-xs bg-emerald-500 text-blue-950 font-black px-2.5 py-0.5 rounded uppercase">
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
            <Store className="w-3.5 h-3.5" /> Ver Loja
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

      {savedFeedback && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{savedFeedback}</span>
          </div>
          <button type="button" onClick={() => setSavedFeedback(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
              <div className="text-emerald-950">
                <strong>{overrideCount} produto(s) personalizado(s) no painel.</strong> As
                alterações já aparecem na vitrine e na página do produto neste navegador.
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyAdjustmentsReport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  {copiedReport ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedReport ? "Copiado!" : "Copiar Relatório de Ajustes"}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadAdjustmentsJson}
                  className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar JSON</span>
                </button>
                <button
                  type="button"
                  onClick={clearAllOverrides}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Todos</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Search & Brand Filter Bar */}
            <div className="p-4 border-b flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50/60">
              <div className="flex items-center gap-2.5 flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por nome, ID/SKU, empresa/marca ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-xs focus:outline-none bg-transparent"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="">Todas as Empresas / Marcas ({uniqueBrandsList.length})</option>
                {uniqueBrandsList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-[10px] uppercase text-slate-500 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4">Foto</th>
                    <th className="py-3 px-4">Produto / ID (SKU)</th>
                    <th className="py-3 px-4">Empresa (Marca)</th>
                    <th className="py-3 px-4">Destaques</th>
                    <th className="py-3 px-4">Preços / Pix / Parcelas</th>
                    <th className="py-3 px-4 text-right">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isModified = Boolean(overrides[p.id]);
                    const descPix = p.desconto_pix ?? SITE_CONFIG.descontoPixPercentual;
                    const maxParc = p.max_parcelas ?? SITE_CONFIG.maxParcelasCartao;
                    const pixPrice = p.preco_por * (1 - descPix / 100);
                    const isOferta =
                      p.oferta !== undefined ? p.oferta === 1 : p.preco_de > p.preco_por;
                    const isLancamento = p.lancamento === 1;

                    return (
                      <tr
                        key={p.id}
                        className={`transition ${
                          isModified ? "bg-emerald-50/50 hover:bg-emerald-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <img
                            src={p.imagem_url}
                            alt={p.nome}
                            className="w-12 h-12 object-contain rounded-xl border border-slate-200 p-1 bg-white"
                          />
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <Link
                            href={`/produto/${p.slug}`}
                            className="font-bold text-slate-800 hover:text-blue-900 line-clamp-1"
                          >
                            {p.nome}
                          </Link>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {p.descricao_curta}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {p.sku} • Estoque: {p.estoque} un.
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block bg-blue-50 text-blue-950 font-extrabold px-2.5 py-1 rounded-lg text-[11px] uppercase border border-blue-200">
                            {p.marca_nome}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {isLancamento && (
                              <span className="bg-blue-950 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                                Lançamento
                              </span>
                            )}
                            {isOferta && (
                              <span className="bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                                Oferta
                              </span>
                            )}
                            <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                              {descPix}% Pix
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isOferta && p.preco_de > p.preco_por && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              De {formatBRL(p.preco_de)}
                            </span>
                          )}
                          <span className="font-black text-emerald-600 text-sm block">
                            {formatBRL(pixPrice)}{" "}
                            <span className="text-[10px] font-bold">no Pix</span>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {formatBRL(p.preco_por)} em até {maxParc}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950 hover:bg-emerald-600 text-white font-bold transition shadow-sm"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            {isModified && (
                              <button
                                type="button"
                                onClick={() => resetProductOverride(p.id)}
                                title="Restaurar original deste produto"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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

      {/* MODAL DE EDIÇÃO COMPLETA E INTUITIVA DO PRODUTO */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Editar Produto"
        >
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-blue-950 flex items-center justify-center font-black">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-black text-sm sm:text-base">
                    Edição Rápida de Produto • ID {editForm.sku}
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Modifique empresa, nome, ID, imagem, desconto Pix, parcelamento, lançamento,
                    oferta e descrição
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/produto/${editingProduct.slug}`}
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl font-bold"
                >
                  <span>Abrir Página</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition"
                  aria-label="Fechar modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSaveModal}
              className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs"
            >
              {/* Left Column: Live Preview Card & Image Editor & Badges */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1-Click Badges Toggles (Lançamento & Oferta) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-black text-blue-950 uppercase tracking-wider text-[11px] block">
                    Tags e Destaques Visuais (1 Clique)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          lancamento: prev.lancamento === 1 ? 0 : 1
                        }))
                      }
                      className={`p-3 rounded-xl border-2 font-black flex items-center justify-between transition ${
                        editForm.lancamento === 1
                          ? "bg-blue-950 text-white border-blue-950 shadow-md"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>LANÇAMENTO</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          editForm.lancamento === 1
                            ? "bg-emerald-400 text-blue-950"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {editForm.lancamento === 1 ? "SIM" : "NÃO"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => {
                          const nextOferta = prev.oferta === 1 ? 0 : 1;
                          const curPor = Number(prev.preco_por) || 0;
                          const curDe = Number(prev.preco_de) || 0;
                          return {
                            ...prev,
                            oferta: nextOferta,
                            preco_de:
                              nextOferta === 1 && curDe <= curPor
                                ? Number((curPor * 1.15).toFixed(2))
                                : curDe
                          };
                        })
                      }
                      className={`p-3 rounded-xl border-2 font-black flex items-center justify-between transition ${
                        editForm.oferta === 1
                          ? "bg-red-600 text-white border-red-600 shadow-md"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-4 h-4" />
                        <span>OFERTA</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          editForm.oferta === 1
                            ? "bg-white text-red-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {editForm.oferta === 1 ? "SIM" : "NÃO"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Live Product Card Preview */}
                <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Pré-visualização em Tempo Real
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Atualiza ao digitar
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="relative bg-white p-4 border-b border-slate-100 flex items-center justify-center h-44 overflow-hidden">
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {editForm.lancamento === 1 && (
                          <span className="bg-blue-950 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                            Lançamento
                          </span>
                        )}
                        {editForm.oferta === 1 && (
                          <span className="badge-discount text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Oferta
                          </span>
                        )}
                      </div>

                      {previewDescontoPix > 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="badge-pix text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
                            {previewDescontoPix}% OFF PIX
                          </span>
                        </div>
                      )}

                      <img
                        src={editForm.imagem_url || "/images/icon.png"}
                        alt={editForm.nome || "Preview"}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-extrabold text-blue-950 uppercase tracking-wider truncate pr-2">
                          {editForm.marca_nome || "NORTEMEDICA"}
                        </span>
                        <span className="text-slate-400 font-mono">{editForm.sku}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-2">
                        {editForm.nome}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {editForm.descricao_curta}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        {editForm.oferta === 1 && previewPrecoDe > previewPrecoPor && (
                          <span className="text-slate-400 line-through text-[11px] block">
                            De {formatBRL(previewPrecoDe)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] font-semibold text-emerald-700">Por</span>
                          <span className="text-lg font-black text-emerald-600">
                            {formatBRL(previewPrecoPix)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">
                            no Pix
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          ou <strong>{formatBRL(previewPrecoPor)}</strong> em até{" "}
                          <strong>
                            {previewMaxParcelas}x de {formatBRL(previewValorParcela)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image URL & Upload */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="font-black text-blue-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-900" />
                    <span>Imagem do Produto</span>
                  </label>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">
                      Link / URL da Imagem:
                    </span>
                    <input
                      type="text"
                      value={editForm.imagem_url ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, imagem_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white hover:bg-blue-50 text-blue-950 border border-blue-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition shadow-2xs"
                    >
                      <Upload className="w-4 h-4 text-blue-900" />
                      <span>Enviar Nova Foto do Computador / Celular</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: All Fields (Identity, Company/Brand, Pricing, Pix Discount, Installments, Descriptions) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Block 1: Identificação & Empresa */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-black text-blue-950 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                    1. Identificação, ID e Empresa (Marca)
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.nome ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Empresa / Marca (ex: NEVONI) *
                      </label>
                      <input
                        type="text"
                        list="admin-brands-list"
                        required
                        value={editForm.marca_nome ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, marca_nome: e.target.value.toUpperCase() })
                        }
                        placeholder="Ex: NEVONI, PROTEC..."
                        className="w-full px-3 py-2.5 bg-white border border-blue-300 rounded-xl font-extrabold text-blue-950 uppercase focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />
                      <datalist id="admin-brands-list">
                        {uniqueBrandsList.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ID / Código (SKU) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.sku ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Estoque (Unidades)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editForm.estoque ?? 0}
                        onChange={(e) =>
                          setEditForm({ ...editForm, estoque: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Quick Brand Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">
                      Marcas frequentes:
                    </span>
                    {[
                      "NEVONI",
                      "PROTEC",
                      "H2M",
                      "MJV",
                      "SERCON",
                      "INSTRAMED",
                      "DELLAMED",
                      "BRASMEDICAL",
                      "NORTEMEDICA"
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, marca_nome: b })}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold border transition ${
                          editForm.marca_nome === b
                            ? "bg-blue-950 text-white border-blue-950"
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Block 2: Preços, Desconto Pix & Parcelamento */}
                <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-4">
                  <h3 className="font-black text-emerald-950 uppercase tracking-wider text-[11px] border-b border-emerald-200 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-700" />
                      <span>2. Preços, Desconto no Pix e Parcelamento</span>
                    </span>
                    <span className="text-emerald-700 font-black">
                      Pix Final: {formatBRL(previewPrecoPix)}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Preço Base / Cartão (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        required
                        value={editForm.preco_por ?? 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preco_por: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-black text-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Preço &ldquo;De&rdquo; Riscado (R$)</label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm({
                              ...editForm,
                              oferta: 1,
                              preco_de: Number((previewPrecoPor * 1.15).toFixed(2))
                            })
                          }
                          className="text-[10px] text-blue-900 font-bold hover:underline"
                        >
                          +15% auto
                        </button>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={editForm.preco_de ?? 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preco_de: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-emerald-900 mb-1">
                        Desconto no Pix (%)
                      </label>
                      <input
                        type="number"
                        step="1"
                        min={0}
                        max={90}
                        value={editForm.desconto_pix ?? 10}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            desconto_pix: Math.max(0, Math.min(90, parseFloat(e.target.value) || 0))
                          })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-emerald-400 rounded-xl font-black text-emerald-700 text-sm"
                      />
                      <div className="flex gap-1 mt-1.5">
                        {[0, 5, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, desconto_pix: pct })}
                            className={`flex-1 py-0.5 rounded text-[10px] font-bold border ${
                              previewDescontoPix === pct
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Installments Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-200/70">
                    <div>
                      <label className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-blue-900" />
                        <span>Parcelamento Máximo no Cartão</span>
                      </label>
                      <select
                        value={previewMaxParcelas}
                        onChange={(e) => {
                          const maxP = parseInt(e.target.value) || 12;
                          setEditForm((prev) => ({
                            ...prev,
                            max_parcelas: maxP,
                            parcelas_sem_juros: Math.min(maxP, prev.parcelas_sem_juros ?? 6)
                          }));
                        }}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 24].map((n) => (
                          <option key={n} value={n}>
                            Até {n}x de {formatBRL(previewPrecoPor / n)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Parcelas Sem Juros (na página do produto)
                      </label>
                      <select
                        value={previewSemJuros}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            parcelas_sem_juros: parseInt(e.target.value) || 1
                          })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                      >
                        {Array.from({ length: previewMaxParcelas }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            Até {n}x sem juros de {formatBRL(previewValorSemJuros)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Block 3: Descrições */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="font-black text-blue-950 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                    3. Descrições e Departamento
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Departamento / Categoria
                    </label>
                    <select
                      value={editForm.categoria_nome ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, categoria_nome: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-800"
                    >
                      {allCategories.map((c) => (
                        <option key={c.id} value={c.nome}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Descrição Curta (exibida no card e abaixo do título)
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.descricao_curta ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, descricao_curta: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Descrição Completa (Visão Geral na página do produto)
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.descricao_longa ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, descricao_longa: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ficha Técnica / Especificações
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.especificacoes ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, especificacoes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px] text-slate-700"
                    />
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider shadow-lg transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações no Produto</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
