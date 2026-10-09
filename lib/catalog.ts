import raw from '@/data/catalog.json';

export type Variant = {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  createdAt: string;
  description: string[];
  options: { name: string; values: string[] }[];
  images: string[];
  variants: Variant[];
  collections: string[];
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  browsable: boolean;
  productCount: number;
};

type Catalog = {
  exportedAt: string;
  shop: {
    name: string;
    url: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    policies: { title: string; url: string }[];
  };
  collections: Collection[];
  products: Product[];
};

const catalog = raw as Catalog;

export const shop = catalog.shop;
export const exportedAt = catalog.exportedAt;
export const products = catalog.products;
export const collections = catalog.collections;
export const browsableCollections = collections.filter((c) => c.browsable);

const byHandle = new Map(products.map((p) => [p.handle, p]));
const variantIndex = new Map(
  products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)),
);

export const getProduct = (handle: string) => byHandle.get(handle);
export const getCollection = (handle: string) => collections.find((c) => c.handle === handle);
export const getVariant = (variantId: string) => variantIndex.get(variantId);

export const productsInCollection = (handle: string) =>
  handle === 'all' ? products : products.filter((p) => p.collections.includes(handle));

export const featuredProducts = productsInCollection('frontpage');

export const newArrivals = [...products]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 10);

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.title.toLowerCase().includes(q));
}

export function priceRange(p: Product) {
  const prices = p.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// "From" price shown on cards: the cheapest single-piece variant.
export function startingPrice(p: Product) {
  const base = p.variants[0];
  return { price: priceRange(p).min, compareAtPrice: base?.compareAtPrice ?? null };
}

export const isSoldOut = (p: Product) => p.variants.every((v) => !v.available);

export function formatPrice(amount: number) {
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${shop.currency}`;
}

// Shopify CDN resizes on the fly; request only what the screen needs.
export function imageUrl(url: string, width: number) {
  return `${url}${url.includes('?') ? '&' : '?'}width=${Math.round(width)}`;
}

export const productUrl = (p: Product) => `${shop.url}/products/${p.handle}`;

// Shopify cart permalink: opens the web checkout with these lines pre-filled.
export function checkoutUrl(lines: { variantId: string; quantity: number }[]) {
  return `${shop.url}/cart/${lines.map((l) => `${l.variantId}:${l.quantity}`).join(',')}`;
}
