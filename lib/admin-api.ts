import { API_BASE, ApiError } from './api';

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

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminSession> | null;
    if (!parsed || typeof parsed.accessToken !== 'string' || !parsed.user) return null;
    return parsed as AdminSession;
  } catch {
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

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
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
