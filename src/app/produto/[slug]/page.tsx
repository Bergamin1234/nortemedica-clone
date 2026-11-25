import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Receipt,
  ShieldCheck
} from "lucide-react";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatBRL, getPixPrice, SITE_CONFIG } from "@/lib/constants";
import { ProductBuyActions } from "@/components/ProductBuyActions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };

  return {
    title: product.nome,
    description: product.descricao_curta,
    openGraph: {
      title: product.nome,
      description: product.descricao_curta,
      images: [product.imagem_url]
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const precoPor = product.preco_por;
  const precoDe = product.preco_de;
  const precoPix = getPixPrice(precoPor);
  const parcela12 = precoPor / SITE_CONFIG.maxParcelasCartao;
  const parcela6 = precoPor / SITE_CONFIG.parcelasSemJuros;
  const related = getRelatedProducts(product, 4);

  return (
    <div className="flex-1">
      {/* Breadcrumbs */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-950 font-medium">
            Início
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
          <Link
            href={`/?categoria=${product.categoria_slug}#catalogo-produtos`}
            className="hover:text-blue-950 font-medium"
          >
            {product.categoria_nome}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="text-slate-800 font-bold truncate max-w-xs md:max-w-md">
            {product.nome}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Block */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Image */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full h-80 sm:h-96 md:h-[440px] bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
              {precoDe > precoPor && (
                <span className="absolute top-4 left-4 badge-discount text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Oferta Especial
                </span>
              )}
              <span className="absolute top-4 right-4 badge-pix text-white font-black text-xs px-3 py-1 rounded-full shadow">
                10% OFF no PIX
              </span>
              <img
                src={product.imagem_url}
                alt={product.nome}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-900" aria-hidden="true" /> Registro ANVISA
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" /> Garantia 12
                Meses
              </span>
              <span className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-amber-500" aria-hidden="true" /> Nota Fiscal
                Eletrônica
              </span>
            </div>
          </div>

          {/* Info & Buy Box */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="bg-blue-950 text-white font-extrabold px-3 py-1 rounded-md uppercase tracking-wider text-[11px]">
                  {product.marca_nome || "Nortemedica"}
                </span>
                <span className="text-slate-400 font-mono">Código: {product.sku}</span>
                <span className="text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Em Estoque
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-blue-950 leading-tight">
                {product.nome}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.descricao_curta}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
              {precoDe > precoPor && (
                <span className="text-xs text-slate-400 line-through block">
                  De {formatBRL(precoDe)}
                </span>
              )}

              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold text-emerald-700">Por</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                  {formatBRL(precoPix)}
                </span>
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                  à vista no Pix (10% OFF)
                </span>
              </div>

              <div className="text-xs text-slate-600">
                ou <strong>{formatBRL(precoPor)}</strong> em até{" "}
                <strong>12x de {formatBRL(parcela12)}</strong> (até 6x sem juros de{" "}
                {formatBRL(parcela6)}).
              </div>
            </div>

            <ProductBuyActions product={product} />
          </div>
        </div>

        {/* Technical Specifications */}
        <section className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-black text-blue-950 flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Especificações Técnicas e Descrição
            </h2>
          </div>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Visão Geral</h3>
              <p className="whitespace-pre-line">{product.descricao_longa}</p>
            </div>

            {product.especificacoes && (
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-3">
                  Ficha Técnica e Parâmetros
                </h3>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed">
                  {product.especificacoes}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Garantia e Assistência Técnica
              </h3>
              <p>
                Todos os equipamentos acompanham Certificado de Garantia oficial, manual em
                português e Nota Fiscal eletrônica. Suporte completo de Engenharia Clínica em Porto
                Velho/RO.
              </p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-black text-blue-950 mb-6">
              Equipamentos e Acessórios Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/produto/${rel.slug}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div className="h-40 bg-white rounded-xl p-3 flex items-center justify-center mb-3 border border-slate-100">
                    <img
                      src={rel.imagem_url}
                      alt={rel.nome}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-900 uppercase block">
                      {rel.marca_nome}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">
                      {rel.nome}
                    </h3>
                    <div className="text-sm font-black text-emerald-600 mt-2">
                      {formatBRL(getPixPrice(rel.preco_por))}{" "}
                      <span className="text-[10px] font-normal text-slate-500">no Pix</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
