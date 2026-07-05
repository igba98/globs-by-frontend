'use client';

import { useRouter } from 'next/navigation';

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Featured Supplies', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

interface SortSelectProps {
  basePath: string;
  currentSort: string;
  category?: string;
  q?: string;
}

export default function SortSelect({ basePath, currentSort, category, q }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (sort: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    if (sort && sort !== 'featured') params.set('sort', sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-[#f8f9fa] rounded-xl px-4 py-2 text-sm font-bold text-[#18202D] outline-none border border-gray-200 focus:border-[#94B447] cursor-pointer"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
