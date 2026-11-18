import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.nome} | Equipamentos Médicos e Hospitalares`,
    template: `%s | ${SITE_CONFIG.nomeCurto}`
  },
  description: SITE_CONFIG.slogan,
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col justify-between text-slate-800 antialiased`}>
        <CartProvider>
          <Header />
          <CartDrawer />
          {children}
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
