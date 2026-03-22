import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@/components/icons';

export default function HeroSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pt-4 md:pt-[20px] pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[75vh] min-h-[600px]">
        
        {/* Left Hero Card */}
        <div className="relative rounded-[2rem] overflow-hidden bg-zinc-900 group">
          <Image
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop"
            alt="Modern Office Setup"
            fill
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 opacity-80"
            priority
          />
          {/* Floating White Panel */}
          <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-12 bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl max-w-md transition-transform duration-500 hover:-translate-y-2">
            <h1 className="font-heading text-3xl md:text-5xl font-normal text-primary leading-tight mb-4">
              Premium Office <br/> Supplies For You
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Discover thoughtfully crafted stationery and office equipment designed to elevate your workspace and productivity.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 font-medium text-sm border-b border-primary pb-1 group/link">
              Explore Shop <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Hero Card */}
        <div className="relative rounded-[2rem] overflow-hidden bg-zinc-800 hidden md:block group">
          <Image
            src="https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=2070&auto=format&fit=crop"
            alt="Premium Stationery"
            fill
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 opacity-80"
            priority
          />
          
          {/* Floating Product Card */}
          <div className="absolute bottom-10 right-10 bg-[#e5e5e5] rounded-[2rem] p-6 w-[280px] shadow-2xl transition-transform duration-500 hover:-translate-y-2 flex flex-col items-center">
            {/* Top Pill Overlap */}
            <div className="absolute -top-4 bg-white px-6 py-2 rounded-full shadow-sm text-sm font-semibold text-primary">
              Executive Pen
            </div>
            
            <div className="relative w-full aspect-square mt-4 mb-2">
               <Image
                 src="https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=500&auto=format&fit=crop"
                 alt="Featured Product"
                 fill
                 className="object-contain drop-shadow-2xl mix-blend-multiply"
               />
            </div>

            {/* Bottom Black Pill */}
            <div className="absolute bottom-6 left-6 bg-black text-white text-xs px-3 py-1.5 rounded-md font-medium">
              20% off
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
