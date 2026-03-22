'use client';

import { useState } from 'react';
import Link from 'next/link';

// Detailed Mock Orders Data
const allOrders = [
  { id: 'ORD-00123', customer: 'Alice Johnson', email: 'alice@example.com', items: 3, total: 'TZS 14,500', payment: 'Paid', status: 'Processing', date: '22 Mar 2026', time: '14:30' },
  { id: 'ORD-00124', customer: 'Bob Smith', email: 'bob@example.com', items: 1, total: 'TZS 45,000', payment: 'Pending', status: 'Pending', date: '22 Mar 2026', time: '11:15' },
  { id: 'ORD-00125', customer: 'Catherine Lee', email: 'cat@example.com', items: 5, total: 'TZS 120,000', payment: 'Paid', status: 'Shipped', date: '21 Mar 2026', time: '09:00' },
  { id: 'ORD-00126', customer: 'David Kim', email: 'david@example.com', items: 2, total: 'TZS 28,000', payment: 'Refunded', status: 'Cancelled', date: '20 Mar 2026', time: '16:45' },
  { id: 'ORD-00127', customer: 'Elias Mtega', email: 'mtega@example.com', items: 1, total: 'TZS 117,000', payment: 'Paid', status: 'Delivered', date: '19 Mar 2026', time: '10:10' },
  { id: 'ORD-00128', customer: 'Fatma Juma', email: 'fatma.j@example.com', items: 8, total: 'TZS 210,000', payment: 'Paid', status: 'Delivered', date: '18 Mar 2026', time: '12:20' },
  { id: 'ORD-00129', customer: 'Grace M.', email: 'gm@company.com', items: 2, total: 'TZS 65,000', payment: 'Paid', status: 'Delivered', date: '15 Mar 2026', time: '08:50' },
  { id: 'ORD-00130', customer: 'Hassan Ali', email: 'hassan@example.com', items: 14, total: 'TZS 850,000', payment: 'Action Required', status: 'Pending', date: '15 Mar 2026', time: '15:10' },
  { id: 'ORD-00131', customer: 'Ivy Retailers', email: 'purchasing@ivy.co.tz', items: 45, total: 'TZS 3,400,000', payment: 'Paid', status: 'Processing', date: '14 Mar 2026', time: '13:00' },
  { id: 'ORD-00132', customer: 'John Doe', email: 'john.doe@gmail.com', items: 4, total: 'TZS 42,000', payment: 'Paid', status: 'Shipped', date: '12 Mar 2026', time: '11:45' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'Paid': 'bg-green-100 text-green-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Action Required': 'bg-red-100 text-red-700',
    'Refunded': 'bg-red-100 text-red-700',
    'Processing': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function OrdersListPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAll = () => {
    if (selectedRows.size === allOrders.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allOrders.map(o => o.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders across your channels.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export CSV
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-gray-50/50">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by order ID, email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm" 
              />
            </div>

            {/* Selects Mock */}
            <div className="relative inline-block w-40">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative inline-block w-40">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>All Payments</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Refunded</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

          </div>
          
          <button className="text-sm text-accent hover:underline font-medium">Clear Filters</button>
        </div>

        {/* Bulk Action Bar Mock */}
        {selectedRows.size > 0 && (
          <div className="bg-accent/10 border-b border-accent/20 px-6 py-3 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-semibold text-primary">{selectedRows.size} orders selected</span>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
               <button className="text-xs font-medium border bg-white border-gray-200 px-3 py-1.5 rounded shadow-sm hover:border-primary transition-colors">Update Status</button>
               <button className="text-xs font-medium border bg-white border-gray-200 px-3 py-1.5 rounded shadow-sm hover:border-primary transition-colors">Export Selected</button>
               <button onClick={() => setSelectedRows(new Set())} className="text-xs font-medium text-red-600 hover:text-red-700 ml-2">Clear Selection</button>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                <th className="p-4 w-12 text-center align-middle">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === allOrders.length && allOrders.length > 0} 
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                  />
                </th>
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
              {allOrders.map(order => {
                const isSelected = selectedRows.has(order.id);
                return (
                  <tr key={order.id} className={`transition-colors ${isSelected ? 'bg-accent/5' : 'hover:bg-gray-50/50'}`}>
                    <td className="p-4 text-center align-middle">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleRow(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-accent hover:underline font-semibold text-sm">
                        {order.id}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-primary">{order.customer}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {order.items} Items
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-sm text-primary">{order.total}</td>
                    <td className="p-4"><StatusBadge status={order.payment} /></td>
                    <td className="p-4"><StatusBadge status={order.status} /></td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-primary">{order.date}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block text-left group">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-transparent group-hover:border-gray-200 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        {/* Mock Dropdown invisible until hover for CSS-only simplicity */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                          <Link href={`/admin/orders/${order.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">View Details</Link>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Update Status</button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Print Invoice</button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Cancel Order</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50">
          <p className="text-muted-foreground">Showing <span className="font-semibold text-primary">1-10</span> of <span className="font-semibold text-primary">248</span> orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-primary hover:bg-gray-50 hover:border-primary transition-colors font-medium">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
