'use client';

import { use } from 'react';
import Link from 'next/link';

// Detailed Mock Data for single Customer Profile
const customerDetails = {
  id: 'CUST-803',
  name: 'Catherine Lee',
  email: 'catherine.lee@edu.ac.tz',
  phone: '+255 788 555 123',
  address: 'Block A, University Circle, Dar es Salaam',
  status: 'VIP',
  joined: '14 Nov 2024',
  metrics: {
    totalOrders: 28,
    totalSpent: 'TZS 12,500,000',
    avgOrderValue: 'TZS 446,428',
    lastOrder: '21 Mar 2026'
  },
  recentOrders: [
    { id: 'ORD-00125', items: 5, total: 'TZS 120,000', status: 'Shipped', date: '21 Mar 2026' },
    { id: 'ORD-00118', items: 12, total: 'TZS 850,000', status: 'Delivered', date: '05 Mar 2026' },
    { id: 'ORD-00094', items: 3, total: 'TZS 42,000', status: 'Delivered', date: '18 Feb 2026' },
    { id: 'ORD-00045', items: 45, total: 'TZS 4,500,000', status: 'Delivered', date: '02 Dec 2025' }
  ],
  internalNotes: 'Key procurement officer for edu tech. Requires official tax invoices for all bulk purchases above TZS 1M. Always dispatch to the main admin block.'
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Shipped': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const customerId = unwrappedParams.id; // Using mock data matching CUST-803 for visual display

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/admin/customers" className="hover:text-primary transition-colors">Customers</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{customerId}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-primary font-heading">Customer Profile</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-accent/20 text-accent border border-accent/30 shadow-sm">{customerDetails.status}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email Customer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm">
            Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (1/3) Identity & Contact */}
        <div className="space-y-8">
          
          {/* Main Identity Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center p-8 relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
            <div className="w-24 h-24 bg-accent text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
              {customerDetails.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <h2 className="text-xl font-bold text-primary font-heading">{customerDetails.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">Customer since {customerDetails.joined}</p>
            
            <div className="w-full mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <a href={`mailto:${customerDetails.email}`} className="text-primary hover:text-accent transition-colors font-medium truncate">{customerDetails.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span className="text-primary font-medium">{customerDetails.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <span className="text-gray-600 leading-relaxed">{customerDetails.address}</span>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">Internal Notes</h2>
            <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
              {customerDetails.internalNotes}
            </div>
            <button className="w-full mt-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
               Update Note
            </button>
          </div>

        </div>

        {/* Right Column (2/3) Metrics & Orders */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* KPI Mini-Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Spent</p>
              <h3 className="text-xl font-bold text-primary mt-2">{customerDetails.metrics.totalSpent}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Orders</p>
              <h3 className="text-xl font-bold text-primary mt-2">{customerDetails.metrics.totalOrders}</h3>
            </div>
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg Order</p>
              <h3 className="text-xl font-bold text-primary mt-2">{customerDetails.metrics.avgOrderValue}</h3>
            </div>
             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Order</p>
              <h3 className="text-xl font-bold text-primary mt-2">{customerDetails.metrics.lastOrder}</h3>
            </div>
          </div>

          {/* Order History Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-heading font-semibold text-primary">Order History</h2>
              <button className="text-sm font-medium text-accent hover:underline">View All 28 Orders</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold text-center">Items</th>
                    <th className="p-4 font-semibold text-right">Total</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {customerDetails.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-accent hover:underline font-semibold text-sm">
                          {order.id}
                        </Link>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                          {order.items}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-sm text-primary">{order.total}</td>
                      <td className="p-4 text-center"><StatusBadge status={order.status} /></td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

           {/* Quick Actions Array */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-300 transition-colors cursor-pointer group flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary group-hover:text-accent transition-colors">Issue Refund or Credit</h4>
                  <p className="text-xs text-muted-foreground mt-1">Manage store credit balance</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
             </div>
             
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-red-200 transition-colors cursor-pointer group flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary group-hover:text-red-600 transition-colors">Archive Customer</h4>
                  <p className="text-xs text-muted-foreground mt-1">Suspend future orders</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
