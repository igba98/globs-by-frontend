'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminProducts, isSessionExpiredError, updateAdminProduct } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Meta, Product } from '@/lib/types';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

const LOW_STOCK_THRESHOLD = 5;

export default function InventoryManagerPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminProducts({ q: q || undefined, page, limit: 30 });
      setProducts(res.data);
      setMeta(res.meta);
      setStockDrafts(Object.fromEntries(res.data.map((p) => [p.id, String(p.stock)])));
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  }, [q, page, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQ(searchQuery.trim());
  };

  const handleSaveStock = async (product: Product) => {
    const raw = stockDrafts[product.id] ?? '';
    const newStock = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(newStock) || newStock < 0) {
      alert('Enter a valid non-negative quantity.');
      return;
    }
    setSavingId(product.id);
    setSavedId(null);
    try {
      const updated = await updateAdminProduct(product.id, { stock: newStock });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      setStockDrafts((prev) => ({ ...prev, [product.id]: String(updated.stock) }));
      setSavedId(product.id);
      setTimeout(() => setSavedId((id) => (id === product.id ? null : id)), 2000);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      alert(err instanceof ApiError ? err.message : 'Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-heading">Inventory Track</h1>
          <p className="text-muted-foreground mt-1">Monitor stock levels and update quantities directly.</p>
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
                placeholder="Search SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingState label="Loading inventory..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No products found.</div>
        ) : (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold text-center">Current Stock</th>
                  <th className="p-4 font-semibold text-center">Update Quantity</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product) => {
                  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
                  const isOutOfStock = product.stock <= 0;
                  const draft = stockDrafts[product.id] ?? String(product.stock);
                  const isDirty = draft !== String(product.stock);
                  const isSaving = savingId === product.id;
                  return (
                    <tr key={product.id} className={`transition-colors ${isOutOfStock ? 'bg-red-50/40' : isLowStock ? 'bg-yellow-50/40' : 'hover:bg-gray-50/50'}`}>
                      <td className="p-4">
                        <div className="font-semibold text-sm text-primary max-w-xs line-clamp-1">{product.name}</div>
                        {product.sku && <div className="text-xs text-muted-foreground font-mono mt-0.5">{product.sku}</div>}
                      </td>
                      <td className="p-4 text-center">
                        <div className={`text-lg font-bold font-heading ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-primary'}`}>
                          {product.stock}
                        </div>
                        {(isLowStock || isOutOfStock) && (
                          <div className="text-[10px] mt-0.5 font-bold uppercase tracking-wider">
                            {isOutOfStock ? <span className="text-red-500">Empty</span> : <span className="text-yellow-500">Low Stock</span>}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={draft}
                          onChange={(e) =>
                            setStockDrafts((prev) => ({ ...prev, [product.id]: e.target.value.replace(/[^0-9]/g, '') }))
                          }
                          className="w-24 text-center border border-gray-200 rounded-lg py-1.5 px-2 text-sm focus:outline-none focus:border-primary transition-colors mx-auto"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          disabled={!isDirty || isSaving}
                          onClick={() => handleSaveStock(product)}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg shadow-sm hover:bg-[#2a3038] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px]"
                        >
                          {isSaving ? '...' : savedId === product.id ? 'Saved' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-primary">{products.length}</span> of{' '}
              <span className="font-semibold text-primary">{meta.total}</span> products
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
