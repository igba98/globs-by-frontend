'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const { items, getFormattedTotal } = useCartStore();

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold font-heading text-[#18202D]">Checkout</h1>
        <p className="text-sm font-medium text-gray-400 mt-2">Secure encrypted payment processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Form Panel: Information & Payment */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Section 1: Customer Details */}
          <section>
            <h2 className="text-xl font-bold text-[#18202D] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">1</span>
              Customer Details
            </h2>
            <div className="bg-[#f8f9fa] rounded-2xl p-8 border border-[#18202D]/5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
                <input type="text" placeholder="Last Name" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
              <input type="tel" placeholder="Phone Number (e.g. +255 712...)" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
              <input type="text" placeholder="Delivery Address / Company Building" className="w-full p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium placeholder-gray-400 focus:border-[#18202D]" />
            </div>
          </section>

          {/* Section 2: Mobile Network & Payments */}
          <section>
            <h2 className="text-xl font-bold text-[#18202D] mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#18202D] text-white flex items-center justify-center text-xs">2</span>
              Payment Method
            </h2>
            
            <div className="flex flex-col gap-4">
               {/* Option 1: Mobile Money */}
               <label className="flex items-center justify-between bg-[#f8f9fa] border-2 border-[#18202D] rounded-2xl p-6 cursor-pointer">
                 <div className="flex items-center gap-4">
                   <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-[#18202D]" />
                   <div>
                     <h4 className="text-[15px] font-bold text-[#18202D]">Mobile Network (Tanzania)</h4>
                     <p className="text-[13px] text-gray-500 font-medium">Pay instantly via M-Pesa, Tigo Pesa, or Airtel Money.</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-red-500 border border-red-600"></div> {/* Vodacom Mock */}
                   <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-600"></div> {/* Tigo Mock */}
                   <div className="w-8 h-8 rounded-full bg-red-600 border border-red-700"></div> {/* Airtel Mock */}
                 </div>
               </label>
               
               {/* Internal M-Pesa push form simulation */}
               <div className="bg-[#f8f9fa] border border-[#18202D]/10 rounded-2xl p-6 pl-14">
                  <p className="text-[13px] font-medium text-gray-600 mb-3 cursor-text">Enter your mobile money number to receive a payment prompt on your phone.</p>
                  <input type="tel" placeholder="07XX XXX XXX or 06XX XXX XXX" className="w-full max-w-sm p-4 rounded-xl border border-gray-200 outline-none text-[15px] font-medium shadow-sm placeholder-gray-400 focus:border-[#18202D]" />
               </div>

               {/* Option 2: Credit Card */}
               <label className="flex items-center justify-between bg-white border border-[#18202D]/10 rounded-2xl p-6 cursor-pointer hover:border-[#18202D]/30 transition-colors">
                 <div className="flex items-center gap-4">
                   <input type="radio" name="payment" className="w-5 h-5 accent-[#18202D]" />
                   <div>
                     <h4 className="text-[15px] font-bold text-[#18202D]">Credit Card</h4>
                     <p className="text-[13px] text-gray-500 font-medium">Visa, Mastercard, American Express.</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {/* Visa / MC mock shapes */}
                   <div className="w-10 h-6 bg-blue-100 rounded"></div>
                   <div className="w-10 h-6 bg-orange-100 rounded"></div>
                 </div>
               </label>

            </div>
          </section>

        </div>

        {/* Right Panel: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-[#f8f9fa] rounded-3xl p-8 sticky top-[100px] border border-[#18202D]/5">
            <h3 className="text-xl font-bold text-[#18202D] mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
               {items.map((item: any) => (
                 <div key={item.id} className="flex gap-4">
                   <div className="w-20 h-20 bg-white rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100 p-2">
                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                     <div className="absolute top-[-5px] right-[-5px] w-5 h-5 bg-[#18202D] text-white rounded-full flex items-center justify-center text-[10px] z-10">{item.quantity}</div>
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                     <h4 className="text-[15px] font-bold text-[#18202D]">{item.name}</h4>
                     <p className="text-[13px] font-medium text-gray-500">TZS {(item.price).toLocaleString()}</p>
                   </div>
                   <div className="text-[15px] font-bold text-[#18202D] flex items-center">
                     TZS {(item.price * item.quantity).toLocaleString()}
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex flex-col gap-3 font-medium text-[15px] text-[#18202D] mb-8">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{getFormattedTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping (Dar es Salaam)</span>
                <span>TZS 5,000</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 text-xl font-extrabold pb-2">
                <span>Total</span>
                <span>TZS {(items.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0) + 5000).toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout/success">
              <button className="w-full h-14 bg-[#18202D] text-white font-bold rounded-xl text-[15px] hover:bg-[#94B447] transition-colors shadow-lg flex items-center justify-center gap-2">
                Complete Order
              </button>
            </Link>

            <p className="text-center text-[11px] text-gray-400 mt-6 flex items-center justify-center gap-1 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Standard 256-bit SSL Encryption
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
