export function humanizeStatus(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  PROCESSING: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  READY: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
  OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  PAID: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  FAILED: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
  REFUNDED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
};

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
] as const;

export const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'] as const;

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
        ORDER_STATUS_STYLES[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
        PAYMENT_STATUS_STYLES[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}
