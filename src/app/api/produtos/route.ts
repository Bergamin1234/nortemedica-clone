import { NextRequest, NextResponse } from "next/server";
import { searchProductsQuick } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const results = searchProductsQuick(q, 8);
  return NextResponse.json(results);
}
