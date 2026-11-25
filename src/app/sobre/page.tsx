import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronRight, Eye, MessageCircle, ShieldCheck, Target } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Quem Somos e Assistência Técnica",
  description: "História da Nortemedica, distribuidora hospitalar, cirúrgica e engenharia clínica em Porto Velho - RO."
};

export default function SobrePage() {
  return (
    <div className="flex-1">
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
          <Link href="/" className="hover:text-blue-950 font-medium">
            Início
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span className="text-slate-800 font-bold">Quem Somos</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Desde 2004 em Porto Velho - RO
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-blue-950 tracking-tight">
            Nortemedica Comércio e Representações
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Distribuidora especializada em equipamentos médico-hospitalares, cirúrgicos e
            laboratoriais de alta precisão para a Região Norte e todo o Brasil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Target className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Nossa Missão</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fornecer tecnologias de suporte à vida e diagnóstico com confiabilidade, atendendo
              hospitais, clínicas e profissionais com agilidade e rigor técnico.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Eye className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Nossa Visão</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ser a referência líder em distribuição hospitalar e engenharia clínica autorizada em
              toda a Região Norte e no mercado nacional.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Nossos Valores</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conformidade ANVISA/INMETRO, transparência em licitações públicas e privadas, e
              compromisso permanente com o cuidado à vida.
            </p>
          </div>
        </div>

        <section
          id="assistencia"
          className="bg-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Engenharia Clínica Especializada
            </span>
            <h2 className="text-2xl md:text-3xl font-black">Assistência Técnica Autorizada</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Realizamos manutenções preventivas, corretivas e calibrações com padrões rastreáveis
              RBC/INMETRO para hospitais, clínicas e laboratórios.
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Peças originais de
                fábrica
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Laudos e
                certificados de calibração
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Suporte dedicado
                para UTI e centro cirúrgico
              </li>
            </ul>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Falar com Engenharia Clínica</span>
            </a>
          </div>

          <div className="bg-blue-900/60 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">
              Principais Marcas Atendidas
            </h3>
            <div className="grid grid-cols-2 gap-3 font-semibold text-slate-200">
              {["INSTRAMED", "SERCON", "MAGNAMED", "PROTEC", "WELMY", "MINDRAY"].map((b) => (
                <div
                  key={b}
                  className="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center"
                >
                  {b}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-[11px] text-center pt-2">{SITE_CONFIG.endereco}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
