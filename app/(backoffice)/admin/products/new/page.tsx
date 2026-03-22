'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductCreationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Saving
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Add New</span>
          </nav>
          <h1 className="text-3xl font-bold text-primary font-heading">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product listing for your storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
            Discard
          </Link>
          <button onClick={handleSave} disabled={loading} className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] disabled:opacity-70 transition-colors shadow-sm">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">General Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. Executive Leather Diary 2026" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <textarea rows={6} placeholder="Detailed product description (HTML/Markdown supported)..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20 resize-y"></textarea>
                <p className="text-xs text-muted-foreground mt-1.5">Max 2000 characters. Keep it clear and engaging.</p>
              </div>
            </div>
          </div>

          {/* Media / Images Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-heading font-semibold text-primary">Media</h2>
               <button type="button" className="text-sm text-accent hover:underline font-medium">Add URL</button>
            </div>
            
            {/* Drag & Drop Zone */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-accent/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <p className="text-sm font-medium text-primary">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (TZS) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                  <input required type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price (TZS)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                  <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">To show a crossed-out discount.</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Cost per item (Internal)</label>
                 <div className="relative max-w-xs">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                   <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
                 </div>
                 <p className="text-[11px] text-muted-foreground mt-1">Customers won't see this. Used to calculate profit margins.</p>
               </div>
            </div>
          </div>

          {/* Inventory Tracking Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">Inventory</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input type="text" placeholder="e.g. ST-ED-001" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20 font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode (ISBN, UPC, GTIN)</label>
                <input type="text" placeholder="Scan or enter barcode" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label>
                <input type="number" placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input type="number" placeholder="10" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
               <input type="checkbox" id="track-inventory" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
               <label htmlFor="track-inventory" className="text-sm font-medium text-gray-700 cursor-pointer">Track inventory automatically</label>
            </div>
             <div className="flex items-center gap-3 mt-3">
               <input type="checkbox" id="allow-backorder" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
               <label htmlFor="allow-backorder" className="text-sm font-medium text-gray-700 cursor-pointer">Continue selling when out of stock (Allow backorders)</label>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (1/3) */}
        <div className="space-y-8">
          
          {/* Status Mapping */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">Product Status</h2>
            
            <div className="relative inline-block w-full">
              <select className="appearance-none w-full border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white shadow-sm cursor-pointer">
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
               <h3 className="text-sm font-medium text-gray-700 mb-3">Product Organization</h3>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                   <select className="w-full border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm bg-white cursor-pointer">
                     <option>Office Supplies</option>
                     <option>Paper & Books</option>
                     <option>Tech Accessories</option>
                     <option>Furniture</option>
                     <option>Business Machines</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tags</label>
                   <input type="text" placeholder="e.g. Vintage, Leather, Premium..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                   <p className="text-[10px] text-muted-foreground mt-1">Separate tags with commas</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Delivery & Dimensions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">Shipping & Delivery</h2>
            
            <div className="flex items-center gap-3 mb-4">
               <input type="checkbox" id="physical-product" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
               <label htmlFor="physical-product" className="text-sm font-medium text-gray-700 cursor-pointer">This is a physical product</label>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Weight</label>
                <div className="flex">
                  <input type="number" placeholder="0.0" className="w-full border border-gray-200 border-r-0 rounded-l-lg pl-3 pr-2 py-2 text-sm focus:outline-none focus:border-primary z-10" />
                  <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-r-lg px-3 focus:outline-none">
                    <option>kg</option>
                    <option>g</option>
                    <option>lb</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
