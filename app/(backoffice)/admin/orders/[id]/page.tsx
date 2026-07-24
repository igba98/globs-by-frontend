'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminOrder, isSessionExpiredError, updateAdminOrder, uploadOrderInvoice } from '@/lib/admin-api';
import { ApiError, API_BASE } from '@/lib/api';
import { formatDateTime, formatTzs } from '@/lib/format';
import type { AdminOrder } from '@/lib/types';
import { ORDER_STATUSES, OrderStatusBadge, PAYMENT_STATUSES, PaymentStatusBadge, humanizeStatus } from '@/components/backoffice/StatusBadges';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const [invoiceUploading, setInvoiceUploading] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);

  const handleInvoiceFile = async (file: File | undefined) => {
    if (!file || !order) return;
    setInvoiceUploading(true);
    setInvoiceError(null);
    try {
      const updated = await uploadOrderInvoice(order.id, file);
      setOrder(updated);
    } catch (err) {
      if (isSessionExpiredError(err)) { router.replace('/admin/login'); return; }
      setInvoiceError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setInvoiceUploading(false);
      if (invoiceInputRef.current) invoiceInputRef.current.value = '';
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrder(orderId);
      setOrder(data);
      setOrderStatus(data.orderStatus);
      setPaymentStatus(data.paymentStatus);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async () => {
    if (!order) return;
    setSaving(true);
    setSaveError(null);
    setSavedNote(null);
    try {
      const payload: { orderStatus?: string; paymentStatus?: string } = {};
      if (orderStatus !== order.orderStatus) payload.orderStatus = orderStatus;
      if (paymentStatus !== order.paymentStatus) payload.paymentStatus = paymentStatus;
      if (Object.keys(payload).length === 0) {
        setSaving(false);
        return;
      }
      const updated = await updateAdminOrder(order.id, payload);
      setOrder(updated);
      setOrderStatus(updated.orderStatus);
      setPaymentStatus(updated.paymentStatus);
      setSavedNote('Order updated — the customer will be notified by SMS.');
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setSaveError(err instanceof ApiError ? err.message : 'Failed to update order.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading order..." />;
  }

  if (error || !order) {
    return <ErrorState message={error ?? 'Order not found.'} onRetry={load} />;
  }

  const hasChanges = orderStatus !== order.orderStatus || paymentStatus !== order.paymentStatus;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/orders" className="hover:text-primary transition-colors">Orders</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{order.orderNumber}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-primary font-heading">Order {order.orderNumber}</h1>
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
            {order.paymentStatus === 'PAID' && (
              <a
                href={`${API_BASE}/api/orders/${order.orderNumber}/receipt.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-primary hover:border-gray-400 transition-colors"
              >
                View Receipt
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{formatDateTime(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading text-primary">Order Items</h2>
              <p className="text-sm text-muted-foreground mt-1">Products included in this transaction</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold text-right">Unit Price</th>
                    <th className="p-4 font-semibold text-center">Qty</th>
                    <th className="p-4 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {order.items.map((item, idx) => (
                    <tr key={item.id ?? idx} className="hover:bg-gray-50/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center p-2 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div className="font-semibold text-sm text-primary line-clamp-1">{item.productName}</div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm text-gray-500">{formatTzs(item.unitPrice)}</td>
                      <td className="p-4 text-center font-medium text-primary text-sm">× {item.quantity}</td>
                      <td className="p-4 text-right font-semibold text-primary text-sm">{formatTzs(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Block */}
            <div className="p-6 bg-gray-50/50 flex justify-end shrink-0">
              <div className="w-full max-w-xs space-y-3 shrink-0">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary">{formatTzs(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-primary">{formatTzs(order.deliveryFee)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-base font-bold text-primary">Total</span>
                  <span className="text-lg font-bold font-heading text-primary">{formatTzs(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-heading text-primary mb-2">Customer Notes</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{order.notes}</p>
            </div>
          )}

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">

          {/* Invoice */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative z-10">
            <h2 className="text-lg font-bold text-primary mb-1">Invoice</h2>
            <p className="text-xs text-gray-500 mb-4">
              Attach the invoice from your invoicing system. Required before the order can be confirmed — the customer&apos;s SMS links to this file.
            </p>
            {order.invoiceFileName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{order.invoiceFileName}</p>
                    {order.invoiceUploadedAt && (
                      <p className="text-xs text-gray-400">Uploaded {new Date(order.invoiceUploadedAt).toLocaleString()}</p>
                    )}
                  </div>
                  <a
                    href={`${API_BASE}/api/orders/${order.orderNumber}/invoice`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#94B447] hover:underline shrink-0"
                  >
                    View
                  </a>
                </div>
                <button type="button" onClick={() => invoiceInputRef.current?.click()} disabled={invoiceUploading}
                  className="text-sm font-semibold text-gray-500 hover:text-primary disabled:opacity-50">
                  {invoiceUploading ? 'Uploading…' : 'Replace file'}
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => invoiceInputRef.current?.click()} disabled={invoiceUploading}
                className="w-full border-2 border-dashed border-gray-300 hover:border-[#94B447] rounded-xl py-6 text-sm font-semibold text-gray-500 hover:text-primary transition-colors disabled:opacity-50">
                {invoiceUploading ? 'Uploading…' : 'Upload invoice (PDF, Word, or image)'}
              </button>
            )}
            <input ref={invoiceInputRef} type="file" hidden
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp"
              onChange={(e) => handleInvoiceFile(e.target.files?.[0])} />
            {invoiceError && <p className="text-sm text-red-600 mt-3">{invoiceError}</p>}
            {!order.invoiceFileName && order.orderStatus === 'PENDING' && (
              <p className="text-xs text-amber-600 mt-3">Confirming is blocked until an invoice is attached.</p>
            )}
          </div>

          {/* Order Status Controller */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-visible relative z-20">
            <h2 className="text-xl font-heading text-primary mb-6">Update Order</h2>

            {saveError && (
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            )}
            {savedNote && (
              <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {savedNote}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <div className="relative inline-block w-full">
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{humanizeStatus(s)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <div className="relative inline-block w-full">
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{humanizeStatus(s)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving || !hasChanges}
                className="w-full py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-[#2a3038] disabled:opacity-50 transition-colors shadow-sm mt-2"
              >
                {saving ? 'Saving...' : 'Update Status'}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">Changing status or payment notifies the customer by SMS.</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative z-10">
            <h2 className="text-xl font-heading text-primary mb-6">Payment Details</h2>

            <dl className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Payment Status</dt>
                <dd><PaymentStatusBadge status={order.paymentStatus} /></dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Payment Method</dt>
                <dd className="font-medium text-primary text-right">{humanizeStatus(order.paymentMethod)}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <dt className="text-muted-foreground">Delivery Method</dt>
                <dd className="font-medium text-primary text-right">{humanizeStatus(order.deliveryMethod)}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-muted-foreground">Amount Due</dt>
                <dd className="font-bold text-primary">{formatTzs(order.total)}</dd>
              </div>
            </dl>
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative z-10">
            <h2 className="text-xl font-heading text-primary mb-6">Customer Information</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-lg">
                {order.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h3 className="font-bold text-primary text-base">{order.customerName}</h3>
              </div>
            </div>

            <dl className="space-y-4 text-sm mt-4">
              <div className="pt-2">
                <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Contact</dt>
                <dd className="font-medium text-primary flex flex-col gap-1">
                  <a href={`mailto:${order.customerEmail}`} className="text-accent hover:underline">{order.customerEmail}</a>
                  <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">{order.customerPhone}</a>
                </dd>
              </div>
              {order.deliveryZone && (
                <div className="pt-2">
                  <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Delivery Zone</dt>
                  <dd className="font-medium text-primary">{order.deliveryZone.name} ({order.deliveryZone.region})</dd>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="pt-2">
                  <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Delivery Address</dt>
                  <dd className="font-medium text-primary leading-relaxed">{order.deliveryAddress}</dd>
                </div>
              )}
            </dl>
          </div>

        </div>
      </div>
    </div>
  );
}
