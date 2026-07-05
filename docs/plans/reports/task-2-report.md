# Task 2 Report — Storefront reads live (shop, all-supplies, product page, categories)

## Build gate

`npx next build` (Turbopack, Next 16.2.1) — green.

```
✓ Compiled successfully in 2.1s
  Running TypeScript ...
  Finished TypeScript in 2.6s ...
  Collecting page data using 9 workers ...
✓ Generating static pages using 9 workers (17/17) in 328ms
  Finalizing page optimization ...

Route (app)
...
├ ƒ /product/[id]
├ ƒ /shop
├ ƒ /shop/all-supplies
└ ƒ /tracking/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

`/shop`, `/shop/all-supplies`, `/product/[id]` are all `ƒ` (dynamic — driven by `searchParams`/`params`), as expected; they are not prerendered at build time so no live network call happens during `next build`. `npx tsc --noEmit` and `npx eslint` over the touched paths are both clean (fixed one real lint error along the way — see Notes).

## Grep proof

```
$ grep -rn "supplyProducts" "app/(storefront)/shop" "app/(storefront)/product" "components/storefront/shop/ProductCard.tsx"
(no output — exit 1)

$ grep -rln "from '@/lib/data'" app components
(no output)
```

`lib/data.ts` itself still exists (left in place per the plan's Global Constraints, to be deleted in a later task) but nothing under the shop/product/ProductCard scope imports it anymore.

## Files changed / added

**Modified**
- `app/(storefront)/shop/page.tsx` — async Server Component; fetches `getProducts({limit:100, category, q, sort})` + `getCategories()` in parallel; category pills are slug-based links; sections (On Promotion / Top Selling / All Supplies) keep the original dedupe logic (`isOnSale`, `isTopSelling && !isOnSale`, rest).
- `app/(storefront)/shop/all-supplies/page.tsx` — async Server Component; fetches `getProducts({q, category, brand, sort, page, limit:48})` + `getCategories()`/`getBrands()`; pagination built from `meta.totalPages` as prev/next/number `Link`s preserving the active query string.
- `app/(storefront)/product/[id]/page.tsx` — async Server Component; `await params`, treats the segment as the product **slug**; `getProduct(slug)` wrapped in try/catch → `notFound()` on `ApiError.status === 404`; renders category/name/description/price (+ `compareAtPrice` strikethrough when `isOnSale`), stock indicator, rating (only if non-null); related products via `getProducts({category: product.category.slug, limit:4})` filtered to exclude the current slug.
- `components/storefront/shop/ProductCard.tsx` — prop retyped to the API `Product` (from `lib/types`); link now `/product/${product.slug}`; image via the new shared `ProductImage` (real URL + placeholder fallback, no unsplash); **mobile fix applied exactly as specified** — info box now `opacity-100 translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0`, dark overlay and category-pill hover state gated to `md:group-hover:*` so mobile stays legible without a hover.

**Added**
- `components/storefront/shop/ProductImage.tsx` — shared `<Image>`-or-placeholder renderer (no external/unsplash fallback; a plain gray box + icon) used everywhere a product image is rendered.
- `components/storefront/shop/ProductGrid.tsx` — the shop page's small-card grid, extracted so it can be reused by the on-sale/top-selling sections and the product page's "related products" strip.
- `components/storefront/shop/SortSelect.tsx` — `'use client'`; shop page's sort dropdown, navigates to `?sort=featured|price_asc|price_desc|newest` (values match the backend's `ProductFilters['sort']` enum, confirmed against `products.validation.ts`).
- `components/storefront/shop/LoadMoreSection.tsx` — `'use client'`; preserves the original "All Supplies" reveal-in-batches-of-24 UX client-side over the already-fetched (`limit:100`) list.
- `components/storefront/shop/AllSuppliesFilterBar.tsx` — `'use client'`; exports `AllSuppliesSearchBox` (debounced search input, placed beside the title like the original) and default `AllSuppliesFilterBar` (category/brand/sort selects + reset, the gray filter-panel box below), both navigating via `router.push` while preserving the other active query params.
- `app/(storefront)/product/[id]/Gallery.tsx` — `'use client'`; renders **one** image when `product.images.length === 1` (no fake duplicate thumbnails), main + clickable thumbnails when there are more.
- `app/(storefront)/product/[id]/AddToCartPanel.tsx` — `'use client'`; quantity + Add to Cart button, extracted from the old page.tsx client component since the page is now an async Server Component.
- `app/(storefront)/shop/loading.tsx`, `app/(storefront)/product/[id]/loading.tsx` — pulse skeletons matching each page's grid/detail layout.
- `app/(storefront)/error.tsx` — `'use client'` error boundary, friendly message + `reset()` retry button.
- `app/(storefront)/product/[id]/not-found.tsx` — real 404 UI + link back to `/shop`.

## Design-preservation notes

- Section structure, headings, `AnimatedBanner`, category pill styling, card shapes, colors (`#94B447`/`#18202D`/`#FF6B35`/`#F5A623`), and copy are all unchanged — only the data source and interactivity wiring changed.
- The shop page's "Load More" mechanic (batches of 24, fake 800ms delay) is preserved client-side; since the page already fetches up to 100 products server-side there's no second network round-trip, just a reveal.
- All-supplies page: dropped the **Price Range** and **Availability** selects. The live backend's `/api/products` endpoint doesn't expose price-range or stock-status filtering (only `q/category/brand/sort/page/limit` — confirmed in `products.validation.ts`), and since the grid is now server-filtered rather than client-filtered, keeping those controls would have made them decorative/non-functional. The grid layout was adjusted from 5 to 3 filter columns to match; search box, header, filter-panel box, pagination, and card design are otherwise identical.
- Product detail: kept the static "Shipping & Delivery" info grid as-is (no backend data backs it); gallery thumbnails are now real, clickable, and only render when there's more than one image.
- ProductCard.tsx has no callers yet in this codebase (confirmed via repo-wide grep — it was already orphaned before this task); it was still fixed per the task spec since the mobile-hover bug and slug-link requirement were called out explicitly and it's a shared piece other pages/tasks may adopt.
- Add-to-cart calls in `AddToCartPanel.tsx` and `ProductCard.tsx` build the object shape `CartContext.addToCart` currently expects (`name`, `price` as a `formatTzs`-formatted string, `category`, `image`) rather than passing `productId`/`slug`/numeric `price` directly, because `CartContext`'s `CartItem` type doesn't have those fields yet. Left `// TODO(task3)` comments at both call sites per the task instructions — Task 3 (cart consolidation) is expected to change the call sites once the type changes.

## Concerns

- Backend `q` search only matches product `name` (not category), a minor behavior change from the old client-side search which also matched category text — inherent to the current API, not something the frontend can fix without more query params.
- All-supplies price-range/availability filters removed rather than left as non-functional decoration (see above) — flagging in case a future task wants to add `minPrice`/`maxPrice` support server-side and reintroduce them.
- `ProductCard.tsx` remains unused by any page today (same as before this task); worth confirming with whoever owns Task 3/6 whether it's meant to replace the shop/all-supplies inline card markup eventually or is a dead component to prune.
