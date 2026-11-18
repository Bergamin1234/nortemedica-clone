import catalogRaw from "@/data/catalog.json";
import type { Brand, Category, Product } from "./types";

interface CatalogData {
  categorias: Category[];
  marcas: Brand[];
  produtos: Product[];
}

const catalog = catalogRaw as CatalogData;

export function getAllCategories(): Category[] {
  return catalog.categorias;
}

export function getAllBrands(): Brand[] {
  return catalog.marcas;
}

export function getAllProducts(): Product[] {
  return catalog.produtos;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return catalog.categorias.find((c) => c.slug === slug);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return catalog.marcas.find((m) => m.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return catalog.produtos.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = catalog.produtos.filter(
    (p) => p.categoria_id === product.categoria_id && p.id !== product.id
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const others = catalog.produtos.filter(
    (p) => p.categoria_id !== product.categoria_id && p.id !== product.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function filterProducts(params: {
  categoria?: string;
  marca?: string;
  busca?: string;
}): Product[] {
  let items = catalog.produtos;

  if (params.categoria) {
    items = items.filter((p) => p.categoria_slug === params.categoria);
  }

  if (params.marca) {
    items = items.filter((p) => p.marca_slug === params.marca);
  }

  if (params.busca && params.busca.trim().length > 0) {
    const q = params.busca
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    items = items.filter((p) => {
      const hay = `${p.nome} ${p.sku} ${p.marca_nome} ${p.categoria_nome} ${p.descricao_curta}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return hay.includes(q);
    });
  }

  return items;
}

export function searchProductsQuick(query: string, limit = 8): Product[] {
  if (!query || query.trim().length < 2) return [];
  return filterProducts({ busca: query }).slice(0, limit);
}
