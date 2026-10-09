#!/usr/bin/env node
// Turns the read-only Shopify Admin API exports in data/raw/ into the compact
// catalog the app bundles (data/catalog.json). Run: npm run build:catalog
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rawDir = path.join(root, 'data', 'raw');
const shop = require(path.join(root, 'data', 'shop.json'));

const gidNumber = (gid) => gid.split('/').pop();

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

// Product descriptions are short HTML spec lists ("<b>Fabric:</b> ..."); flatten
// them to one line per spec so the app can render them without an HTML view.
function htmlToLines(html) {
  return (html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

const products = fs
  .readdirSync(rawDir)
  .filter((f) => /^products-\d+\.json$/.test(f))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(rawDir, f), 'utf8')).data.products.nodes)
  .map((p) => ({
    id: gidNumber(p.id),
    handle: p.handle,
    title: p.title,
    createdAt: p.createdAt,
    description: htmlToLines(p.descriptionHtml),
    options: p.options,
    images: p.images.nodes.map((i) => i.url),
    variants: p.variants.nodes.map((v) => ({
      id: gidNumber(v.id),
      title: v.title,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      available: v.availableForSale,
    })),
    collections: p.collections.nodes.map((c) => c.handle),
  }));

// Only keep collections that contain at least one active product.
const collections = shop.collections
  .map((c) => ({ ...c, productCount: products.filter((p) => p.collections.includes(c.handle)).length }))
  .filter((c) => c.productCount > 0);

const catalog = {
  exportedAt: shop.exportedAt,
  shop: shop.shop,
  collections,
  products,
};

fs.writeFileSync(path.join(root, 'data', 'catalog.json'), JSON.stringify(catalog));
console.log(`catalog.json: ${products.length} products, ${collections.length} collections`);
