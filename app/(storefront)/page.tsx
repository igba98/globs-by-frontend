import Link from 'next/link';
import Image from 'next/image';

// Rebased from Furniture to Office Supplies/Corporate based on general-instructions.md
const mockCategories = [
  { name: 'Office Supplies', image: 'https://images.unsplash.com/photo-1583590082725-d91ff76b1fca?auto=format&fit=crop&q=80&w=400' },
  { name: 'Tech & Devices', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400' },
  { name: 'Paper Products', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=400' },
  { name: 'Corp Branding', image: 'https://images.unsplash.com/photo-1634546419089-13651dffc5f9?auto=format&fit=crop&q=80&w=400' },
  { name: 'Art Supplies', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
  { name: 'Printing', image: 'https://images.unsplash.com/photo-1621245781308-4663dcc84f47?auto=format&fit=crop&q=80&w=400' },
  { name: 'Breakroom', image: 'https://images.unsplash.com/photo-1584285496417-6d60ea8d35f4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Custom Diaries', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400' },
];

export default function StorefrontHomePage() {
  return (
    <div className="w-full space-y-20 pb-20">
      
      {/* 1. HERO BENTO GRID */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[750px] pt-4">
        
        {/* Left Giant Hero Pane */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#18202D] group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#18202D] via-gray-800 to-[#18202D] opacity-90 transition-transform duration-1000 group-hover:scale-105"></div>
          {/* Mocking corporate supply / modern office backdrop */}
          <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Office Hero" fill className="object-cover opacity-50 mix-blend-overlay" />
          
          {/* Overlapping White Content Card */}
          <div className="absolute bottom-8 left-8 bg-white rounded-3xl p-10 max-w-sm shadow-2xl">
            <h1 className="text-4xl font-extrabold text-[#18202D] leading-tight font-heading">
              Premium Corporate Supply Partner
            </h1>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Discover reliable, affordable, and quality-driven office solutions across Tanzania. From daily stationery to high-tier network tech.
            </p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-[#18202D] font-bold border-b border-[#18202D] pb-1 hover:text-[#94B447] hover:border-[#94B447] transition-colors">
              Explore Catalogue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </Link>
          </div>
        </div>

        {/* Right Giant Hero Pane */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gray-800 group hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 via-gray-700 to-gray-900 opacity-90 transition-transform duration-1000 group-hover:scale-105"></div>
          {/* Workspace flatlay mockup */}
          <Image src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1200" alt="Workspace Flatlay" fill className="object-cover opacity-60 mix-blend-overlay" />
          
          {/* Miniature Floating Glass Card (Executive Diary) */}
          <div className="absolute bottom-16 right-16 bg-white/90 backdrop-blur-md rounded-3xl p-6 w-64 shadow-2xl">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-sm text-xs font-bold text-[#18202D] whitespace-nowrap">
               Executive 2026 Diary
             </div>
             <div className="w-full aspect-square relative my-4">
               {/* Stand-in for Executive Diary */}
               <Image src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400" alt="Leather Diary" fill className="object-cover" />
             </div>
             <div className="bg-[#18202D] text-white text-xs font-bold rounded px-2 py-1 absolute bottom-6 left-6">
               Bulk Discount
             </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BENTO GRID */}
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-[#18202D] mb-12">Supply Categories</h2>
        
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockCategories.map((cat, i) => (
             <Link href={`/shop?cat=${cat.name}`} key={i} className="bg-[#e9ecef] rounded-2xl aspect-[4/5] relative flex items-center justify-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-[#18202D]/5">
               
               {/* Category Pill Tag */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-b-2xl shadow-sm text-[11px] whitespace-nowrap font-bold text-[#18202D] z-10">
                 {cat.name}
               </div>

               {/* Full-Bleed Image Cover */}
               <div className="w-full h-full absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-700">
                 <Image src={cat.image} alt={cat.name} fill className="object-cover" />
               </div>
             </Link>
          ))}
        </div>
      </section>

      {/* 3. ABOUT US BENTO */}
      <section className="w-full">
        <div className="bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
          <h2 className="text-2xl font-bold text-[#18202D]">About Globs-By</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
          
          {/* Left Text Block */}
          <div className="lg:col-span-4 bg-[#f8f9fa] rounded-[2rem] p-12 flex flex-col justify-center">
             <h3 className="text-3xl font-bold text-[#18202D] leading-tight mb-6 max-w-xs">
               Integrity, Innovativeness, and Accountability.
             </h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-10">
               Serving higher education, government parastatals, and heavy industry across Tanzania for over 20 years. We import and supply the definitive standard of corporate enterprise tools.
             </p>
             <div className="flex gap-4">
               <Link href="/about" className="px-6 py-3 bg-[#18202D] text-white text-sm font-bold rounded-xl hover:bg-[#94B447] transition-colors flex items-center gap-2">
                 Company Profile <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
               </Link>
             </div>
          </div>

          {/* Right Image Block - Business Team */}
          <div className="lg:col-span-8 rounded-[2rem] overflow-hidden relative group">
            <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" alt="Corporate B2B Team" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

        </div>
      </section>

      {/* 4. DISCOVER MORE & BEST SERVICES GRID */}
      <section className="w-full">
        {/* Header Block */}
        <div className="bg-[#f8f9fa] rounded-[2rem] py-8 px-12 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#18202D]">Discover More</h2>
          <Link href="/shop" className="text-sm font-bold text-[#18202D] hover:text-[#94B447] transition-colors flex items-center gap-2">
            New Arrival <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </Link>
        </div>

        {/* Top Product Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {mockCategories.slice(0, 3).map((cat, i) => (
             <Link href={`/product/${i}`} key={i} className="bg-[#e9ecef] rounded-[2rem] p-6 relative flex flex-col items-center justify-between group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-[#18202D]/5 h-[300px]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-8 py-2 rounded-b-2xl shadow-sm text-[11px] font-bold text-[#18202D] z-10 whitespace-nowrap">
                 {cat.name}
               </div>
               <div className="w-full h-full absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-700">
                 <Image src={cat.image} alt={cat.name} fill className="object-cover" />
               </div>
             </Link>
          ))}
        </div>

        {/* Bottom Complex Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
          
          {/* Left Tall Image - Corporate Delivery Box / Stationery */}
          <div className="rounded-[2rem] overflow-hidden relative group h-[400px] lg:h-full bg-gray-900 border border-[#18202D]/10">
            <Image src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" alt="B2B Supply Boxes" fill className="object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Right Stack */}
          <div className="flex flex-col gap-6">
            
            {/* Top Services Black Box */}
            <div className="bg-[#18202D] rounded-[2rem] p-12 text-white flex-1 flex flex-col justify-center relative overflow-hidden">
               <div className="flex justify-between items-start mb-12">
                 <h3 className="text-3xl font-bold leading-tight max-w-[200px]">Best Services That We Have</h3>
                 <Link href="/shop" className="px-6 py-2.5 bg-white text-[#18202D] text-sm font-bold rounded-xl hover:bg-[#94B447] hover:text-white transition-colors flex items-center gap-2">
                   Explore Shop <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                 </Link>
               </div>

               <div className="grid grid-cols-3 gap-4 text-center">
                 <div className="flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                   <span className="text-xs text-gray-400">Available to you<br/>24/7</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                   <span className="text-xs text-gray-400 mt-2">Nationwide<br/>shipping</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                   <span className="text-xs text-gray-400 mt-2">B2B Product<br/>Returns</span>
                 </div>
               </div>
            </div>

            {/* Bottom Secondary Image - Printing details / stationery stack */}
            <div className="rounded-[2rem] overflow-hidden relative group flex-1 bg-gray-900 border border-[#18202D]/10">
               <Image src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800" alt="Blank Book Stack" fill className="object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
