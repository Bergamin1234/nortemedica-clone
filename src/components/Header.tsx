import Link from "next/link";
import {
  ChevronDown,
  FileText,
  MapPin,
  Menu,
  MessageCircle,
  Percent,
  Phone,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { getAllCategories } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/constants";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { CategoryIcon } from "./CategoryIcon";

export function Header() {
  const categories = getAllCategories();
  const topCategories = categories.slice(0, 5);

  return (
    <>
      {/* Top Bar Institucional */}
      <div className="bg-blue-950 text-slate-300 text-xs py-2 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              {SITE_CONFIG.telefone}
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              Televendas &amp; Cotações
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
              Porto Velho - RO / Atendimento Nacional
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 text-emerald-400 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              WhatsApp Comercial
            </a>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <Link href="/sobre" className="hover:text-white transition">
              Quem Somos
            </Link>
            <Link href="/contato" className="hover:text-white transition">
              Licitações &amp; Contato
            </Link>
            <Link
              href="/admin"
              className="hover:text-emerald-400 transition font-medium flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Official Logo */}
            <Link href="/" className="flex items-center group shrink-0 py-0.5">
              <img
                src="/images/logo.png"
                alt="Nortemedica"
                className="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:opacity-95 transition"
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden sm:flex flex-1 max-w-2xl">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 md:space-x-6 shrink-0">
              <Link
                href="/contato"
                className="hidden xl:flex items-center space-x-2 text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-blue-900 flex items-center justify-center transition">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block leading-tight">Faturamento PJ</span>
                  <strong className="text-slate-800 group-hover:text-blue-900">
                    Solicitar Cotação
                  </strong>
                </div>
              </Link>

              <CartButton />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 sm:hidden">
            <SearchBar mobile />
          </div>
        </div>

        {/* Navigation Bar */}
        <nav aria-label="Departamentos médicos" className="bg-blue-950 text-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* All Departments Dropdown */}
            <div className="relative group py-3 pr-6 border-r border-blue-900">
              <button
                type="button"
                className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
              >
                <Menu className="w-4 h-4" aria-hidden="true" />
                <span>Departamentos</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full w-72 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-[70vh] overflow-y-auto">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?categoria=${cat.slug}#catalogo-produtos`}
                    className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 text-xs font-medium text-slate-700 hover:text-blue-950"
                  >
                    <CategoryIcon name={cat.icone} className="w-4 h-4 text-blue-900 shrink-0" />
                    <span>{cat.nome}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Category Links */}
            <div className="hidden lg:flex items-center space-x-6 text-xs font-medium overflow-x-auto py-3">
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?categoria=${cat.slug}#catalogo-produtos`}
                  className="text-slate-200 hover:text-emerald-400 whitespace-nowrap transition"
                >
                  {cat.nome}
                </Link>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="hidden md:flex items-center space-x-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                Compra 100% Segura
              </span>
              <span className="text-slate-600" aria-hidden="true">|</span>
              <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                <Percent className="w-3.5 h-3.5" aria-hidden="true" />
                10% OFF no Pix
              </span>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
