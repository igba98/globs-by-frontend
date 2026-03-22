import Image from 'next/image';
import { Target, Shield, Users, Facebook, Twitter } from '@/components/icons';

export default function AboutPage() {
  return (
    <div className="w-full bg-white pb-20">
      
      {/* Header Section (Image 1) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pt-4 md:pt-[20px] pb-16">
        <div className="relative w-full h-[80vh] min-h-[600px] rounded-[3rem] overflow-hidden bg-zinc-900 group">
           <Image 
             src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
             fill 
             className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-1000" 
             alt="About Globs-By" 
           />
           
           {/* Left Floating Box */}
           <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white rounded-[2rem] p-8 md:p-12 max-w-md shadow-2xl transition-transform duration-500 hover:-translate-y-2">
              <h1 className="font-heading text-4xl lg:text-5xl font-normal text-primary mb-6">About Us</h1>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We're passionate about transforming offices into inspiring workspaces with timeless designs, quality craftsmanship, and a touch of elegance in every piece.
              </p>
           </div>

           {/* Right Floating Pills */}
           <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col sm:flex-row flex-wrap gap-4 items-end sm:items-center">
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                 <span className="text-sm font-semibold">10+ Years in Market Place</span>
              </div>
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                 <span className="text-sm font-semibold">50K+ Customers</span>
              </div>
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                 <span className="text-sm font-semibold">4.8 Average Rating</span>
              </div>
           </div>
        </div>
      </section>

      {/* Features Bento (Image 2) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:h-[600px]">
          
          {/* Top Left Cards & Wide Image (Col 1 & 2) */}
          <div className="grid grid-rows-2 gap-6 lg:col-span-2">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                 {/* Sustainable Roots */}
                 <div className="bg-[#f8f9fa] rounded-[3rem] p-10 flex flex-col justify-center transition-shadow hover:shadow-lg">
                    <Target className="h-8 w-8 text-primary mb-6" />
                    <h3 className="font-heading text-xl font-normal text-primary mb-3">Sustainable Roots</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      We source responsibly and design consciously, creating supplies that honor the earth and your workspace.
                    </p>
                 </div>
                 {/* Timeless Form */}
                 <div className="bg-[#f8f9fa] rounded-[3rem] p-10 flex flex-col justify-center transition-shadow hover:shadow-lg">
                    <Shield className="h-8 w-8 text-primary mb-6" />
                    <h3 className="font-heading text-xl font-normal text-primary mb-3">Timeless Form</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      Elegant simplicity, designed to remain relevant, refined, and highly functional for years to come.
                    </p>
                 </div>
             </div>
             {/* Wide Image */}
             <div className="relative rounded-[3rem] overflow-hidden h-full min-h-[250px] group">
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="Workspace Design" />
             </div>
          </div>

          {/* Tall Image (Col 3) */}
          <div className="relative rounded-[3rem] overflow-hidden lg:col-span-1 hidden lg:block h-full group">
             <Image src="https://images.unsplash.com/photo-1542314831-c6a4d14b8ba2?q=80&w=2070&auto=format&fit=crop" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="Tall Office Decor" />
          </div>

          {/* Right Cards (Col 4) */}
          <div className="grid grid-rows-2 gap-6 lg:col-span-1">
             {/* Crafted Well */}
             <div className="bg-[#f8f9fa] rounded-[3rem] p-10 flex flex-col justify-center transition-shadow hover:shadow-lg">
                <Target className="h-8 w-8 text-primary mb-6" />
                <h3 className="font-heading text-xl font-normal text-primary mb-3">Crafted Well</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Expertly built by skilled hands using premium materials and precise attention to functional detail.
                </p>
             </div>
             {/* Seamless Care */}
             <div className="bg-[#f8f9fa] rounded-[3rem] p-10 flex flex-col justify-center transition-shadow hover:shadow-lg">
                <Users className="h-8 w-8 text-primary mb-6" />
                <h3 className="font-heading text-xl font-normal text-primary mb-3">Seamless Care</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  From order to delivery, we ensure a smooth, supportive, and stress-free procurement experience.
                </p>
             </div>
          </div>

        </div>
      </section>

      {/* Team Section (Image 3) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#f8f9fa] rounded-[3rem] p-6 pb-10 flex flex-col items-center text-center transition-shadow hover:shadow-xl">
             <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 bg-zinc-200">
               <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop" fill className="object-cover" alt="Emma Carlson" />
             </div>
             <div className="flex gap-4 mb-4">
                <Facebook className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
                <Twitter className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
             </div>
             <h4 className="font-heading text-xl font-normal text-primary mb-1">Emma Carlson</h4>
             <p className="text-xs text-muted-foreground font-light">Educational Styling<br/>Specialist</p>
          </div>

          <div className="bg-[#f8f9fa] rounded-[3rem] p-6 pb-10 flex flex-col items-center text-center transition-shadow hover:shadow-xl">
             <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 bg-zinc-200">
               <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop" fill className="object-cover" alt="Olivia Bennett" />
             </div>
             <div className="flex gap-4 mb-4">
                <Facebook className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
                <Twitter className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
             </div>
             <h4 className="font-heading text-xl font-normal text-primary mb-1">Olivia Bennett</h4>
             <p className="text-xs text-muted-foreground font-light">Office Decor<br/>Advisor</p>
          </div>

          <div className="bg-[#f8f9fa] rounded-[3rem] p-6 pb-10 flex flex-col items-center text-center transition-shadow hover:shadow-xl">
             <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 bg-zinc-200">
               <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop" fill className="object-cover" alt="Ethan Carter" />
             </div>
             <div className="flex gap-4 mb-4">
                <Facebook className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
                <Twitter className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
             </div>
             <h4 className="font-heading text-xl font-normal text-primary mb-1">Ethan Carter</h4>
             <p className="text-xs text-muted-foreground font-light">Brand Integration<br/>Specialist</p>
          </div>

          <div className="bg-[#f8f9fa] rounded-[3rem] p-6 pb-10 flex flex-col items-center text-center transition-shadow hover:shadow-xl">
             <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 bg-zinc-200">
               <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" fill className="object-cover" alt="Sophia Lane" />
             </div>
             <div className="flex gap-4 mb-4">
                <Facebook className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
                <Twitter className="h-3 w-3 text-muted-foreground hover:text-primary cursor-pointer transition-colors"/>
             </div>
             <h4 className="font-heading text-xl font-normal text-primary mb-1">Sophia Lane</h4>
             <p className="text-xs text-muted-foreground font-light">B2B Procurement<br/>Expert</p>
          </div>

        </div>
      </section>

      {/* Our Journey (Image 3 Header & Image 4) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        {/* Header Pill */}
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
           <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">Our Journey</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
           {/* Left Text/Timeline Box */}
           <div className="bg-[#f8f9fa] rounded-[3rem] p-12 lg:p-20 flex flex-col justify-center">
              <h3 className="font-heading text-3xl md:text-4xl font-normal text-primary mb-16 leading-tight max-w-sm">
                 Our Journey of Creating Inspiring and Efficient Workspaces
              </h3>
              <div className="space-y-10">
                 <div className="transform hover:translate-x-2 transition-transform cursor-default">
                    <p className="font-medium text-lg text-primary tracking-wide">2016 — Founded With A Vision</p>
                 </div>
                 <div className="transform hover:translate-x-2 transition-transform cursor-default">
                    <p className="font-medium text-lg text-primary tracking-wide">2020 — Launch Of Our Online Store</p>
                 </div>
                 <div className="transform hover:translate-x-2 transition-transform cursor-default">
                    <p className="font-medium text-lg text-primary tracking-wide">2025 — Evolving With Purpose</p>
                 </div>
              </div>
           </div>
           
           {/* Right Image */}
           <div className="relative rounded-[3rem] overflow-hidden min-h-[400px] group">
              <Image src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="Our Journey" />
           </div>
        </div>
      </section>

      {/* Brands and FAQ (Image 5) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-20">
        
        {/* Brands Black Bar */}
        <div className="w-full bg-[#0a0a0a] rounded-[2.5rem] py-10 px-8 flex flex-wrap justify-between items-center text-white/50 mb-6 gap-6">
           <div className="flex items-center gap-2 font-heading text-xl opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default"><span className="text-white">❈</span> Modora</div>
           <div className="flex items-center gap-2 font-heading text-xl opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default"><span className="text-white">❖</span> Tessari</div>
           <div className="flex items-center gap-2 font-heading text-xl text-white font-semibold cursor-default"><span className="text-white">✣</span> Nestiq</div>
           <div className="flex items-center gap-2 font-heading text-xl opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default"><span className="text-white">✺</span> Linthor</div>
           <div className="flex items-center gap-2 font-heading text-xl opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default"><span className="text-white">✣</span> Nestiq</div>
           <div className="flex items-center gap-2 font-heading text-xl opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default"><span className="text-white">✤</span> Velvra</div>
        </div>

        {/* FAQ Header Pill */}
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
           <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">FAQ</h2>
        </div>
        
        {/* FAQ Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
           {/* Left Image */}
           <div className="relative rounded-[3rem] overflow-hidden min-h-[300px] group">
              <Image src="https://images.unsplash.com/photo-1542314831-c6a4d14b8ba2?q=80&w=2070&auto=format&fit=crop" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="FAQ Background" />
           </div>
           
           {/* Right FAQ List */}
           <div className="bg-[#f8f9fa] rounded-[3rem] p-12 lg:p-20 flex flex-col justify-center">
              <h3 className="font-heading text-3xl md:text-4xl font-normal text-primary mb-6">Questions We Often Hear</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-16 max-w-sm">
                 From product details to shipping info, browse the answers to your most asked questions and shop with confidence.
              </p>
              
              <div className="space-y-8">
                 <div className="flex justify-between items-center border-b border-gray-200/60 pb-6 cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="font-medium text-lg text-primary tracking-wide">Do You Ship Globally?</span>
                    <span className="text-2xl font-light text-primary">+</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-gray-200/60 pb-6 cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="font-medium text-lg text-primary tracking-wide">What Types Of Products Do You Offer?</span>
                    <span className="text-2xl font-light text-primary">+</span>
                 </div>
              </div>
           </div>
        </div>

      </section>

    </div>
  );
}
