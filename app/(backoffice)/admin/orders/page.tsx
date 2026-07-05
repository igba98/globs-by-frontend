'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAdminOrders, isSessionExpiredError } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { formatDate, formatTzs } from '@/lib/format';
import type { AdminOrder, Meta } from '@/lib/types';
import { ORDER_STATUSES, OrderStatusBadge, PAYMENT_STATUSES, PaymentStatusBadge, humanizeStatus } from '@/components/backoffice/StatusBadges';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

export default function OrdersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminOrders({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        q: q || undefined,
        page,
        limit: 20,
      });
      setOrders(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [status, paymentStatus, q, page, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQ(searchQuery.trim());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setQ('');
    setStatus('');
    setPaymentStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders across your channels.</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-gray-50/50">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center flex-1">

            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input
                type="text"
                placeholder="Search by order #, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm"
              />
            </div>

            <div className="relative inline-block w-40">
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer"
              >
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{humanizeStatus(s)}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative inline-block w-40">
              <select
                value={paymentStatus}
                onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
                className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer"
              >
                <option value="">All Payments</option>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{humanizeStatus(s)}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <button type="submit" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Search
            </button>
          </form>

          <button type="button" onClick={clearFilters} className="text-sm text-accent hover:underline font-medium">Clear Filters</button>
        </div>

        {loading ? (
          <LoadingState label="Loading orders..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Payment Status</th>
                  <th className="p-4 font-semibold">Order Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-accent hover:underline font-semibold text-sm">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
                          {order.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-primary">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {order.items.length} Items
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-sm text-primary">{formatTzs(order.total)}</td>
                    <td className="p-4"><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td className="p-4"><OrderStatusBadge status={order.orderStatus} /></td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-primary whitespace-nowrap">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="px-3 py-1.5 border border-gray-200 bg-white text-xs font-medium text-primary rounded-lg shadow-sm hover:border-primary transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-primary">{orders.length}</span> of{' '}
              <span className="font-semibold text-primary">{meta.total}</span> orders
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-primary disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-colors font-medium"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-primary disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-primary transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
