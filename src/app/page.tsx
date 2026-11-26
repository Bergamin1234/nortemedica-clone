import Link from "next/link";
import {
  ArrowDown,
  Award,
  ChevronRight,
  CreditCard,
  Headphones,
  MessageCircle,
  PackageOpen,
  QrCode,
  Tag,
  Truck,
  Wrench,
  X
} from "lucide-react";
import {
  filterProducts,
  getAllBrands,
  getAllCategories,
  getBrandBySlug,
  getCategoryBySlug
} from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";

interface HomeProps {
  searchParams: Promise<{
    categoria?: string;
    marca?: string;
    busca?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const catSlug = params.categoria || "";
  const marcaSlug = params.marca || "";
  const busca = params.busca || "";

  const categories = getAllCategories();
  const brands = getAllBrands();
  const products = filterProducts({ categoria: catSlug, marca: marcaSlug, busca });

  const activeCategory = catSlug ? getCategoryBySlug(catSlug) : undefined;
  const activeBrand = marcaSlug ? getBrandBySlug(marcaSlug) : undefined;
  const hasFilters = Boolean(catSlug || marcaSlug || busca);

  return (
    <div className="flex-1">
      {!hasFilters && (
        <>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white overflow-hidden py-12 md:py-20 border-b border-blue-900">
            <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-800/80 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-blue-700 shadow-sm">
                  <Award className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>DISTRIBUIDOR AUTORIZADO DE MARCAS LÍDERES</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Equipamentos e Insumos <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                    Médico-Hospitalares
                  </span>
                </h1>

                <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                  Fornecendo alta tecnologia para UTIs, centros cirúrgicos, clínicas e hospitais em
                  Rondônia e em todo o Brasil. Catálogo completo com pronta entrega e engenharia
                  clínica autorizada.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#catalogo-produtos"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs md:text-sm shadow-lg transition flex items-center gap-2"
                  >
                    <span>Ver Catálogo Completo ({products.length} itens)</span>
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs md:text-sm shadow-lg transition flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Cotação no WhatsApp</span>
                  </a>
                </div>

                <div className="pt-6 border-t border-blue-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Fabricantes:
                  </span>
                  {["INSTRAMED", "SERCON", "MAGNAMED", "PROTEC", "WELMY", "MINDRAY"].map((b) => (
                    <span
                      key={b}
                      className="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md p-3 rounded-3xl border border-white/20 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                    alt="Monitores e equipamentos de UTI"
                    className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                  />
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Linha Hospitalar &amp; UTI
                    </span>
                    <h2 className="font-bold text-white text-base">
                      Monitores, Desfibriladores e Autoclaves
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Produtos certificados com garantia de fábrica e suporte técnico especializado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Commercial Highlights */}
          <section className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <QrCode className="w-7 h-7 text-emerald-600 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <strong className="text-slate-800 block font-bold">Pagamento Rápido no PIX</strong>
                  <span className="text-slate-500">Aprovação imediata à vista</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CreditCard className="w-7 h-7 text-blue-900 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <strong className="text-slate-800 block font-bold">Até 12x no Cartão</strong>
                  <span className="text-slate-500">Parcelamento facilitado</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-7 h-7 text-red-600 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <strong className="text-slate-800 block font-bold">Frete Grátis</strong>
                  <span className="text-slate-500">Compras acima de R$ 1.500</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Wrench className="w-7 h-7 text-amber-500 shrink-0" aria-hidden="true" />
                <div className="text-xs">
                  <strong className="text-slate-800 block font-bold">Assistência Própria</strong>
                  <span className="text-slate-500">Engenharia clínica em RO</span>
                </div>
              </div>
            </div>
          </section>

          {/* Departments Grid */}
          <section className="max-w-7xl mx-auto px-4 pt-12 pb-4">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-black text-blue-950">
                Departamentos Médicos
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Explore nossas {categories.length} linhas de equipamentos e suprimentos para saúde
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?categoria=${cat.slug}#catalogo-produtos`}
                  className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-900 transition flex flex-col items-center text-center"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-900 text-blue-950 group-hover:text-white flex items-center justify-center transition mb-2.5">
                    <CategoryIcon name={cat.icone} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-950 leading-tight">
                    {cat.nome}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Main Catalog */}
      <main id="catalogo-produtos" className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
              <Link href="/" className="hover:text-blue-950 font-medium">
                Início
              </Link>
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
              <span className="text-slate-700 font-bold">
                {activeCategory
                  ? activeCategory.nome
                  : busca
                    ? `Resultados para "${busca}"`
                    : activeBrand
                      ? `Marca: ${activeBrand.nome}`
                      : "Catálogo Completo"}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-blue-950">
              {activeCategory
                ? activeCategory.nome
                : busca
                  ? `Busca: ${busca}`
                  : activeBrand
                    ? `Produtos ${activeBrand.nome}`
                    : "Produtos e Equipamentos em Destaque"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exibindo <strong>{products.length}</strong> produtos com garantia e nota fiscal
            </p>
          </div>

          {hasFilters && (
            <Link
              href="/#catalogo-produtos"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpar Filtros</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Categorias
              </h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/#catalogo-produtos"
                    className={`flex items-center justify-between py-1.5 px-2 rounded-lg font-medium ${
                      !catSlug
                        ? "bg-blue-950 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Todos os Departamentos</span>
                    <ChevronRight className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/?categoria=${cat.slug}#catalogo-produtos`}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg font-medium ${
                        catSlug === cat.slug
                          ? "bg-blue-950 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{cat.nome}</span>
                      <ChevronRight className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Marcas ({brands.length})</span>
                <Tag className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </h3>
              <ul className="space-y-1 text-xs max-h-80 overflow-y-auto pr-1">
                {brands.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/?marca=${m.slug}${catSlug ? `&categoria=${catSlug}` : ""}#catalogo-produtos`}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg font-medium ${
                        marcaSlug === m.slug
                          ? "bg-blue-950 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate">{m.nome}</span>
                      <ChevronRight className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm text-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="font-bold text-sm text-white">
                Cotação para hospitais ou licitações?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Preparamos orçamentos formais com faturamento PJ e prazos adaptados à sua
                instituição.
              </p>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-center shadow transition"
              >
                Falar com Especialista
              </a>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageOpen className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Nenhum produto encontrado</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Não encontramos itens com os filtros atuais. Limpe a busca para visualizar todo o
                  catálogo.
                </p>
                <Link
                  href="/#catalogo-produtos"
                  className="inline-block bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
