"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBRL, getPixPrice } from "@/lib/constants";

export function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data: Product[] = await res.json();
          setResults(data);
          setOpen(true);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    setOpen(false);
    if (trimmed) {
      router.push(`/?busca=${encodeURIComponent(trimmed)}#catalogo-produtos`);
    } else {
      router.push("/");
    }
  }

  return (
    <div ref={containerRef} className={mobile ? "relative w-full" : "flex-1 max-w-2xl relative"}>
      <form onSubmit={handleSubmit} role="search" aria-label="Buscar produtos hospitalares">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={
              mobile
                ? "Buscar produtos médicos..."
                : "Buscar por produto, marca ou código hospitalar (ex: monitor, autoclave, DEA)..."
            }
            aria-label="Buscar produtos"
            className={
              mobile
                ? "w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                : "w-full pl-11 pr-24 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition"
            }
          />
          <div
            className={
              mobile
                ? "absolute left-3 top-2.5 text-slate-400 pointer-events-none"
                : "absolute left-4 top-3 text-slate-400 pointer-events-none"
            }
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          {!mobile && (
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow-sm"
            >
              Buscar
            </button>
          )}
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-xs text-slate-400 text-center">Buscando no catálogo...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center">
              Nenhum produto hospitalar encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              <div className="p-2.5 border-b bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Produtos encontrados</span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-blue-900 hover:underline normal-case font-semibold"
                >
                  Ver todos os resultados
                </button>
              </div>
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 p-2.5 hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                >
                  <img
                    src={p.imagem_url}
                    alt={p.nome}
                    className="w-11 h-11 object-contain rounded border border-slate-200 bg-white p-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-blue-900 font-bold uppercase">
                      {p.marca_nome || "Nortemedica"}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">{p.nome}</div>
                    <div className="text-xs font-bold text-emerald-600">
                      {formatBRL(getPixPrice(p.preco_por))}{" "}
                      <span className="text-[10px] font-normal text-slate-500">no Pix</span>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
