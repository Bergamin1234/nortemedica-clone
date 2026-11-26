"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product, ProductOverride } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/constants";

const OVERRIDES_KEY = "nortemedica_product_overrides";

interface CatalogOverridesContextValue {
  overrides: Record<number, ProductOverride>;
  applyProductOverride: (product: Product) => Product;
  saveProductOverride: (id: number, override: ProductOverride) => void;
  resetProductOverride: (id: number) => void;
  clearAllOverrides: () => void;
}

const CatalogOverridesContext = createContext<CatalogOverridesContextValue | null>(null);

export function mergeProductWithOverride(product: Product, ov?: ProductOverride): Product {
  const baseSobConsulta = Boolean(product.sob_consulta || product.preco_por <= 0);
  const baseOferta = !baseSobConsulta && product.preco_de > product.preco_por ? 1 : 0;

  if (!ov) {
    return {
      ...product,
      sob_consulta: baseSobConsulta,
      oferta: product.oferta ?? baseOferta,
      desconto_pix: product.desconto_pix ?? SITE_CONFIG.descontoPixPercentual,
      max_parcelas: product.max_parcelas ?? SITE_CONFIG.maxParcelasCartao,
      parcelas_sem_juros: product.parcelas_sem_juros ?? SITE_CONFIG.parcelasSemJuros
    };
  }

  const precoPor = ov.preco_por !== undefined ? ov.preco_por : product.preco_por;
  const precoDe = ov.preco_de !== undefined ? ov.preco_de : product.preco_de;
  const sobConsulta =
    ov.sob_consulta !== undefined ? ov.sob_consulta : precoPor <= 0 ? true : baseSobConsulta;
  const oferta = sobConsulta
    ? 0
    : ov.oferta !== undefined
      ? ov.oferta
      : precoDe > precoPor
        ? 1
        : 0;

  // If admin changed preco_por or max_parcelas manually, recalculate valor_parcela cleanly unless explicitly overridden
  const maxParcelas =
    ov.max_parcelas !== undefined
      ? ov.max_parcelas
      : (product.max_parcelas ?? SITE_CONFIG.maxParcelasCartao);
  const priceOrInstallmentsChanged =
    (ov.preco_por !== undefined && ov.preco_por !== product.preco_por) ||
    (ov.max_parcelas !== undefined && ov.max_parcelas !== product.max_parcelas);

  const valorParcela =
    ov.valor_parcela !== undefined
      ? ov.valor_parcela
      : priceOrInstallmentsChanged
        ? precoPor / Math.max(1, maxParcelas)
        : (product.valor_parcela ?? precoPor / Math.max(1, maxParcelas));

  const comJuros =
    ov.com_juros !== undefined
      ? ov.com_juros
      : priceOrInstallmentsChanged
        ? false
        : Boolean(product.com_juros);

  return {
    ...product,
    nome: ov.nome !== undefined ? ov.nome : product.nome,
    sku: ov.sku !== undefined ? ov.sku : product.sku,
    marca_nome: ov.marca_nome !== undefined ? ov.marca_nome : product.marca_nome,
    categoria_nome: ov.categoria_nome !== undefined ? ov.categoria_nome : product.categoria_nome,
    descricao_curta:
      ov.descricao_curta !== undefined ? ov.descricao_curta : product.descricao_curta,
    descricao_longa:
      ov.descricao_longa !== undefined ? ov.descricao_longa : product.descricao_longa,
    especificacoes: ov.especificacoes !== undefined ? ov.especificacoes : product.especificacoes,
    imagem_url: ov.imagem_url !== undefined ? ov.imagem_url : product.imagem_url,
    preco_por: precoPor,
    preco_de: precoDe,
    sob_consulta: sobConsulta,
    desconto_pix:
      ov.desconto_pix !== undefined
        ? ov.desconto_pix
        : (product.desconto_pix ?? SITE_CONFIG.descontoPixPercentual),
    max_parcelas: maxParcelas,
    valor_parcela: valorParcela,
    com_juros: comJuros,
    parcelas_sem_juros:
      ov.parcelas_sem_juros !== undefined
        ? ov.parcelas_sem_juros
        : (product.parcelas_sem_juros ?? SITE_CONFIG.parcelasSemJuros),
    lancamento: ov.lancamento !== undefined ? ov.lancamento : product.lancamento,
    oferta,
    estoque: ov.estoque !== undefined ? ov.estoque : product.estoque
  };
}

export function CatalogOverridesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<number, ProductOverride>>({});

  useEffect(() => {
    function loadFromStorage() {
      try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            setOverrides(parsed);
          }
        }
      } catch {
        // ignore
      }
    }
    loadFromStorage();
    window.addEventListener("storage", loadFromStorage);
    return () => window.removeEventListener("storage", loadFromStorage);
  }, []);

  const applyProductOverride = useCallback(
    (product: Product): Product => {
      return mergeProductWithOverride(product, overrides[product.id]);
    },
    [overrides]
  );

  const saveProductOverride = useCallback((id: number, override: ProductOverride) => {
    setOverrides((prev) => {
      const updated = { ...prev, [id]: override };
      try {
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const resetProductOverride = useCallback((id: number) => {
    setOverrides((prev) => {
      const updated = { ...prev };
      delete updated[id];
      try {
        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearAllOverrides = useCallback(() => {
    setOverrides({});
    try {
      localStorage.removeItem(OVERRIDES_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CatalogOverridesContext.Provider
      value={{
        overrides,
        applyProductOverride,
        saveProductOverride,
        resetProductOverride,
        clearAllOverrides
      }}
    >
      {children}
    </CatalogOverridesContext.Provider>
  );
}

export function useCatalogOverrides() {
  const ctx = useContext(CatalogOverridesContext);
  if (!ctx) {
    throw new Error("useCatalogOverrides deve ser usado dentro de CatalogOverridesProvider");
  }
  return ctx;
}
