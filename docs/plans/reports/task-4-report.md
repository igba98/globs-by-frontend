# Task 4 Report — Real admin auth + route protection

## Summary
Replaced the fake/prefilled admin login with real authentication against the live backend and added client-side route protection to the admin shell.

## Files created
- `lib/admin-api.ts` — `AdminSession`/`AdminUser` types, `getSession`/`saveSession`/`clearSession` (localStorage key `gb-admin`, guarded for SSR and JSON errors), `adminLogin`, `adminLogout`, and `adminFetch<T>` (Bearer attach, single 401 → `POST /auth/refresh` → retry once, else `clearSession()` + `ApiError(401, 'SESSION_EXPIRED', ...)`). Reuses `ApiError` from `lib/api.ts` (already exported — no change needed there).

## Files modified
- `app/(backoffice)/admin/login/page.tsx` — removed prefilled `defaultValue` creds; controlled inputs with proper `autoComplete`; real `adminLogin()` submit with pending state and inline error banner (API message surfaced via `ApiError`); redirects to `/admin/dashboard` on success or if already logged in (checked on mount via `getSession()`). Visual design (card, logo, security note) preserved.
- `app/(backoffice)/admin/layout.tsx` — added a mount-time guard for all non-login admin routes: no session → `router.replace('/admin/login')`, renders a small spinner splash while checking/redirecting. Sidebar footer now shows the real user's name + role (with initials avatar) and header avatar uses initials from `session.user.name`. Sign Out is now a button calling `adminLogout()` then `router.replace('/admin/login')` (was a plain link to `/admin/login`).

## Verification
- `npm run build` → green (Next.js 16.2.1, Turbopack; TypeScript passed; all routes generated).
- `grep -rn "password123\|admin@globs-by.com" app components` → 0 hits.
- `grep -n "defaultValue" app/(backoffice)/admin/login/page.tsx` → 0 hits.

## Concerns / follow-ups for Task 5
- `adminFetch<T>` is implemented but not yet consumed anywhere (dashboard/products/orders/inventory/settings pages still on mock data per plan — that's Task 5).
- Mobile sidebar overlay still has no Sign Out affordance (desktop sidebar does); not required by Task 4 acceptance but worth adding when Task 5 touches the shell.
- No "remember me" / multi-tab session-sync logic — single localStorage key, refreshed lazily on 401; acceptable per spec.
