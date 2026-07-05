import type {
  Banner,
  Brand,
  Category,
  CreatedOrder,
  DeliveryZone,
  Meta,
  OrderPayload,
  Paginated,
  Product,
  SiteSettings,
  TrackingView,
} from './types';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://globsby-api.62-169-28-221.sslip.io';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  meta?: Meta;
  error?: { code?: string; message?: string; details?: unknown };
}

async function request<T>(path: string, init?: RequestInit): Promise<{ data: T; meta?: Meta }> {
  const res = await fetch(`${API_BASE}${path}`, init);
  const body = (await res.json().catch(() => undefined)) as ApiEnvelope<T> | undefined;

  if (!res.ok || !body?.success) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? 'UNKNOWN',
      body?.error?.message ?? 'Request failed',
    );
  }

  return { data: body.data as T, meta: body.meta };
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function getProducts(params?: {
  q?: string;
  category?: string;
  brand?: string;
  onSale?: boolean;
  topSelling?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<Paginated<Product>> {
  const qs = buildQuery(params);
  const { data, meta } = await request<Product[]>(`/api/products${qs}`, {
    next: { revalidate: 60 },
  });
  return { data, meta: meta as Meta };
}

export async function getProduct(slug: string): Promise<Product> {
  const { data } = await request<Product>(`/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await request<Category[]>('/api/categories', {
    next: { revalidate: 60 },
  });
  return data;
}

export async function getBrands(): Promise<Brand[]> {
  const { data } = await request<Brand[]>('/api/brands', {
    next: { revalidate: 60 },
  });
  return data;
}

export async function getBanners(placement?: string): Promise<Banner[]> {
  const qs = buildQuery(placement ? { placement } : undefined);
  const { data } = await request<Banner[]>(`/api/banners${qs}`, {
    next: { revalidate: 60 },
  });
  return data;
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const { data } = await request<DeliveryZone[]>('/api/delivery-zones', {
    next: { revalidate: 60 },
  });
  return data;
}

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await request<SiteSettings>('/api/settings', {
    next: { revalidate: 60 },
  });
  return data;
}

export async function createOrder(payload: OrderPayload): Promise<CreatedOrder> {
  const { data } = await request<CreatedOrder>('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  return data;
}

export async function trackOrder(orderNumber: string): Promise<TrackingView> {
  const { data } = await request<TrackingView>(
    `/api/orders/track/${encodeURIComponent(orderNumber)}`,
    { cache: 'no-store' },
  );
  return data;
}
