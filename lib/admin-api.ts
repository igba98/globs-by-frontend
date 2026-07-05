import { API_BASE, ApiError } from './api';
import type {
  AdminOrder,
  AdminProductPayload,
  DashboardStats,
  Meta,
  Paginated,
  PresignResponse,
  Product,
  SiteSettings,
} from './types';

const STORAGE_KEY = 'gb-admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminSession {
  accessToken: string;
  user: AdminUser;
}

interface AdminEnvelope<T> {
  success: boolean;
  data?: T;
  meta?: unknown;
  error?: { code?: string; message?: string; details?: unknown };
}

interface LoginResponseData {
  user: AdminUser;
  accessToken: string;
}

interface RefreshResponseData {
  accessToken: string;
}

function isValidAdminUser(user: unknown): user is AdminUser {
  if (!user || typeof user !== 'object') return false;
  const u = user as Partial<AdminUser>;
  return (
    typeof u.id === 'string' &&
    typeof u.name === 'string' &&
    typeof u.email === 'string' &&
    typeof u.role === 'string'
  );
}

// Cache the last parsed session by raw string so getSession() returns a
// stable object reference when the underlying storage hasn't changed. This
// lets getSession() be used directly as a useSyncExternalStore snapshot
// (which compares snapshots with Object.is) without tearing/looping.
let cachedRaw: string | null | undefined;
let cachedSession: AdminSession | null = null;

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSession;
    cachedRaw = raw;
    if (!raw) {
      cachedSession = null;
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<AdminSession> | null;
    if (!parsed || typeof parsed.accessToken !== 'string' || !isValidAdminUser(parsed.user)) {
      clearSession();
      cachedSession = null;
      return null;
    }
    cachedSession = { accessToken: parsed.accessToken, user: parsed.user };
    return cachedSession;
  } catch {
    clearSession();
    cachedSession = null;
    return null;
  }
}

export function saveSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — ignore
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function adminLogin(email: string, password: string): Promise<AdminSession> {
  const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const body = (await res.json().catch(() => undefined)) as
    | AdminEnvelope<LoginResponseData>
    | undefined;

  if (!res.ok || !body?.success || !body.data) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? 'UNKNOWN',
      body?.error?.message ?? 'Invalid email or password',
    );
  }

  const session: AdminSession = { accessToken: body.data.accessToken, user: body.data.user };
  saveSession(session);
  return session;
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/admin/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // ignore network errors — we clear locally regardless
  } finally {
    clearSession();
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    const body = (await res.json().catch(() => undefined)) as
      | AdminEnvelope<RefreshResponseData>
      | undefined;
    if (!res.ok || !body?.success || !body.data?.accessToken) return null;
    return body.data.accessToken;
  } catch {
    return null;
  }
}

async function rawFetch<T>(
  path: string,
  init: RequestInit,
  accessToken: string | undefined,
): Promise<{ res: Response; body: AdminEnvelope<T> | undefined }> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (init.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // NOTE: no `credentials: 'include'` here — the Bearer access token in the
  // Authorization header is sufficient for regular admin API calls. Only the
  // auth endpoints (login/refresh/logout) need the refresh cookie sent.
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  const body = (await res.json().catch(() => undefined)) as AdminEnvelope<T> | undefined;
  return { res, body };
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; meta?: unknown }> {
  const session = getSession();
  const { res, body } = await rawFetch<T>(path, init ?? {}, session?.accessToken);

  if (res.status === 401) {
    if (!session) {
      clearSession();
      throw new ApiError(401, 'SESSION_EXPIRED', 'Session expired — please log in again');
    }

    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      clearSession();
      throw new ApiError(401, 'SESSION_EXPIRED', 'Session expired — please log in again');
    }

    saveSession({ ...session, accessToken: newAccessToken });

    const retry = await rawFetch<T>(path, init ?? {}, newAccessToken);
    if (!retry.res.ok || !retry.body?.success) {
      if (retry.res.status === 401) {
        clearSession();
        throw new ApiError(401, 'SESSION_EXPIRED', 'Session expired — please log in again');
      }
      throw new ApiError(
        retry.res.status,
        retry.body?.error?.code ?? 'UNKNOWN',
        retry.body?.error?.message ?? 'Request failed',
      );
    }
    return { data: retry.body.data as T, meta: retry.body.meta };
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(res.status, body?.error?.code ?? 'UNKNOWN', body?.error?.message ?? 'Request failed');
  }

  return { data: body.data as T, meta: body.meta };
}

/**
 * Returns true when the given error means the admin session is gone
 * (expired refresh cookie, missing/invalid token, etc). Callers should
 * redirect to /admin/login when this is true — adminFetch has already
 * cleared the stored session.
 */
export function isSessionExpiredError(err: unknown): boolean {
  return err instanceof ApiError && err.code === 'SESSION_EXPIRED';
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await adminFetch<DashboardStats>('/api/admin/dashboard/stats');
  return data;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getAdminProducts(params?: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<Product>> {
  const qs = buildQuery(params);
  const { data, meta } = await adminFetch<Product[]>(`/api/admin/products${qs}`);
  return { data, meta: meta as Meta };
}

export async function getAdminProduct(id: string): Promise<Product> {
  const { data } = await adminFetch<Product>(`/api/admin/products/${id}`);
  return data;
}

export async function createAdminProduct(payload: AdminProductPayload): Promise<Product> {
  const { data } = await adminFetch<Product>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function updateAdminProduct(
  id: string,
  payload: Partial<AdminProductPayload>,
): Promise<Product> {
  const { data } = await adminFetch<Product>(`/api/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await adminFetch<unknown>(`/api/admin/products/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

export async function presignUpload(payload: {
  filename: string;
  contentType: string;
  folder: string;
}): Promise<PresignResponse> {
  const { data } = await adminFetch<PresignResponse>('/api/admin/uploads/presign', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function uploadFileToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!res.ok) {
    throw new Error('Upload failed — please try a different image.');
  }
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function getAdminOrders(params?: {
  status?: string;
  paymentStatus?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<AdminOrder>> {
  const qs = buildQuery(params);
  const { data, meta } = await adminFetch<AdminOrder[]>(`/api/admin/orders${qs}`);
  return { data, meta: meta as Meta };
}

export async function getAdminOrder(id: string): Promise<AdminOrder> {
  const { data } = await adminFetch<AdminOrder>(`/api/admin/orders/${id}`);
  return data;
}

export async function updateAdminOrder(
  id: string,
  payload: { orderStatus?: string; paymentStatus?: string },
): Promise<AdminOrder> {
  const { data } = await adminFetch<AdminOrder>(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function getAdminSettings(): Promise<SiteSettings> {
  const { data } = await adminFetch<SiteSettings>('/api/admin/settings');
  return data;
}

export async function updateAdminSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data } = await adminFetch<SiteSettings>('/api/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data;
}
