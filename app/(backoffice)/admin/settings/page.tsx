'use client';

import { useState } from 'react';

// Mock Data for Settings
const storeDetails = {
  name: 'Globs-By Limited',
  email: 'admin@globs-by.co.tz',
  phone: '+255 712 345 678',
  address: 'Kariakoo, Dar es Salaam',
  currency: 'TZS',
};

// Utilities for native CSV export
function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      // @ts-ignore
      return keys.map(k => {
        // @ts-ignore
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date
          ? cell.toLocaleString()
          : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Generate Mock Payload Data for the CSVs
const generateMockOrders = () => {
  return Array.from({ length: 50 }).map((_, i) => ({
    OrderID: `ORD-${1000 + i}`,
    Customer: `Client ${i + 1}`,
    TotalAmount: Math.floor(Math.random() * 500000) + 15000,
    Status: i % 3 === 0 ? 'Delivered' : i % 2 === 0 ? 'Pending' : 'Shipped',
    Date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0]
  }));
};

const generateMockCustomers = () => {
  return Array.from({ length: 40 }).map((_, i) => ({
    CustomerID: `CUST-${800 + i}`,
    Name: `Corporate Partner ${i + 1}`,
    Email: `partner${i+1}@example.com`,
    TotalSpent: Math.floor(Math.random() * 5000000) + 100000,
    Joined: '2025-01-15'
  }));
};

const generateMockInventory = () => {
  return [
    { SKU: 'EXEC-01', Name: 'Executive Diary', Qty: 140, Reserved: 20 },
    { SKU: 'FRN-02', Name: 'Ergonomic Chair', Qty: 15, Reserved: 3 },
    { SKU: 'PPR-01', Name: 'A4 Copier Paper', Qty: 500, Reserved: 120 },
    { SKU: 'TCH-04', Name: 'Wireless Mouse', Qty: 4, Reserved: 2 },
  ];
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setIsExporting(type);
    
    // Simulate slight delay for realism
    setTimeout(() => {
      if (type === 'orders') exportToCSV('globsby_orders_export.csv', generateMockOrders());
      if (type === 'customers') exportToCSV('globsby_customers_export.csv', generateMockCustomers());
      if (type === 'inventory') exportToCSV('globsby_inventory_export.csv', generateMockInventory());
      setIsExporting(null);
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'Store Details', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { id: 'security', label: 'Security & Access', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
    { id: 'export', label: 'Data Export (CSV)', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> },
  ];

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store preferences, security, and data exports.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
          <nav className="space-y-1 relative">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#18202D] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-[#18202D] mb-6 border-b border-gray-100 pb-4">Store Identity</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Store Name</label>
                    <input type="text" defaultValue={storeDetails.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Contact Email</label>
                    <input type="email" defaultValue={storeDetails.email} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none" disabled />
                    <p className="text-xs text-muted-foreground mt-1">Contact IT to change root email.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Support Phone</label>
                    <input type="tel" defaultValue={storeDetails.phone} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Base Currency</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all">
                      <option value="TZS">TZS (Tanzanian Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="KES">KES (Kenyan Shilling)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-500">Physical Address</label>
                    <textarea defaultValue={storeDetails.address} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all resize-none"></textarea>
                  </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                 <button className="px-6 py-2.5 bg-[#18202D] text-white font-bold rounded-xl shadow-sm hover:bg-[#253041] transition-colors">
                   Save Configuration
                 </button>
               </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <h2 className="text-xl font-bold text-[#18202D] mb-6 border-b border-gray-100 pb-4">Update Password</h2>
               <div className="max-w-md space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
                 </div>
                 <button className="w-full px-6 py-3 bg-[#18202D] text-white font-bold rounded-xl shadow-sm hover:bg-[#253041] transition-colors">
                   Update Password
                 </button>
               </div>

               <div className="mt-12 pt-8 border-t border-red-100">
                 <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                 <p className="text-sm text-gray-500 mb-4">Clearing cache will forcibly log out all current staff members from the system. Use with caution.</p>
                 <button className="px-5 py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold transition-all">
                   Force Global Logout
                 </button>
               </div>
            </div>
          )}

          {/* Export Tab (The CSV Logic) */}
          {activeTab === 'export' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                 <h2 className="text-xl font-bold text-[#18202D]">Database Export</h2>
                 <p className="text-sm text-muted-foreground mt-1 mb-8">Download your entire historical data formatted perfectly for Excel or ERP importing.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Export Card 1 */}
                 <div className="border border-gray-200 rounded-2xl p-5 flex flex-col hover:border-[#C9A84C] hover:shadow-md transition-all group">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                   </div>
                   <h3 className="text-lg font-bold text-[#18202D] mb-1">Orders Logistics</h3>
                   <p className="text-xs text-gray-500 mb-6 flex-1">Extract 50 latest transactions including status and gross revenue.</p>
                   <button 
                     disabled={isExporting === 'orders'}
                     onClick={() => handleExport('orders')}
                     className="w-full flex justify-center items-center gap-2 py-2.5 bg-gray-50 group-hover:bg-[#18202D] text-gray-700 group-hover:text-white border border-gray-200 group-hover:border-[#18202D] rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                   >
                     {isExporting === 'orders' ? (
                       <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     )}
                     {isExporting === 'orders' ? 'Extracting...' : 'Export .CSV'}
                   </button>
                 </div>

                 {/* Export Card 2 */}
                 <div className="border border-gray-200 rounded-2xl p-5 flex flex-col hover:border-[#C9A84C] hover:shadow-md transition-all group">
                   <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                   </div>
                   <h3 className="text-lg font-bold text-[#18202D] mb-1">CRM Database</h3>
                   <p className="text-xs text-gray-500 mb-6 flex-1">Export 40 registered profiles alongside LTV (Lifetime Value) metrics.</p>
                   <button 
                     disabled={isExporting === 'customers'}
                     onClick={() => handleExport('customers')}
                     className="w-full flex justify-center items-center gap-2 py-2.5 bg-gray-50 group-hover:bg-[#18202D] text-gray-700 group-hover:text-white border border-gray-200 group-hover:border-[#18202D] rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                   >
                     {isExporting === 'customers' ? (
                       <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     )}
                     {isExporting === 'customers' ? 'Extracting...' : 'Export .CSV'}
                   </button>
                 </div>

                 {/* Export Card 3 */}
                 <div className="border border-gray-200 rounded-2xl p-5 flex flex-col hover:border-[#C9A84C] hover:shadow-md transition-all group md:col-span-2">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-[#18202D] mb-1">Live Inventory Levels</h3>
                       <p className="text-xs text-gray-500">Extracts the most recent SKUs mapped against real reserved/available allocations.</p>
                     </div>
                   </div>
                   <button 
                     disabled={isExporting === 'inventory'}
                     onClick={() => handleExport('inventory')}
                     className="w-full sm:w-auto self-start mt-2 px-6 flex justify-center items-center gap-2 py-2.5 bg-gray-50 group-hover:bg-[#18202D] text-gray-700 group-hover:text-white border border-gray-200 group-hover:border-[#18202D] rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                   >
                     {isExporting === 'inventory' ? (
                       <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                     )}
                     {isExporting === 'inventory' ? 'Extracting...' : 'Export .CSV'}
                   </button>
                 </div>

               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
