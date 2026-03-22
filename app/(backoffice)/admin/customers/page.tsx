'use client';

import { useState } from 'react';
import Link from 'next/link';

// Detailed Mock Customers Data
const allCustomers = [
  { id: 'CUST-801', name: 'Alice Johnson', email: 'alice@innovators.co.tz', phone: '+255 712 345 678', location: 'Dar es Salaam', orders: 14, spent: 'TZS 3,450,000', status: 'Active', joined: '10 Jan 2025' },
  { id: 'CUST-802', name: 'Bob Smith', email: 'bsmith@logistics.com', phone: '+255 754 123 987', location: 'Mwanza', orders: 2, spent: 'TZS 150,000', status: 'Active', joined: '05 Mar 2026' },
  { id: 'CUST-803', name: 'Catherine Lee', email: 'catherine.lee@edu.ac.tz', phone: '+255 788 555 123', location: 'Dar es Salaam', orders: 28, spent: 'TZS 12,500,000', status: 'VIP', joined: '14 Nov 2024' },
  { id: 'CUST-804', name: 'David Kim', email: 'dkim_ventures@gmail.com', phone: '+255 655 444 333', location: 'Arusha', orders: 1, spent: 'TZS 28,000', status: 'Inactive', joined: '20 Mar 2026' },
  { id: 'CUST-805', name: 'Elias Mtega', email: 'mtega.elias@gov.go.tz', phone: '+255 733 999 888', location: 'Dodoma', orders: 45, spent: 'TZS 45,000,000', status: 'VIP', joined: '01 Feb 2024' },
  { id: 'CUST-806', name: 'Fatma Juma', email: 'fatmaj@retailers.com', phone: '+255 711 222 111', location: 'Zanzibar', orders: 8, spent: 'TZS 1,200,000', status: 'Active', joined: '18 Jul 2025' },
  { id: 'CUST-807', name: 'Grace M.', email: 'grace.m@hospitality.co.tz', phone: '+255 755 666 777', location: 'Dar es Salaam', orders: 5, spent: 'TZS 450,000', status: 'Active', joined: '22 Dec 2025' },
  { id: 'CUST-808', name: 'Hassan Ali', email: 'hassan@tech-solutions.com', phone: '+255 784 333 222', location: 'Mbeya', orders: 0, spent: 'TZS 0', status: 'New', joined: '22 Mar 2026' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'VIP': 'bg-accent/20 text-accent border border-accent/40',
    'Active': 'bg-green-100 text-green-700 border border-green-200',
    'Inactive': 'bg-gray-100 text-gray-600 border border-gray-200',
    'New': 'bg-blue-100 text-blue-700 border border-blue-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function CustomersListPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAll = () => {
    if (selectedRows.size === allCustomers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allCustomers.map(c => c.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Customers</h1>
          <p className="text-muted-foreground mt-1">View and manage your entire client database.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export List
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Customers</p>
              <h3 className="text-2xl font-bold text-primary mt-1">1,042</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Members</p>
              <h3 className="text-2xl font-bold text-primary mt-1">890</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">VIP Clients (B2B)</p>
              <h3 className="text-2xl font-bold text-primary mt-1">45</h3>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">New This Month</p>
              <h3 className="text-2xl font-bold text-primary mt-1">+54</h3>
            </div>
         </div>
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
                placeholder="Search by name, email or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm" 
              />
            </div>

            {/* Selects Mock */}
            <div className="relative inline-block w-40">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>All Statuses</option>
                <option>Active</option>
                <option>VIP</option>
                <option>Inactive</option>
                <option>New</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative inline-block w-40">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>Sort By</option>
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Highest Spent</option>
                <option>Most Orders</option>
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
            <span className="text-sm font-semibold text-primary">{selectedRows.size} customers selected</span>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
               <button className="text-xs font-medium border bg-white border-gray-200 px-3 py-1.5 rounded shadow-sm hover:border-primary transition-colors">Send Email</button>
               <button className="text-xs font-medium border bg-white border-gray-200 px-3 py-1.5 rounded shadow-sm hover:border-primary transition-colors">Export Data</button>
               <button onClick={() => setSelectedRows(new Set())} className="text-xs font-medium text-red-600 hover:text-red-700 ml-2">Clear Selection</button>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                <th className="p-4 w-12 text-center align-middle">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === allCustomers.length && allCustomers.length > 0} 
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                  />
                </th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold text-center">Orders</th>
                <th className="p-4 font-semibold text-right">Total Spent</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {allCustomers.map(customer => {
                const isSelected = selectedRows.has(customer.id);
                return (
                  <tr key={customer.id} className={`transition-colors ${isSelected ? 'bg-accent/5' : 'hover:bg-gray-50/50'}`}>
                    <td className="p-4 text-center align-middle">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleRow(customer.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm ${customer.status === 'VIP' ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-sm text-primary hover:text-accent hover:underline transition-colors">{customer.name}</Link>
                          <div className="text-[11px] text-muted-foreground mt-0.5">Joined {customer.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${customer.email}`} className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">{customer.email}</a>
                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{customer.location}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {customer.orders}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-semibold text-sm text-primary">{customer.spent}</div>
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block text-left group">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-transparent group-hover:border-gray-200 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        {/* Hover Dropdown */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-1">
                          <Link href={`/admin/customers/${customer.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> View Profile</Link>
                          <a href={`mailto:${customer.email}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email Customer</a>
                          <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Mark as VIP</button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="23" y2="12"></line><line x1="23" y1="8" x2="19" y2="12"></line></svg> Delete Account</button>
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
          <p className="text-muted-foreground">Showing <span className="font-semibold text-primary">1-8</span> of <span className="font-semibold text-primary">1,042</span> customers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed shadow-sm">Previous</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-primary hover:bg-gray-50 hover:border-primary transition-colors font-medium shadow-sm">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
