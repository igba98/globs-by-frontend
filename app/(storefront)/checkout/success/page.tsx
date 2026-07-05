import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSettings } from '@/lib/api';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) redirect('/shop');

  const settings = await getSettings().catch(() => null);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-[#94B447]/10 text-[#94B447] rounded-full flex items-center justify-center mb-8 border border-[#94B447]/20 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
           <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-[#94B447] mb-4">
        Order Successful!
      </h1>

      <p className="text-[#18202D] text-[15px] font-medium max-w-md mb-2 leading-relaxed">
        Thank you for your purchase. Your order number is <span className="font-bold text-[#94B447]">#{order}</span>.
      </p>
      <p className="text-[#18202D] text-[15px] font-medium max-w-md mb-10 leading-relaxed">
        We&apos;ve sent you an SMS confirmation.
      </p>

      {settings?.paymentInstructions && (
        <div className="w-full max-w-md bg-[#f8f9fa] border border-[#94B447]/20 rounded-2xl p-6 mb-10 text-left">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#94B447] mb-3">How to Pay</h2>
          <p className="text-[14px] text-[#18202D] whitespace-pre-line leading-relaxed font-medium">
            {settings.paymentInstructions}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={`/tracking/${encodeURIComponent(order)}`}>
          <button className="px-10 py-5 bg-[#94B447] text-white font-bold rounded-xl hover:bg-[#7ea23a] transition-colors shadow-lg text-[15px] w-full">
            Track Your Order
          </button>
        </Link>
        <Link href="/shop">
          <button className="px-10 py-5 bg-[#18202D] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg text-[15px] w-full">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
