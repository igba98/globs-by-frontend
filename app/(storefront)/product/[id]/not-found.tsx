import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="w-full max-w-7xl mx-auto py-24 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <h1 className="text-3xl font-extrabold font-heading text-[#18202D] mb-3">Product not found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        This product may have been removed, renamed, or is no longer available.
      </p>
      <Link
        href="/shop"
        className="px-8 py-3 bg-[#18202D] rounded-full text-white font-bold text-sm hover:bg-[#94B447] transition-all shadow-md"
      >
        Back to Shop
      </Link>
    </div>
  );
}
