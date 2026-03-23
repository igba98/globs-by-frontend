import Image from 'next/image';
import { Target, Shield, Users } from '@/components/icons';

const coreValues = [
  { name: 'Integrity', icon: Shield, description: 'We uphold the highest standards of honesty and ethical conduct in every interaction.' },
  { name: 'Innovation', icon: Target, description: 'We continuously seek creative solutions and embrace new ideas to serve you better.' },
  { name: 'Accountability', icon: Users, description: 'We take ownership of our commitments and deliver on every promise we make.' },
  { name: 'Transparency', icon: Shield, description: 'We operate with openness and clarity in all our business dealings and relationships.' },
  { name: 'Fairness', icon: Users, description: 'We treat every customer, partner, and team member with equal respect and consideration.' },
];

const services = [
  'Office and School Supplies',
  'Tech Accessories',
  'Printing Services',
  'Event Supplies',
  'Art Supplies',
  'Machine and Spare Parts',
];

const brandLogos = [
  { name: 'Casio', image: '/BRANDS-WE-WORK-WITH/Casio_logo.svg.png' },
  { name: 'Epson', image: '/BRANDS-WE-WORK-WITH/Epson_logo.svg.png' },
  { name: 'HP', image: '/BRANDS-WE-WORK-WITH/Hewlett-Packard-Logo-2008-2014.png' },
  { name: 'Nataraj', image: '/BRANDS-WE-WORK-WITH/Nataraj-Logo.png' },
  { name: 'Paperline', image: '/BRANDS-WE-WORK-WITH/Paperline.png' },
  { name: 'Pentel', image: '/BRANDS-WE-WORK-WITH/Pentel.png' },
  { name: 'SanDisk', image: '/BRANDS-WE-WORK-WITH/SanDisk_Logo_2007.svg.png' },
  { name: 'Sinar Spectra', image: '/BRANDS-WE-WORK-WITH/Sinar Spectra.png' },
  { name: 'Sinarline', image: '/BRANDS-WE-WORK-WITH/Sinarline.png' },
  { name: 'Staedtler', image: '/BRANDS-WE-WORK-WITH/Staedtler_Logo.png' },
  { name: 'Canon', image: '/BRANDS-WE-WORK-WITH/canon.png' },
  { name: 'Double-A', image: '/BRANDS-WE-WORK-WITH/double-a-vector-logo.png' },
  { name: 'Fantastick', image: '/BRANDS-WE-WORK-WITH/fantastick.png' },
  { name: 'Kangaro', image: '/BRANDS-WE-WORK-WITH/kangaro.jpg' },
  { name: 'Maped', image: '/BRANDS-WE-WORK-WITH/maped.png' },
  { name: 'Mondi', image: '/BRANDS-WE-WORK-WITH/mondi.png.webp' },
  { name: 'Parker', image: '/BRANDS-WE-WORK-WITH/parker.jpg' },
];

const partnerLogos = [
  { name: 'Bayer', image: '/logo/PARTNERS-LOGO/BAYER LOGO.png' },
  { name: 'CRDB', image: '/logo/PARTNERS-LOGO/CRDB LOGO.avif' },
  { name: 'CUOM', image: '/logo/PARTNERS-LOGO/CUOM LOGO.png' },
  { name: 'Harrison Uwata', image: '/logo/PARTNERS-LOGO/HARRISON UWATA LOGO.jpeg' },
  { name: 'MCCL', image: '/logo/PARTNERS-LOGO/MCCL LOGO.png' },
  { name: 'NMB', image: '/logo/PARTNERS-LOGO/NMB LOGO.png' },
  { name: 'Panda Hill', image: '/logo/PARTNERS-LOGO/PANDA HILL LOGO.png' },
  { name: 'TANIN', image: '/logo/PARTNERS-LOGO/TANIN LOGO.png' },
  { name: 'TRC', image: '/logo/PARTNERS-LOGO/TRC  LOGO.png' },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-white pb-20">
      
      {/* Header Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pt-4 md:pt-[20px] pb-16">
        <div className="relative w-full h-[80vh] min-h-[600px] rounded-[3rem] overflow-hidden bg-zinc-900 group">
           <Image 
             src="/logo/SUPPLY/1. A4 Copy Paper.jpeg" 
             fill 
             className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-1000" 
             alt="About Globs-By" 
           />
           
           {/* Left Floating Box */}
           <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white rounded-[2rem] p-8 md:p-12 max-w-md shadow-2xl transition-transform duration-500 hover:-translate-y-2">
              <h1 className="font-heading text-4xl lg:text-5xl font-normal text-primary mb-6">About Us</h1>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Globs-by is your playground for top quality stationary products. Our lovingly hand-crafted accessories are created to spark creativity and make ordinary tasks more delightful.
              </p>
           </div>

           {/* Right Floating Pills */}
           <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col sm:flex-row flex-wrap gap-4 items-end sm:items-center">
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                 <span className="text-sm font-semibold">20+ Years in the Market</span>
              </div>
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                 <span className="text-sm font-semibold">6–24 Hours Delivery Time</span>
              </div>
              <div className="bg-white rounded-full pl-2 pr-6 py-2 flex items-center gap-3 shadow-xl transition-transform hover:-translate-y-1 cursor-default">
                 <span className="bg-black text-white h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                 <span className="text-sm font-semibold">200+ Happy Customers</span>
              </div>
           </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreValues.map((value) => (
            <div key={value.name} className="bg-[#f8f9fa] rounded-[3rem] p-10 flex flex-col justify-center transition-shadow hover:shadow-lg">
              <value.icon className="h-8 w-8 text-primary mb-6" />
              <h3 className="font-heading text-xl font-normal text-primary mb-3">{value.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Services */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          {/* Left Image */}
          <div className="relative rounded-[3rem] overflow-hidden min-h-[300px] group">
            <Image src="/logo/SUPPLY/11. Paper Shredder Machines.jpeg" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="Our Services" />
          </div>
          {/* Right Services List */}
          <div className="bg-[#f8f9fa] rounded-[3rem] p-12 lg:p-20 flex flex-col justify-center">
            <h3 className="font-heading text-3xl md:text-4xl font-normal text-primary mb-8 leading-tight max-w-sm">
              What We Offer
            </h3>
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service} className="flex items-center gap-4 transform hover:translate-x-2 transition-transform cursor-default border-b border-gray-200/60 pb-4">
                  <span className="w-8 h-8 bg-[#18202D] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                  <span className="font-medium text-lg text-primary tracking-wide">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands We Work With */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">Brands We Work With</h2>
        </div>
        <div className="bg-[#f8f9fa] rounded-[3rem] p-12">
          <p className="text-center text-muted-foreground text-sm leading-relaxed mb-12 max-w-2xl mx-auto">
            We supply different options from multiple top global brands to ensure excellent quality and a diverse assortment. Top brands. Trusted quality. Endless choices.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 items-center justify-items-center">
            {brandLogos.map((brand) => (
              <div key={brand.name} className="relative w-20 h-16 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 cursor-default" title={brand.name}>
                <Image src={brand.image} fill className="object-contain" alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Partners */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">Business Partners</h2>
        </div>
        <div className="bg-[#f8f9fa] rounded-[3rem] p-12">
          <p className="text-center text-muted-foreground text-sm leading-relaxed mb-12 max-w-2xl mx-auto">
            We are proud to serve business partners and clients from diverse sectors which demonstrates our commitment to quality, reliability and tailored stationary solutions for private and corporate procurement.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 items-center justify-items-center">
            {partnerLogos.map((partner) => (
              <div key={partner.name} className="relative w-24 h-20 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 cursor-default" title={partner.name}>
                <Image src={partner.image} fill className="object-contain" alt={partner.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-20">
        {/* FAQ Header Pill */}
        <div className="w-full bg-[#f8f9fa] rounded-[2rem] py-8 text-center mb-6">
           <h2 className="font-heading text-2xl md:text-3xl font-normal text-primary">FAQ</h2>
        </div>
        
        {/* FAQ Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
           {/* Left Image */}
           <div className="relative rounded-[3rem] overflow-hidden min-h-[300px] group">
              <Image src="/logo/SUPPLY/12. Cartridges & Toners.png" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" alt="FAQ Background" />
           </div>
           
           {/* Right FAQ List */}
           <div className="bg-[#f8f9fa] rounded-[3rem] p-12 lg:p-20 flex flex-col justify-center">
              <h3 className="font-heading text-3xl md:text-4xl font-normal text-primary mb-6">Questions We Often Hear</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-16 max-w-sm">
                 From product details to shipping info, browse the answers to your most asked questions and shop with confidence.
              </p>
              
              <div className="space-y-8">
                 <div className="flex justify-between items-center border-b border-gray-200/60 pb-6 cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="font-medium text-lg text-primary tracking-wide">Do You Ship Nationwide?</span>
                    <span className="text-2xl font-light text-primary">+</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-gray-200/60 pb-6 cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="font-medium text-lg text-primary tracking-wide">What Types Of Products Do You Offer?</span>
                    <span className="text-2xl font-light text-primary">+</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-gray-200/60 pb-6 cursor-pointer hover:opacity-70 transition-opacity">
                    <span className="font-medium text-lg text-primary tracking-wide">What Is Your Delivery Time?</span>
                    <span className="text-2xl font-light text-primary">+</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}
