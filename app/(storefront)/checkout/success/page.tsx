import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="w-full h-[65vh] flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-[#94B447]/10 text-[#94B447] rounded-full flex items-center justify-center mb-8 border border-[#94B447]/20 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
           <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-[#18202D] mb-4">
        Order Successful!
      </h1>
      
      <p className="text-gray-500 text-[15px] font-medium max-w-md mb-10 leading-relaxed">
        Thank you for your purchase. Your order identifier is <span className="font-bold text-[#18202D]">#ORD-9021</span>. We have sent a confirmation email alongside tracking dispatch details.
      </p>
      
      <Link href="/shop">
         <button className="px-10 py-5 bg-[#18202D] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg text-[15px]">
           Continue Shopping
         </button>
      </Link>
    </div>
  );
}
