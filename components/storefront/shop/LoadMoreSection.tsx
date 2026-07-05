'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import ProductGrid from './ProductGrid';

const PAGE_SIZE = 24;

export default function LoadMoreSection({ products }: { products: Product[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState('');

  const displayed = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore('loading');
    setTimeout(() => {
      if (visibleCount + PAGE_SIZE >= products.length) {
        setVisibleCount(products.length);
        setLoadingMore('done');
      } else {
        setVisibleCount((prev) => prev + PAGE_SIZE);
        setLoadingMore('');
      }
    }, 800);
  };

  if (products.length === 0) return null;

  return (
    <>
      <div className="w-full mt-6">
        <div className="max-w-[1600px] mx-auto px-4 mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold font-heading text-[#94B447]">All Supplies</h2>
            <p className="text-sm text-gray-500">Browse our extended catalogue of daily essentials.</p>
          </div>
          <Link href="/shop/all-supplies" className="text-sm font-bold text-[#18202D] hover:text-[#94B447] transition-colors flex items-center gap-2">
            View Full Page
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
        <ProductGrid products={displayed} />
      </div>

      {products.length > visibleCount && (
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore === 'loading'}
            className="px-10 py-4 bg-[#18202D] rounded-full text-white font-bold text-sm hover:bg-[#94B447] transition-all shadow-md flex items-center gap-2 min-w-[240px] justify-center disabled:opacity-70"
          >
            {loadingMore === 'loading' ? 'Loading...' : 'Load More Supplies'}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      )}
    </>
  );
}
