"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContatoPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex-1">
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
          <Link href="/" className="hover:text-blue-950 font-medium">
            Início
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span className="text-slate-800 font-bold">Fale Conosco &amp; Licitações</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-blue-950">Atendimento Especializado</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Solicite cotações corporativas para hospitais, clínicas, consultórios e editais de
            licitação pública.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-8 rounded-3xl text-center max-w-md mx-auto space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-lg">Solicitação Enviada!</h2>
            <p className="text-xs">
              Nossa equipe comercial retornará no seu e-mail ou WhatsApp em breve.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Voltar para a Loja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-black text-blue-950 mb-1">Solicitar Cotação</h2>
              <p className="text-xs text-slate-400 mb-6">
                Preencha os dados para receber proposta formal com prazos e condições PJ.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nome / Razão Social *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CPF ou CNPJ *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Lista de Produtos ou Mensagem *
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-blue-900 text-white font-extrabold py-3.5 px-6 rounded-xl transition shadow flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Enviar Solicitação</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
                <h3 className="font-black text-blue-950 text-sm uppercase tracking-wider border-b pb-3">
                  Canais Diretos
                </h3>
                <div className="space-y-3 text-slate-600">
                  <p className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-900 shrink-0" /> {SITE_CONFIG.telefone}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-red-600 shrink-0" /> {SITE_CONFIG.email}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" /> Licitações:{" "}
                    {SITE_CONFIG.emailLicitacao}
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />{" "}
                    {SITE_CONFIG.endereco}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Conversa no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
