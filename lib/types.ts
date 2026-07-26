export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  isOnSale: boolean;
  isTopSelling: boolean;
  isPublished: boolean;
  rating: number | null;
  category: CategoryRef;
  brand: CategoryRef | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  placement: 'HOMEPAGE' | 'SHOP' | 'PROMO_STRIP';
  sortOrder: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  region: string;
  fee: number;
  freeOver: number | null;
  estimatedDays: string | null;
}

export interface SmsRecipient {
  id: string;
  label: string;
  phone: string;
  region: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SmsRecipientPayload {
  label: string;
  phone: string;
  region?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

export interface BeemSenderName {
  senderid: string;
  status: string;
}

export interface SmsStatus {
  configured: boolean;
  balance: unknown | null;
  senderNames: BeemSenderName[] | null;
  senderActive: boolean | null;
  error?: string;
}

export interface SiteSettings {
  id: string;
  contactDsm: string;
  contactMbeya: string;
  phoneDsm: string;
  phoneMbeya: string;
  emailInfo: string;
  emailMarketing: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string | null;
  twitterUrl: string | null;
  announcementText: string;
  paymentInstructions?: string;
  tin?: string;
  vrn?: string;
}

export interface TrackingItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface TrackingView {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryMethod: string;
  customerName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  items: TrackingItem[];
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  deliveryZoneId?: string;
  deliveryAddress?: string;
  paymentMethod: 'MOBILE_MONEY' | 'CARD' | 'CASH';
  items: { productId: string; quantity: number }[];
  notes?: string;
}

export interface CreatedOrder {
  id: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  items: unknown[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: Meta;
}

// ---------------------------------------------------------------------------
// Admin / backoffice types
// ---------------------------------------------------------------------------

export interface AdminOrderItem {
  id?: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryZoneId?: string | null;
  deliveryZone?: { id: string; name: string; region: string; fee: number } | null;
  deliveryAddress?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string | null;
  items: AdminOrderItem[];
  createdAt: string;
  updatedAt?: string;
  paidAt: string | null;
  invoiceFileKey: string | null;
  invoiceFileName: string | null;
  invoiceMimeType: string | null;
  invoiceUploadedAt: string | null;
}

export interface DashboardLowStockItem {
  id: string;
  name: string;
  slug: string;
  stock: number;
}

export interface DashboardStatusBreakdown {
  status: string;
  count: number;
}

export interface DashboardRecentOrder {
  orderNumber: string;
  customerName: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export interface DashboardTopProduct {
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface DashboardStats {
  revenue: number;
  paidOrders: number;
  totalOrders: number;
  customers: number;
  avgOrderValue: number;
  lowStock: {
    threshold: number;
    count: number;
    items: DashboardLowStockItem[];
  };
  statusBreakdown: DashboardStatusBreakdown[];
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
}

export interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface AdminProductImageInput {
  url: string;
  alt?: string;
  sortOrder?: number;
}

export interface AdminProductPayload {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
  brandId?: string | null;
  isOnSale?: boolean;
  isTopSelling?: boolean;
  isPublished?: boolean;
  sku?: string;
  compareAtPrice?: number | null;
  images?: AdminProductImageInput[];
}

// ---------------------------------------------------------------------------
// Communications (bulk SMS)
// ---------------------------------------------------------------------------

export interface CommColumn { key: string; label: string }
export interface ParsedRow { phone: string; data: Record<string, string> }
export interface ParseInvalidRow { rowNumber: number; reason: string }
export interface ParseResult { columns: CommColumn[]; rows: ParsedRow[]; invalid: ParseInvalidRow[] }
export interface ContactListSummary { id: string; name: string; columns: CommColumn[]; contactCount: number; createdAt: string }
export interface ContactListDetail extends ContactListSummary {
  contacts: { id: string; phone: string; data: Record<string, string> }[];
}
export type CampaignStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type RecipientStatus = 'PENDING' | 'SENT' | 'FAILED';
export interface Campaign {
  id: string; message: string; listName: string | null; total: number;
  sentCount: number; failedCount: number; status: CampaignStatus; createdAt: string;
}
export interface CampaignDetail extends Campaign {
  recipients: { id: string; phone: string; status: RecipientStatus; error: string | null; requestId: string | null; sentAt: string | null }[];
}
