'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackingEntryPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;
    setIsNavigating(true);
    router.push(`/tracking/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="w-full min-h-[60vh] bg-white pb-24 pt-32 sm:pt-40">
      <div className="max-w-[560px] mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-heading text-4xl text-[#94B447] font-medium mb-4">Track Your Order</h1>
        <p className="text-[#18202D] text-lg mb-10">
          Enter the order number from your confirmation SMS (e.g. ORD-0E06224407) to see where your
          order is.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="ORD-XXXXXXXXXX"
            autoFocus
            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-[#18202D] font-medium tracking-wide uppercase placeholder:normal-case outline-none focus:border-[#94B447] transition-colors"
          />
          <button
            type="submit"
            disabled={!orderNumber.trim() || isNavigating}
            className="px-10 py-4 bg-[#18202D] text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNavigating ? 'Checking…' : 'Track Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
