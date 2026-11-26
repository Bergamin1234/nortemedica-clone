import Link from "next/link";
import {
  CreditCard,
  FileSignature,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Truck,
  Wrench
} from "lucide-react";
import { getAllCategories } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const categories = getAllCategories().slice(0, 7);

  return (
    <footer className="bg-blue-950 text-slate-300 mt-16 border-t-4 border-emerald-500">
      {/* Trust Strip */}
      <div className="border-b border-blue-900/80 bg-blue-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-emerald-400 flex items-center justify-center shrink-0 shadow">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Entrega Especializada</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Logística para cargas médicas e sensíveis em todo o Brasil.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-yellow-400 flex items-center justify-center shrink-0 shadow">
              <FileSignature className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Faturamento Direto PJ</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Condições especiais para clínicas, hospitais e licitações.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-emerald-400 flex items-center justify-center shrink-0 shadow">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Assistência Técnica</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Engenharia clínica autorizada com peças originais de fábrica.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-red-400 flex items-center justify-center shrink-0 shadow">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Compra 100% Segura</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ambiente protegido com criptografia SSL de ponta a ponta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        <div className="space-y-4">
          <img
            src="/images/logo-white.png"
            alt="Nortemedica"
            className="h-9 w-auto object-contain"
          />
          <p className="text-slate-400 leading-relaxed">
            Desde 2004 sendo referência no comércio atacadista de materiais, equipamentos
            médico-hospitalares, cirúrgicos e laboratoriais na Região Norte e no Brasil.
          </p>
          <div className="pt-2">
            <span className="block font-semibold text-white mb-1">Horário de Atendimento:</span>
            <span className="text-slate-400">
              Segunda a Sexta: 08:00 às 18:00 (Horário de Rondônia)
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Departamentos
          </h4>
          <ul className="space-y-2 text-slate-400">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/?categoria=${cat.slug}#catalogo-produtos`}
                  className="hover:text-white transition"
                >
                  {cat.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
            Institucional
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <Link href="/sobre" className="hover:text-white transition">
                Quem Somos
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-white transition">
                Licitações &amp; Pregões Públicos
              </Link>
            </li>
            <li>
              <Link href="/sobre#assistencia" className="hover:text-white transition">
                Assistência Técnica Autorizada
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-white transition">
                Fale Conosco / Televendas
              </Link>
            </li>
            <li>
              <Link href="/carrinho" className="hover:text-white transition">
                Meu Carrinho
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-emerald-400 font-semibold transition">
                Painel Administrativo
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Atendimento &amp; Sede
          </h4>
          <p className="text-slate-400 flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{SITE_CONFIG.endereco}</span>
          </p>
          <p className="text-slate-400 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{SITE_CONFIG.telefone}</span>
          </p>
          <p className="text-slate-400 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
            <span>{SITE_CONFIG.email}</span>
          </p>
          <p className="text-slate-400 flex items-center space-x-2">
            <IdCard className="w-4 h-4 text-yellow-400 shrink-0" aria-hidden="true" />
            <span>CNPJ: {SITE_CONFIG.cnpj}</span>
          </p>

          <div className="pt-4 border-t border-blue-900">
            <span className="block font-semibold text-white mb-2">Formas de Pagamento:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="bg-blue-900/80 px-2.5 py-1 rounded text-emerald-400 font-bold flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" aria-hidden="true" /> PIX à Vista
              </span>
              <span className="bg-blue-900/80 px-2.5 py-1 rounded text-white flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" aria-hidden="true" /> Cartão até 12x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-blue-950/90 border-t border-blue-900 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} Nortemedica Comércio e Representações Ltda. Todos os
            direitos reservados.
          </div>
          <div className="text-[11px] text-emerald-400">
            Next.js + TypeScript + Tailwind CSS • Deploy Produção Vercel
          </div>
        </div>
      </div>
    </footer>
  );
}
