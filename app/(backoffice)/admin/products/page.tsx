'use client';

import { useState } from 'react';
import Link from 'next/link';

// Detailed Mock Products Data
const allProducts = [
  { id: 'PRD-001', name: 'Executive Leather Diary 2026', sku: 'ST-ED-001', category: 'Paper & Books', price: 'TZS 117,000', stock: 45, status: true, created: '10 Jan 2026', image: '' },
  { id: 'PRD-002', name: 'Ergonomic Office Chair V2', sku: 'FN-EOC-22', category: 'Furniture', price: 'TZS 1,115,000', stock: 12, status: true, created: '15 Jan 2026', image: '' },
  { id: 'PRD-003', name: 'Premium Pen Drop (Box of 10)', sku: 'ST-PEN-10', category: 'Writing Instruments', price: 'TZS 85,000', stock: 120, status: true, created: '20 Jan 2026', image: '' },
  { id: 'PRD-004', name: 'Wireless Mouse Array', sku: 'TC-WMA-04', category: 'Tech Accessories', price: 'TZS 65,000', stock: 4, status: true, created: '05 Feb 2026', image: '' },
  { id: 'PRD-005', name: 'High-Yield Print Toner Black', sku: 'MC-PRT-BLK', category: 'Business Machines', price: 'TZS 320,000', stock: 2, status: true, created: '12 Feb 2026', image: '' },
  { id: 'PRD-006', name: 'Scientific Calculator Ultra', sku: 'TC-SCU-99', category: 'Office Supplies', price: 'TZS 45,000', stock: 8, status: true, created: '18 Feb 2026', image: '' },
  { id: 'PRD-007', name: 'A4 Copier Paper Ream (500 sheets)', sku: 'ST-A4-500', category: 'Paper & Books', price: 'TZS 22,000', stock: 450, status: true, created: '01 Mar 2026', image: '' },
  { id: 'PRD-008', name: 'Drafting Desk Lamp', sku: 'FN-DL-01', category: 'Furniture', price: 'TZS 95,000', stock: 0, status: false, created: '05 Mar 2026', image: '' },
];

const StockBadge = ({ count }: { count: number }) => {
  if (count === 0) return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-100 text-red-700">Out of Stock</span>;
  if (count <= 10) return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-yellow-100 text-yellow-700">Low Stock ({count})</span>;
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-green-100 text-green-700">{count} in stock</span>;
};

// Toggle Switch Mock Component
const StatusSwitch = ({ isOn }: { isOn: boolean }) => {
  return (
    <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-accent' : 'bg-gray-200'}`}>
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  );
};

export default function ProductsListPage() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const toggleAll = () => {
    if (selectedRows.size === allProducts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allProducts.map(p => p.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your complete product catalogue and inventory.</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Product
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters & View Toggle Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm" 
              />
            </div>

            {/* Selects: Category, Stock, Sort */}
            <div className="relative inline-block w-36">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>All Categories</option>
                <option>Office Supplies</option>
                <option>Furniture</option>
                <option>Tech Accessories</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
            </div>

            <div className="relative inline-block w-36">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>Stock Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
            </div>

            <div className="relative inline-block w-36">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg text-sm focus:outline-none focus:border-primary bg-white shadow-sm cursor-pointer">
                <option>Newest</option>
                <option>Oldest</option>
                <option>Price: Low-High</option>
                <option>Price: High-Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-white shadow relative z-10 text-primary' : 'text-gray-400 hover:text-gray-700'}`}
              title="Table View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow relative z-10 text-primary' : 'text-gray-400 hover:text-gray-700'}`}
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
          </div>
        </div>

        {/* Bulk Actions Indicator */}
        {selectedRows.size > 0 && viewMode === 'table' && (
          <div className="bg-accent/10 border-b border-accent/20 px-6 py-3 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-semibold text-primary">{selectedRows.size} products selected</span>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
               <button className="text-xs font-medium border bg-white border-gray-200 px-3 py-1.5 rounded shadow-sm hover:border-primary transition-colors">Edit Selected</button>
               <button className="text-xs font-medium border bg-white border-red-200 text-red-600 px-3 py-1.5 rounded shadow-sm hover:border-red-600 hover:bg-red-50 transition-colors">Delete Selected</button>
               <button onClick={() => setSelectedRows(new Set())} className="text-xs font-medium text-gray-500 hover:text-gray-700 ml-2">Clear Selection</button>
            </div>
          </div>
        )}

        {/* Dynamic View rendering */}
        {viewMode === 'table' ? (
          
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 w-12 text-center align-middle">
                    <input type="checkbox" checked={selectedRows.size === allProducts.length && allProducts.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" />
                  </th>
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Inventory</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold">Date Added</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {allProducts.map((product) => {
                  const isSelected = selectedRows.has(product.id);
                  return (
                    <tr key={product.id} className={`transition-colors ${isSelected ? 'bg-accent/5' : 'hover:bg-gray-50/50'}`}>
                      <td className="p-4 text-center align-middle">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleRow(product.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" />
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                      </td>
                      <td className="p-4 min-w-[250px]">
                        <div className="font-semibold text-sm text-primary">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono">{product.sku}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-medium tracking-wide uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-sm text-primary">{product.price}</td>
                      <td className="p-4">
                        <StockBadge count={product.stock} />
                      </td>
                      <td className="p-4 text-center align-middle">
                        <StatusSwitch isOn={product.status} />
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{product.created}</td>
                      <td className="p-4 text-right">
                        <div className="relative inline-block text-left group">
                          <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-white border border-transparent group-hover:border-gray-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-1 origin-top-right">
                            <Link href={`/product/${product.sku || product.id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview Storefront</Link>
                            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit Product</Link>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Duplicate</button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        ) : (

          /* Grid View Layout */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-white shrink-0 min-h-[500px]">
            {allProducts.map((product) => (
              <div key={product.id} className="group relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                <div className="aspect-square w-full bg-gray-50 relative flex items-center justify-center p-6 border-b border-gray-100">
                  <div className="absolute top-2 left-2 z-10"><StockBadge count={product.stock} /></div>
                  <div className="absolute top-2 right-2 z-10">
                     <div className="relative inline-block text-left group">
                          <button className="p-1.5 text-gray-500 hover:text-primary transition-colors bg-white/80 backdrop-blur border border-transparent group-hover:border-gray-200 shadow rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1 origin-top-right">
                            <Link href={`/product/${product.sku}`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Preview</Link>
                            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit</Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete</button>
                          </div>
                     </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold line-clamp-1 pr-2">{product.category}</p>
                    <StatusSwitch isOn={product.status} />
                  </div>
                  <h3 className="font-semibold text-sm text-primary line-clamp-2 mt-1 mb-2 leading-snug">{product.name}</h3>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="font-bold text-lg text-primary">{product.price.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50 mt-auto">
          <p className="text-muted-foreground">Showing <span className="font-semibold text-primary">8</span> products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-primary hover:bg-gray-50 hover:border-primary transition-colors font-medium">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
