'use client';

import { useEffect } from 'react';

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full max-w-2xl mx-auto py-24 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
      </div>
      <h1 className="text-3xl font-extrabold font-heading text-[#18202D] mb-3">Something went wrong</h1>
      <p className="text-gray-500 max-w-md mb-8">
        We couldn&apos;t load this page right now. This is usually temporary — please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-[#18202D] rounded-full text-white font-bold text-sm hover:bg-[#94B447] transition-all shadow-md"
      >
        Try Again
      </button>
    </div>
  );
}
