# Globs-By Frontend — Live API Integration & UX Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkboxes.

**Goal:** Replace ALL hardcoded data with the live backend API (`https://globsby-api.62-169-28-221.sslip.io`) — real catalog, real checkout with SMS/order-number, real tracking, real admin auth + backoffice CRUD — and fix the audited UX issues (mobile add-to-cart, cart persistence, broken links, loading/error states, wrong-product 404).

**Architecture:** Storefront reads happen in **Server Components** (no CORS, fast first paint, SEO) via `lib/api.ts`. Cart/checkout/admin are client-side. One cart implementation (`CartContext`, localStorage). Admin uses bearer access token (localStorage) + cookie refresh (`credentials: 'include'`; backend cookie becomes `SameSite=None` in prod). Product URLs move to **slugs**.

## Global Constraints

- Next.js 16 App Router; check `node_modules/next/dist/docs/` before using APIs that may have changed (per AGENTS.md). TypeScript must compile: **`npm run build` green is the acceptance gate for every task** (there is no test harness in this repo).
- API base: `process.env.NEXT_PUBLIC_API_URL ?? 'https://globsby-api.62-169-28-221.sslip.io'` — the fallback is the LIVE url so Vercel works without dashboard config.
- API envelope: `{ success, data, meta? }` / `{ success:false, error:{code,message,details?} }`. Money is integer TZS — format with `new Intl.NumberFormat('en-US')` prefixing `TZS `.
- Product shape from API: `{ id, name, slug, description, price:number, compareAtPrice, stock, isOnSale, isTopSelling, rating, category:{name,slug}, brand:{name,slug}|null, images:[{url,alt,sortOrder}] }`.
- Server Components fetch with `next: { revalidate: 60 }` for catalog reads (fresh enough; backend also has its own Redis cache). Checkout/tracking/admin: `cache: 'no-store'`.
- Never break existing visual design language (DM Sans/Outfit, sage green `#94B447`, rounded cards). This is integration + UX repair, not a redesign.
- `lib/data.ts` stays in the repo until the final task removes remaining references; delete it at the end.
- Keep `/logo/**` public assets (logos, partner/brand images used by About page) — only PRODUCT data goes live.

---

## Task 1: API client + types + image config

**Files:** Create `lib/api.ts`, `lib/types.ts`, `lib/format.ts`. Modify `next.config.ts` (remotePatterns + keep existing), `.env.example` (NEXT_PUBLIC_API_URL documented).

**Produces:**
- `lib/types.ts`: `Product`, `ProductImage`, `Category`, `Brand`, `Banner`, `DeliveryZone`, `SiteSettings`, `TrackingView`, `Paginated<T>` interfaces matching the backend payloads.
- `lib/api.ts`: `API_BASE`; `apiGet<T>(path, revalidate?)` (server-safe fetch, throws ApiError on !success); public helpers `getProducts(params)`, `getProduct(slug)`, `getCategories()`, `getBrands()`, `getBanners(placement?)`, `getDeliveryZones()`, `getSettings()`, `createOrder(payload)`, `trackOrder(orderNumber)`.
- `lib/format.ts`: `formatTzs(n: number): string` → `TZS 45,000`.
- `next.config.ts`: add `globsby-media.62-169-28-221.sslip.io` (https) to `images.remotePatterns`.
- Acceptance: `npm run build` green.

## Task 2: Storefront reads live (shop, all-supplies, product page, categories)

**Files:** Modify `app/(storefront)/shop/page.tsx`, `app/(storefront)/shop/all-supplies/page.tsx`, `app/(storefront)/product/[id]/page.tsx` (param treated as SLUG), `components/storefront/shop/ProductCard.tsx`; add `app/(storefront)/shop/loading.tsx`, `app/(storefront)/product/[id]/loading.tsx`, `app/(storefront)/error.tsx`.

**Behavior:**
- Shop page → **async Server Component**: fetch `getProducts({limit:100})` + `getCategories()`; keep the three sections (On Promotion = `isOnSale`, Top Selling = `isTopSelling`, rest), category pills filter via `?category=slug` searchParam (server-side filter param).
- All-supplies → server fetch with `q/category/brand/sort/page` from searchParams; pagination from `meta`.
- Product page → `getProduct(slug)`; **`notFound()` when 404** (no more silent product #1); gallery uses `images[]` (all of them, no duplicates — single image renders once, no fake thumbnails).
- ALL product links use `/product/${slug}` (grid, ProductCard, related items).
- ProductCard UX: price + add-to-cart visible WITHOUT hover on touch/small screens (`opacity-100 translate-y-0 md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0`); images via `next/image` with the media host; add-to-cart passes `{productId:id, slug, name, price, image}`.
- `loading.tsx` skeletons (simple pulse cards) + `error.tsx` (friendly retry) for the storefront segment.
- Acceptance: `npm run build` green; every storefront page compiles as dynamic/server component without `supplyProducts` imports (`grep -r supplyProducts app/(storefront)` → only checkout/cart remnants allowed until Task 3).

## Task 3: Cart consolidation + real checkout + success + tracking

**Files:** Modify `components/storefront/cart/CartContext.tsx` (localStorage, numeric price, productId+slug), `components/storefront/cart/CartModal.tsx`, `components/storefront/navbar/Navbar.tsx` (badge from CartContext — remove `store/cartStore.ts` usage everywhere, delete the file), `app/(storefront)/checkout/page.tsx`, `app/(storefront)/checkout/success/page.tsx`, `app/(storefront)/tracking/[id]/page.tsx`.

**Behavior:**
- Cart: `localStorage` key `globs-by-cart-v2`; items `{productId, slug, name, price:number, image, quantity}`; subtotal computed numerically.
- Checkout (client): form state + validation (name/email/phone required, phone TZ format hint); delivery method radio; zones dropdown from `getDeliveryZones()` with fee display + freeOver waiver preview; payment method radio (MOBILE_MONEY/CARD/CASH); order summary computed from cart; submit → `createOrder({customerName, customerEmail, customerPhone, deliveryMethod, deliveryZoneId?, deliveryAddress?, paymentMethod, items:[{productId, quantity}]})`; disable button while pending; API error → readable message (e.g. insufficient stock) — NOT a fake success.
- On success: clear cart → `router.push('/checkout/success?order=ORD-…')`.
- Success page: reads `order` searchParam (no more hardcoded #ORD-9021), shows real order number + **paymentInstructions from `getSettings()`** + link `/tracking/{orderNumber}` + "we've sent you an SMS".
- Tracking page: fetch `trackOrder(param)` server-side; render status, items, totals; 404 state for unknown numbers.
- Acceptance: build green; `store/cartStore.ts` deleted; no `sessionStorage` cart references.

## Task 4: Real admin auth + route protection

**Files:** Create `lib/admin-api.ts`, `components/backoffice/AdminAuthProvider.tsx` (or hook). Modify `app/(backoffice)/admin/login/page.tsx`, `app/(backoffice)/admin/layout.tsx` (guard + logout wired).

**Behavior:**
- `lib/admin-api.ts`: `adminLogin(email,password)` → POST `/api/admin/auth/login` with `credentials:'include'`, stores `{accessToken, user}` in localStorage `gb-admin`; `adminFetch(path, init?)` attaches `Authorization: Bearer`, on 401 → one attempt `POST /auth/refresh` (`credentials:'include'`) → retry; on refresh failure clears session → redirect login. `adminLogout()` posts logout + clears.
- Login page: REMOVE prefilled demo credentials; real submit; error display ("Invalid email or password"); on success → `/admin/dashboard`.
- Admin layout (except login route): client guard — no stored session → replace to `/admin/login`; sidebar Sign Out → `adminLogout()`.
- Acceptance: build green; `grep -rn "password123\|admin@globs-by.com" app components` → 0 hits.

## Task 5: Backoffice wired (dashboard, products + uploads, orders, inventory, settings)

**Files:** Modify `app/(backoffice)/admin/dashboard/page.tsx`, `products/page.tsx`, `products/new/page.tsx`, `orders/page.tsx`, `orders/[id]/page.tsx`, `inventory/page.tsx`, `settings/page.tsx`, backoffice layout sidebar (drop Customers link — no backend endpoint).

**Behavior (all via `adminFetch`):**
- Dashboard: `GET /api/admin/dashboard/stats` → KPI cards (revenue, orders, customers, AOV), low-stock list, status breakdown, recent orders, top products. Loading + error states.
- Products list: `GET /api/admin/products?q&page` table (name, price, stock, published toggle→PATCH, edit link, delete w/ confirm→DELETE).
- Product create (`products/new`): form → image file input → `POST /api/admin/uploads/presign` → `PUT` file to `uploadUrl` (Content-Type = file type) → include `images:[{url: publicUrl}]` in `POST /api/admin/products`; category/brand selects fetched live. Edit: same page pattern with `?id=` (or `products/[id]/edit` if the folder exists) via PATCH.
- Orders list: `GET /api/admin/orders?status&q&page`; detail: items, customer info, totals; status + payment selects → `PATCH /api/admin/orders/:id` (drives customer SMS).
- Inventory: products table w/ inline stock edit → PATCH stock.
- Settings: `GET/PATCH /api/admin/settings` — contact fields + announcement + **paymentInstructions** textarea.
- Acceptance: build green; `grep -rn "allProducts\|allOrders\|allCustomers" app/(backoffice)` → 0 mock arrays remaining in wired pages.

## Task 6: Polish batch + hardcoded-data removal

**Files:** Navbar search, Footer, banners/announcement, `lib/data.ts` removal, gallery already fixed in T2.

**Behavior:**
- Navbar search submits to `/shop/all-supplies?q=…` (wired to API q).
- Announcement bar text from `getSettings().announcementText` (server component wrapper); footer contact info from settings; single Footer component used everywhere (delete the divergent copy if two exist).
- Home/shop banner strips read `getBanners('HOMEPAGE'|'SHOP')` when non-empty, else keep current static visuals (banners have no real images yet).
- Delete `lib/data.ts` and `store/cartStore.ts` (if not already); `grep -r "supplyProducts" app components lib` → 0.
- Acceptance: `npm run build` green; grep clean.

---

## Backend enabler (done outside this plan, before Task 4 testing): refresh cookie `SameSite=None` in production (cross-origin vercel.app → sslip.io) — backend `auth.controller.ts`.

## Verification strategy
No test harness in this repo: every task gates on `npm run build` + implementer smoke-checks + per-task reviewer reading the diff. Final: live end-to-end (real order on production API) after deploy.
