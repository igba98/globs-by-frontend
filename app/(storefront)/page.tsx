import Link from 'next/link';
import Image from 'next/image';

const supplyCategories = [
  { name: 'A4 Copy Paper', image: '/logo/SUPPLY/1. A4 Copy Paper.jpeg' },
  { name: 'Mesh Office Document Trays', image: '/logo/SUPPLY/2. Mesh Office Document Trays.jpeg' },
  { name: 'Legal Papers', image: '/logo/SUPPLY/3. Legal Papers.webp' },
  { name: 'Thermal Paper Rolls', image: '/logo/SUPPLY/4. Thermal Paper Rolls .jpeg' },
  { name: 'Manilla Cards', image: '/logo/SUPPLY/5. Manilla Cards.jpeg' },
  { name: 'Rubber Bands', image: '/logo/SUPPLY/6. Rubber Bands.webp' },
  { name: 'Correction Pens', image: '/logo/SUPPLY/7. Correction Pens.webp' },
  { name: 'Shorthand Notebooks', image: '/logo/SUPPLY/8. Shorthand Notebooks.webp' },
  { name: 'Stapler Machines', image: '/logo/SUPPLY/9. Stapler Machines.webp' },
  { name: 'PVC Spring Files', image: '/logo/SUPPLY/10. PVC Spring Files.jpeg' },
  { name: 'Paper Shredder Machines', image: '/logo/SUPPLY/11. Paper Shredder Machines.jpeg' },
  { name: 'Cartridges & Toners', image: '/logo/SUPPLY/12. Cartridges & Toners.png' },
];

export default function StorefrontHomePage() {
  return (
    <div className="w-full space-y-20 pb-20">
      
      {/* 1. HERO BENTO GRID */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[750px] pt-4">
        
        {/* Left Giant Hero Pane */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#18202D] group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#18202D] via-gray-800 to-[#18202D] opacity-90 transition-transform duration-1000 group-hover:scale-105"></div>
          <Image src="/logo/SUPPLY/1. A4 Copy Paper.jpeg" alt="Office Hero" fill className="object-cover opacity-50 mix-blend-overlay" />
          
          {/* Overlapping White Content Card */}
          <div className="absolute bottom-8 left-8 bg-white rounded-3xl p-10 max-w-sm shadow-2xl">
            <h1 className="text-4xl font-extrabold text-[#18202D] leading-tight font-heading">
              Premium Corporate Supply Partner
            </h1>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Globs-by is your playground for top quality stationary products. Our lovingly hand-crafted accessories are created to spark creativity and make ordinary tasks more delightful.
            </p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 text-[#18202D] font-bold border-b border-[#18202D] pb-1 hover:text-[#94B447] hover:border-[#94B447] transition-colors">
              Explore Catalogue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </Link>
          </div>
        </div>

        {/* Right Giant Hero Pane */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gray-800 group hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 via-gray-700 to-gray-900 opacity-90 transition-transform duration-1000 group-hover:scale-105"></div>
          <Image src="/logo/SUPPLY/9. Stapler Machines.webp" alt="Workspace Flatlay" fill className="object-cover opacity-60 mix-blend-overlay" />
          
          {/* Miniature Floating Glass Card */}
          <div className="absolute bottom-16 right-16 bg-white/90 backdrop-blur-md rounded-3xl p-6 w-64 shadow-2xl">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-sm text-xs font-bold text-[#18202D] whitespace-nowrap">
               6–24 Hours Delivery
             </div>
             <div className="w-full aspect-square relative my-4">
               <Image src="/logo/SUPPLY/8. Shorthand Notebooks.webp" alt="Shorthand Notebooks" fill className="object-cover rounded-xl" />
             </div>
             <div className="bg-[#18202D] text-white text-xs font-bold rounded px-2 py-1 absolute bottom-6 left-6">
               Bulk Discount
             </div>
          </div>
        </div>
      </section>

      {/* 2. SUPPLY CATEGORIES GRID */}
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-[#18202D] mb-12">Supply Categories</h2>
        
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {supplyCategories.map((cat, i) => (
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
               Integrity, Innovation, and Accountability.
             </h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-10">
               Globs-by is your playground for top quality stationary products. Our lovingly hand-crafted accessories are created to spark creativity and make ordinary tasks more delightful. Serving clients across Tanzania for over 20 years.
             </p>
             <div className="flex gap-4">
               <Link href="/about" className="px-6 py-3 bg-[#18202D] text-white text-sm font-bold rounded-xl hover:bg-[#94B447] transition-colors flex items-center gap-2">
                 Company Profile <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
               </Link>
             </div>
          </div>

          {/* Right Image Block */}
          <div className="lg:col-span-8 rounded-[2rem] overflow-hidden relative group">
            <Image src="/logo/SUPPLY/2. Mesh Office Document Trays.jpeg" alt="Corporate B2B Team" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
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
          {supplyCategories.slice(0, 3).map((cat, i) => (
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
          
          {/* Left Tall Image */}
          <div className="rounded-[2rem] overflow-hidden relative group h-[400px] lg:h-full bg-gray-900 border border-[#18202D]/10">
            <Image src="/logo/SUPPLY/12. Cartridges & Toners.png" alt="B2B Supply" fill className="object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
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
                   <span className="text-xs text-gray-400">20+ Years<br/>in Market</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                   <span className="text-xs text-gray-400 mt-2">6–24 Hours<br/>Delivery</span>
                 </div>
                 <div className="flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                   <span className="text-xs text-gray-400 mt-2">200+ Happy<br/>Customers</span>
                 </div>
               </div>
            </div>

            {/* Bottom Secondary Image */}
            <div className="rounded-[2rem] overflow-hidden relative group flex-1 bg-gray-900 border border-[#18202D]/10">
               <Image src="/logo/SUPPLY/11. Paper Shredder Machines.jpeg" alt="Paper Shredder Machines" fill className="object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
