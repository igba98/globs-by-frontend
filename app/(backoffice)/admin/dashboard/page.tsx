'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDashboardStats, isSessionExpiredError } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { formatDate, formatTzs } from '@/lib/format';
import type { DashboardStats } from '@/lib/types';
import { OrderStatusBadge, PaymentStatusBadge, humanizeStatus } from '@/components/backoffice/StatusBadges';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PROCESSING: '#6366f1',
  READY: '#8b5cf6',
  OUT_FOR_DELIVERY: '#ec4899',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (error || !stats) {
    return <ErrorState message={error ?? 'Failed to load dashboard data.'} onRetry={load} />;
  }

  const circumference = 2 * Math.PI * 40;
  const totalStatusCount = stats.statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  let offsetAcc = 0;
  const donutSegments = stats.statusBreakdown.map((s) => {
    const fraction = totalStatusCount > 0 ? s.count / totalStatusCount : 0;
    const length = fraction * circumference;
    const segment = {
      status: s.status,
      count: s.count,
      strokeDasharray: `${length} ${circumference - length}`,
      strokeDashoffset: -offsetAcc,
      color: STATUS_COLORS[s.status] ?? '#9ca3af',
    };
    offsetAcc += length;
    return segment;
  });

  const kpis = [
    { title: 'Total Revenue', value: formatTzs(stats.revenue), subtitle: `${stats.paidOrders} paid orders` },
    { title: 'Total Orders', value: String(stats.totalOrders), subtitle: `${stats.paidOrders} paid` },
    { title: 'Total Customers', value: String(stats.customers), subtitle: 'Unique buyers' },
    { title: 'Avg. Order Value', value: formatTzs(stats.avgOrderValue), subtitle: 'Across all orders' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-16 max-w-[1600px] mx-auto">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-white to-transparent p-6 rounded-3xl border border-gray-100/50 shadow-[0_2px_40px_rgb(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-[#18202D] font-heading tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium">Welcome back to Globs-By Admin. Here&apos;s your enterprise system status.</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={kpi.title} className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-accent' : 'bg-orange-500'} -translate-y-1/2 translate-x-1/2`}></div>

            <h3 className="text-sm font-semibold text-gray-500 tracking-wide">{kpi.title}</h3>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-[#18202D] tracking-tight">{kpi.value}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{kpi.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Top Products */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative flex flex-col">
          <div className="mb-6">
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Top Products</h3>
            <p className="text-sm text-muted-foreground mt-1">Best sellers by quantity and revenue</p>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground py-12">No sales data yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-center">Qty Sold</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {stats.topProducts.map((p) => (
                    <tr key={p.productName} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-semibold text-sm text-[#18202D]">{p.productName}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-600">{p.quantitySold}</td>
                      <td className="px-4 py-4 text-right font-bold text-sm text-[#18202D]">{formatTzs(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders by Status Donut */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center relative overflow-hidden">
          <div className="w-full text-left mb-8 z-10">
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Orders by Status</h3>
            <p className="text-sm text-muted-foreground mt-1">Live fulfillment tracking</p>
          </div>

          {totalStatusCount === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground py-12">No orders yet.</div>
          ) : (
            <>
              <div className="relative w-56 h-56 flex items-center justify-center z-10 my-4">
                <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="16" />
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.status}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-1000"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-[22px] rounded-full shadow-inner">
                  <span className="text-4xl font-black text-[#18202D] tracking-tighter">{totalStatusCount}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>

              <div className="w-full mt-8 space-y-3 px-2 z-10 flex-1 flex flex-col justify-end">
                {donutSegments.map((seg) => (
                  <div key={seg.status} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
                      <span className="text-sm font-semibold text-gray-700">{humanizeStatus(seg.status)}</span>
                    </div>
                    <span className="font-bold text-[#18202D]">{seg.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Low Stock */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-b from-gray-50/50 to-white">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Low Stock Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">Products at or below {stats.lowStock.threshold} units ({stats.lowStock.count} total)</p>
          </div>
          <Link href="/admin/inventory" className="text-sm font-bold text-primary hover:text-accent transition-colors">Manage Inventory</Link>
        </div>
        {stats.lowStock.items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">All products are well stocked.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.lowStock.items.map((item) => (
              <div key={item.id} className="p-4 sm:px-8 flex items-center justify-between">
                <Link href={`/admin/products/new?id=${item.id}`} className="font-medium text-sm text-[#18202D] hover:text-accent transition-colors">
                  {item.name}
                </Link>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${item.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-end bg-gradient-to-b from-gray-50/50 to-white">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mt-1">Your latest transactions across all channels</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-bold text-primary group flex items-center gap-2 hover:text-accent transition-colors">
            View All Orders <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto p-4 sm:p-6 lg:p-8 pt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-5">Order #</th>
                  <th className="px-4 py-5">Customer</th>
                  <th className="px-4 py-5 font-extrabold text-[#18202D]">Total</th>
                  <th className="px-4 py-5">Payment</th>
                  <th className="px-4 py-5">Status</th>
                  <th className="px-4 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80 bg-white">
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-6">
                      {/* The dashboard stats endpoint doesn't return a DB id for recent orders,
                          only orderNumber — so we route through the searchable orders list
                          rather than a detail URL we can't resolve. */}
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(order.orderNumber)}`}
                        className="font-mono text-accent hover:underline font-bold text-sm bg-accent/5 px-2 py-1 rounded"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm bg-primary text-white">
                          {order.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="font-bold text-sm text-[#18202D]">{order.customerName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-6 font-bold text-[15px] text-[#18202D] tracking-tight">{formatTzs(order.total)}</td>
                    <td className="px-4 py-6"><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td className="px-4 py-6"><OrderStatusBadge status={order.orderStatus} /></td>
                    <td className="px-4 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
