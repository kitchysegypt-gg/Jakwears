# Jakwears

Expo (React Native) shopping app for [jakwears.com](https://www.jakwears.com), built from the Jakwears Shopify store's catalog. Runs in **Expo Go** on iOS and Android, and on the web.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the Expo Go app (Android) or the Camera app (iOS). Phone and computer must be on the same network, or use `npx expo start --tunnel`.

## What's in the app

- **Home**: hero banner, new arrivals, featured products (the store's "Home page" collection) and season and category collections.
- **Shop**: search across all 85 products, plus quick links to every collection.
- **Product**: image gallery, size and bundle selection with sale prices, product details, and share.
- **Cart**: kept on the device between sessions. **Checkout** opens the real Shopify checkout on jakwears.com with the cart pre-filled, so orders, payments and shipping all go through the existing store.
- **Info**: contact details, address and privacy policy.

## Where the data comes from

The catalog is a **read-only snapshot** of the Shopify store, taken on 2026-10-09 with the Admin API. Nothing in the store was changed.

| File | Contents |
| --- | --- |
| `data/raw/products-*.json` | Raw export of all active products (titles, descriptions, images, variants, prices, collections) |
| `data/shop.json` | Store details and the full collection list |
| `data/catalog.json` | Compact catalog bundled into the app (generated) |

Customer and order data is intentionally **not** included in the app.

To refresh after changing products in Shopify, re-export the product pages into `data/raw/` and run:

```bash
npm run build:catalog
```

Prices and stock in the app come from the snapshot. Checkout always uses live Shopify prices and availability.

## Checks

```bash
npm run typecheck
npx expo lint
npx expo-doctor
```
