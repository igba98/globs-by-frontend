'use client';

import { useState } from 'react';

// Detailed Mock Inventory Data
const inventoryData = [
  { id: 'INV-001', variantId: 'PRD-001', name: 'Executive Leather Diary 2026', sku: 'ST-ED-001', qty: 45, reserved: 5, incoming: 0, threshold: 10, track: true },
  { id: 'INV-002', variantId: 'PRD-002', name: 'Ergonomic Office Chair V2', sku: 'FN-EOC-22', qty: 12, reserved: 2, incoming: 20, threshold: 5, track: true },
  { id: 'INV-003', variantId: 'PRD-003', name: 'Premium Pen Drop (Box of 10)', sku: 'ST-PEN-10', qty: 120, reserved: 0, incoming: 0, threshold: 20, track: true },
  { id: 'INV-004', variantId: 'PRD-004', name: 'Wireless Mouse Array', sku: 'TC-WMA-04', qty: 4, reserved: 1, incoming: 50, threshold: 15, track: true },
  { id: 'INV-005', variantId: 'PRD-005', name: 'High-Yield Print Toner Black', sku: 'MC-PRT-BLK', qty: 2, reserved: 2, incoming: 0, threshold: 5, track: true },
  { id: 'INV-006', variantId: 'PRD-006', name: 'Scientific Calculator Ultra', sku: 'TC-SCU-99', qty: 8, reserved: 0, incoming: 100, threshold: 20, track: true },
  { id: 'INV-007', variantId: 'PRD-007', name: 'A4 Copier Paper Ream (500s)', sku: 'ST-A4-500', qty: 450, reserved: 150, incoming: 0, threshold: 100, track: true },
  { id: 'INV-008', variantId: 'PRD-008', name: 'Drafting Desk Lamp', sku: 'FN-DL-01', qty: 0, reserved: 0, incoming: 0, threshold: 10, track: true },
];

export default function InventoryManagerPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Inventory Track</h1>
          <p className="text-muted-foreground mt-1">Manage stock allocations, monitor thresholds, and trigger restocks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            Sync Global Stock
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Import CSV File
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-gray-50/50">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search SKU or product name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm" 
              />
            </div>

            <div className="relative inline-block w-40">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>All Inventory</option>
                <option>At Risk / Low Stock</option>
                <option>Out of Stock</option>
                <option>Incoming Shipments</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

          </div>
        </div>

        {/* Tracking Table View */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                <th className="p-4 font-semibold">Product SKU</th>
                <th className="p-4 font-semibold text-center">In Stock</th>
                <th className="p-4 font-semibold text-center">Reserved</th>
                <th className="p-4 font-semibold text-center">Available<br/>(Sellable)</th>
                <th className="p-4 font-semibold text-center">Low Stock<br/>Threshold</th>
                <th className="p-4 font-semibold text-center">Incoming</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {inventoryData.map(item => {
                const available = item.qty - item.reserved;
                const isLowStock = available > 0 && available <= item.threshold;
                const isOutOfStock = available <= 0;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-sm text-primary max-w-xs line-clamp-1">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.sku}</div>
                    </td>
                    <td className="p-4 text-center font-medium text-sm text-gray-700">
                      {item.qty}
                    </td>
                    <td className="p-4 text-center text-sm">
                      {item.reserved > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-700">{item.reserved}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className={`text-lg font-bold font-heading ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-primary'}`}>
                        {available}
                      </div>
                      {(isLowStock || isOutOfStock) && (
                        <div className="text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                           {isOutOfStock ? <span className="text-red-500">Empty</span> : <span className="text-yellow-500">Low Stock</span>}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="group relative inline-flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500 border-b border-dashed border-gray-300 pb-0.5 cursor-help">{item.threshold}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm">
                      {item.incoming > 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700">+{item.incoming} pending</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       <button className="px-3 py-1.5 border border-gray-200 bg-white text-xs font-medium text-primary rounded-lg shadow-sm hover:border-primary transition-colors">
                         Adjust
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
