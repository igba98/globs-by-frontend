# Task 6 (Final) — Polish batch + hardcoded-data removal + review fixes

## A. Plan Task 6 items

1. **Navbar search** — the live navbar (inline in `app/(storefront)/layout.tsx`, now `components/storefront/StorefrontChrome.tsx`) now submits to `/shop/all-supplies?q=<term>` via `router.push` (was `/shop?q=`). `all-supplies/page.tsx` already reads `q` from `searchParams` and passes it to `getProducts`, so the wiring is now end-to-end. Styling untouched.

2. **Announcement bar + footer from settings** — `app/(storefront)/layout.tsx` is now an async Server Component: it calls `getSettings()` (falls back to `null` on API failure) and passes the result as a `settings` prop into a new client component `components/storefront/StorefrontChrome.tsx`, which holds all the previous interactive chrome (scroll state, search, mobile menu, subscribe form). Announcement marquee text and footer contact fields (`contactDsm`, `contactMbeya`, `phoneDsm`, `phoneMbeya`, `emailInfo`, `emailMarketing`, `instagramUrl`, `facebookUrl`, `whatsappUrl`, `twitterUrl`, `announcementText`) are read from settings with the original hardcoded strings kept as per-field fallbacks (`settings?.field || 'hardcoded default'`) so empty/missing settings never blank anything out.

   While auditing this I found two **divergent dead copies** that the live layout never used: `components/storefront/footer/Footer.tsx` and `components/storefront/navbar/AnnouncementBar.tsx` (zero importers, verified by grep). Deleted both, along with their now-empty directories, per the plan's "single Footer component... delete the divergent copy" instruction.

3. **`lib/data.ts` deletion** — `grep -rn "supplyProducts|from '@/lib/data'" app components lib` found only `lib/data.ts` itself; there were **zero external consumers** (the About page's brand/partner logos and content are already fully static/inline, unrelated to `lib/data.ts`). Deleted the file directly; no migration needed.

4. **Banners** — confirmed `getBanners` has zero call sites anywhere in the app (grep). Left the static `AnimatedBanner` component and shop banner strip untouched, per the plan's explicit skip (seeded banner images are placeholder product photos, not real banner art).

## B. Accumulated review fixes

1. `app/(storefront)/shop/page.tsx` — category pill hrefs (and the "All" pill) now preserve both `q` and `sort` when switching categories; previously `sort` was dropped.
2. `app/(storefront)/checkout/page.tsx` — the empty-cart early-return now also checks `!isSubmitting`, so `clearCart()` on successful submit no longer flashes "Your cart is empty" during the frame before `router.push` completes.
3. Deleted dead file `components/storefront/navbar/Navbar.tsx` (confirmed zero importers via grep before deleting).
4. `lib/admin-api.ts` — `rawFetch`/`adminFetch` (the generic authenticated path) no longer send `credentials: 'include'`; only `adminLogin`, `adminLogout`, and the internal `refreshAccessToken` (which need the refresh cookie) still send it. Bearer token in the Authorization header is sufficient for the rest.
5. `lib/admin-api.ts` `getSession()` — added `isValidAdminUser()` guard validating `id`/`name`/`email`/`role` are all strings; on any malformed shape it now calls `clearSession()` and returns `null` instead of trusting a partially-shaped object.
6. `app/(backoffice)/admin/layout.tsx` — added a Sign Out button to the mobile sidebar overlay (mirrors the desktop one, same user info block). Also fixed the pre-existing `react-hooks/set-state-in-effect` ESLint error: replaced the `useState`+`useEffect` session-loading pattern with `useSyncExternalStore(subscribeToSessionChanges, getSession, getServerSessionSnapshot)` — `getSession()` is a synchronous localStorage read, so it doubles as the store's snapshot function (made stable/cached in `lib/admin-api.ts` to avoid `Object.is` tearing). The remaining `useEffect` only does the `router.replace` navigation side effect (no setState calls), which the rule doesn't flag. Confirmed via `npx eslint "app/(backoffice)/admin/layout.tsx"` — clean.
7. All-supplies "Out of Stock" badge — restored `text-orange-500` (was `text-red-500`) in `app/(storefront)/shop/all-supplies/page.tsx`. Note: backoffice admin product/dashboard pages also render "Out of Stock" text but use a different (red pill) design system not covered by this item; left as-is.

## C. Final sweep

- `npx eslint .`: **6 problems (5 errors, 1 warning)** remaining, all pre-existing and in files not touched by this task:
  - `components/storefront/cart/CartContext.tsx:44` — same `react-hooks/set-state-in-effect` pattern as the admin layout had; not in this task's scope, left alone (would need the same useSyncExternalStore-style refactor if picked up later).
  - `components/ui/badge.tsx:9`, `components/ui/button.tsx:14` — `prefer-const` (`baseClass` never reassigned).
  - `components/ui/button.tsx:11` — unused `asChild` prop (warning).
  - `components/ui/input.tsx:5` — empty interface extending its supertype.
  - `lib/utils.ts:1` — `no-explicit-any`.
- `grep -rn "supplyProducts" app components lib` → 0 hits.
- `lib/data.ts` deleted.
- `components/storefront/navbar/Navbar.tsx` deleted (plus the two other dead chrome copies found along the way).
- `npm run build` → green (Next.js 16.2.1 / Turbopack, all 17 routes compiled, no type errors).

## What About/Home still use statically

- `app/(storefront)/about/page.tsx` was already 100% static and independent of `lib/data.ts` before this task: core values, services list, brand logos (`/BRANDS-WE-WORK-WITH/**`), and partner logos (`/logo/PARTNERS-LOGO/**`) are all inline arrays of image paths/text, per the plan's instruction to keep `/logo/**` static assets. Nothing here reads product data, so no migration was needed.
- Home page (`app/(storefront)/page.tsx`) was not touched in this task — it was already wired to live data in earlier tasks (T2); the shop banner strip (`AnimatedBanner`) remains static per item A4 above.
