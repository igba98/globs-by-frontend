'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/select';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

interface ActiveParams {
  q: string;
  category: string;
  brand: string;
  sort: string;
}

function navigateTo(router: ReturnType<typeof useRouter>, current: ActiveParams, next: Partial<ActiveParams>) {
  const merged = { ...current, ...next };
  const params = new URLSearchParams();
  if (merged.q) params.set('q', merged.q);
  if (merged.category) params.set('category', merged.category);
  if (merged.brand) params.set('brand', merged.brand);
  if (merged.sort && merged.sort !== 'featured') params.set('sort', merged.sort);
  const qs = params.toString();
  router.push(qs ? `/shop/all-supplies?${qs}` : '/shop/all-supplies');
}

/** Search input — rendered beside the page title, same as the original design. */
export function AllSuppliesSearchBox({ q, category, brand, sort }: ActiveParams) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the input in sync when `q` changes externally (e.g. back/forward
  // navigation or the "Clear All Filters" reset) without an effect —
  // adjusting state during render per https://react.dev/learn/you-might-not-need-an-effect.
  if (q !== prevQ) {
    setPrevQ(q);
    setSearchValue(q);
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigateTo(router, { q, category, brand, sort }, { q: value }), 400);
  };

  return (
    <div className="relative w-full md:w-96">
      <input
        type="text"
        placeholder="Search specifically in full inventory..."
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#94B447] outline-none shadow-sm pr-12 text-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
    </div>
  );
}

interface AllSuppliesFilterPanelProps extends ActiveParams {
  categoryOptions: { label: string; value: string }[];
  brandOptions: { label: string; value: string }[];
  resultCount: number;
}

/** Category / brand / sort selects + reset — the detailed filter bar box below the header. */
export default function AllSuppliesFilterBar({
  categoryOptions,
  brandOptions,
  q,
  category,
  brand,
  sort,
  resultCount,
}: AllSuppliesFilterPanelProps) {
  const router = useRouter();
  const current: ActiveParams = { q, category, brand, sort };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Category</label>
          <Select value={category} onValueChange={(v) => navigateTo(router, current, { category: v })} options={categoryOptions} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Brand</label>
          <Select value={brand} onValueChange={(v) => navigateTo(router, current, { brand: v })} options={brandOptions} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Sort By</label>
          <Select value={sort} onValueChange={(v) => navigateTo(router, current, { sort: v })} options={SORT_OPTIONS} />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400">{resultCount} Results Matching Your Criteria</span>
        <button
          onClick={() => router.push('/shop/all-supplies')}
          className="text-xs font-bold text-[#94B447] hover:text-[#18202D] transition-colors flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
