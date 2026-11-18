import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatBRL, getPixPrice, SITE_CONFIG } from "@/lib/constants";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const precoPor = product.preco_por;
  const precoDe = product.preco_de;
  const precoPix = getPixPrice(precoPor);
  const parcelaValor = precoPor / SITE_CONFIG.maxParcelasCartao;

  return (
    <article className="product-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm relative group">
      {/* Image & Badges */}
      <div className="relative bg-white p-4 border-b border-slate-100 flex items-center justify-center h-56 overflow-hidden">
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.lancamento === 1 && (
            <span className="bg-blue-950 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              Lançamento
            </span>
          )}
          {precoDe > precoPor && (
            <span className="badge-discount text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Oferta
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="badge-pix text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
            10% OFF PIX
          </span>
        </div>

        <Link
          href={`/produto/${product.slug}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={product.imagem_url}
            alt={product.nome}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-extrabold text-blue-950 uppercase tracking-wider truncate pr-2">
              {product.marca_nome || "Norte Médica"}
            </span>
            <span className="text-slate-400 font-mono shrink-0">{product.sku}</span>
          </div>

          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 hover:text-blue-950 transition">
            <Link href={`/produto/${product.slug}`}>{product.nome}</Link>
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.descricao_curta}</p>
        </div>

        {/* Prices */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {precoDe > precoPor && (
            <span className="text-slate-400 line-through text-xs block">
              De {formatBRL(precoDe)}
            </span>
          )}

          <div className="flex items-baseline space-x-1.5">
            <span className="text-xs font-semibold text-emerald-700">Por</span>
            <span className="text-xl font-black text-emerald-600">{formatBRL(precoPix)}</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">no Pix</span>
          </div>

          <div className="text-[11px] text-slate-600 mt-0.5">
            ou <strong>{formatBRL(precoPor)}</strong> em até{" "}
            <strong>12x de {formatBRL(parcelaValor)}</strong>
          </div>

          <div className="mt-4 flex gap-2">
            <AddToCartButton product={product} />
            <Link
              href={`/produto/${product.slug}`}
              aria-label={`Ver detalhes de ${product.nome}`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs flex items-center justify-center transition"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
