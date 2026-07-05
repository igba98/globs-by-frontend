'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  deleteAdminProduct,
  getAdminProducts,
  isSessionExpiredError,
  updateAdminProduct,
} from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { formatTzs } from '@/lib/format';
import type { Meta, Product } from '@/lib/types';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

const StockBadge = ({ count }: { count: number }) => {
  if (count === 0) return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-100 text-red-700">Out of Stock</span>;
  if (count <= 10) return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-yellow-100 text-yellow-700">Low Stock ({count})</span>;
  return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-green-100 text-green-700">{count} in stock</span>;
};

// Toggle switch — clickable, drives the isPublished PATCH.
const StatusSwitch = ({ isOn, onToggle, disabled }: { isOn: boolean; onToggle: () => void; disabled?: boolean }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={isOn ? 'Published — click to unpublish' : 'Hidden — click to publish'}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 disabled:cursor-wait ${isOn ? 'bg-accent' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
};

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminProducts({ q: q || undefined, page, limit: 20 });
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load products.');
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

  const handleTogglePublish = async (product: Product) => {
    setBusyId(product.id);
    try {
      const updated = await updateAdminProduct(product.id, { isPublished: !product.isPublished });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      alert(err instanceof ApiError ? err.message : 'Failed to update product.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusyId(product.id);
    try {
      await deleteAdminProduct(product.id);
      await load();
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      alert(err instanceof ApiError ? err.message : 'Failed to delete product.');
    } finally {
      setBusyId(null);
    }
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

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center flex-1">
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
            <button type="submit" className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingState label="Loading products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No products found.</div>
        ) : (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Inventory</th>
                  <th className="p-4 font-semibold text-center">Published</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {products.map((product) => {
                  const thumb = product.images[0]?.url;
                  const isBusy = busyId === product.id;
                  return (
                    <tr key={product.id} className={`transition-colors ${isBusy ? 'opacity-60' : 'hover:bg-gray-50/50'}`}>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                          {thumb ? (
                            <Image src={thumb} alt={product.name} fill sizes="48px" className="object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          )}
                        </div>
                      </td>
                      <td className="p-4 min-w-[250px]">
                        <div className="font-semibold text-sm text-primary">{product.name}</div>
                        {product.sku && <div className="text-xs text-muted-foreground mt-1 font-mono">{product.sku}</div>}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-medium tracking-wide uppercase">
                          {product.category?.name ?? '—'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-sm text-primary">{formatTzs(product.price)}</td>
                      <td className="p-4">
                        <StockBadge count={product.stock} />
                      </td>
                      <td className="p-4 text-center align-middle">
                        <StatusSwitch isOn={product.isPublished} disabled={isBusy} onToggle={() => handleTogglePublish(product)} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/new?id=${product.id}`} className="px-3 py-1.5 border border-gray-200 bg-white text-xs font-medium text-primary rounded-lg shadow-sm hover:border-primary transition-colors">
                            Edit
                          </Link>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(product)}
                            className="px-3 py-1.5 border border-red-200 bg-white text-xs font-medium text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
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
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50 mt-auto">
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
