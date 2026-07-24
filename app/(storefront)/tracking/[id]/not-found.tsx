import Link from 'next/link';

export default function TrackingNotFound() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 border border-red-100 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-[#94B447] mb-4">
        Order Not Found
      </h1>

      <p className="text-[#18202D] text-[15px] font-medium max-w-md mb-10 leading-relaxed">
        We couldn&apos;t find an order with that number. Double-check the order number from your
        confirmation SMS or email and try again.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/tracking">
          <button className="px-10 py-5 bg-[#18202D] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg text-[15px]">
            Try Another Number
          </button>
        </Link>
        <Link href="/shop">
          <button className="px-10 py-5 bg-white border-2 border-gray-200 text-[#18202D] font-bold rounded-xl hover:border-gray-400 transition-colors text-[15px]">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
