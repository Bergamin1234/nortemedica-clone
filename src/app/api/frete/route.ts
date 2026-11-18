import { NextRequest, NextResponse } from "next/server";
import { calculateShippingOptions } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const cep = (request.nextUrl.searchParams.get("cep") || "").replace(/\D/g, "");
  const subtotal = parseFloat(request.nextUrl.searchParams.get("subtotal") || "0") || 0;

  if (cep.length !== 8) {
    return NextResponse.json(
      { success: false, message: "CEP inválido. Digite 8 números." },
      { status: 400 }
    );
  }

  const opcoes = calculateShippingOptions(cep, subtotal);
  return NextResponse.json({ success: true, cep, opcoes });
}
