'use client';

import React from 'react';
import Image from 'next/image';

const brands = [
  "/BRANDS-WE-WORK-WITH/Casio_logo.svg.png",
  "/BRANDS-WE-WORK-WITH/Epson_logo.svg.png",
  "/BRANDS-WE-WORK-WITH/Hewlett-Packard-Logo-2008-2014.png",
  "/BRANDS-WE-WORK-WITH/Nataraj-Logo.png",
  "/BRANDS-WE-WORK-WITH/Paperline.png",
  "/BRANDS-WE-WORK-WITH/Pentel.png",
  "/BRANDS-WE-WORK-WITH/SanDisk_Logo_2007.svg.png",
  "/BRANDS-WE-WORK-WITH/Sinar Spectra.png",
  "/BRANDS-WE-WORK-WITH/Sinarline.png",
  "/BRANDS-WE-WORK-WITH/Staedtler_Logo.png",
  "/BRANDS-WE-WORK-WITH/canon.png",
  "/BRANDS-WE-WORK-WITH/double-a-vector-logo.png",
  "/BRANDS-WE-WORK-WITH/fantastick.png",
  "/BRANDS-WE-WORK-WITH/kangaro.jpg",
  "/BRANDS-WE-WORK-WITH/maped.png",
  "/BRANDS-WE-WORK-WITH/mondi.png.webp",
  "/BRANDS-WE-WORK-WITH/parker.jpg"
];

const clients = [
  "/logo/PARTNERS-LOGO/BAYER LOGO.png",
  "/logo/PARTNERS-LOGO/CRDB LOGO.avif",
  "/logo/PARTNERS-LOGO/CUOM LOGO.png",
  "/logo/PARTNERS-LOGO/HARRISON UWATA LOGO.jpeg",
  "/logo/PARTNERS-LOGO/MCCL LOGO.png",
  "/logo/PARTNERS-LOGO/NMB LOGO.png",
  "/logo/PARTNERS-LOGO/PANDA HILL LOGO.png",
  "/logo/PARTNERS-LOGO/TANIN LOGO.png",
  "/logo/PARTNERS-LOGO/TRC  LOGO.png"
];

export default function BrandsStrip() {
  return (
    <div className="flex flex-col w-full bg-[#f8f9fa] border-t border-gray-100">
      
      {/* Brands We Carry Section */}
      <section className="w-full py-12 px-4 sm:px-6 overflow-hidden flex flex-col items-center">
        <h2 className="text-2xl font-bold font-heading text-[#94B447] mb-8">Brands We Carry</h2>
        
        {/* Auto-scrolling wrapper */}
        <div className="w-full max-w-[1600px] relative flex overflow-x-hidden group">
          
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10"></div>

          {/* Slower animation -> duration 180s */}
          <div className="flex gap-8 md:gap-12 animate-[marquee_180s_linear_infinite] whitespace-nowrap py-2 group-hover:[animation-play-state:paused]">
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-50 hover:border-gray-200 hover:shadow-md transition-all px-4 py-2 w-32 h-20 md:w-40 md:h-24 flex-shrink-0"
              >
                <div className="relative w-full h-full">
                  <Image src={brand} alt="Brand" fill className="object-contain p-2 mix-blend-multiply" />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="w-full py-12 px-4 sm:px-6 overflow-hidden flex flex-col items-center border-t border-gray-100">
        <h2 className="text-2xl font-bold font-heading text-[#94B447] mb-8">Our Trusted Clients</h2>
        
        {/* Auto-scrolling wrapper */}
        <div className="w-full max-w-[1600px] relative flex overflow-x-hidden group">
          
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10"></div>

          {/* Opposite direction with very slow speed -> 200s */}
          <div className="flex gap-8 md:gap-12 animate-[marquee_200s_linear_infinite] whitespace-nowrap py-2 group-hover:[animation-play-state:paused] flex-row-reverse">
            {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-50 hover:border-gray-200 hover:shadow-md transition-all px-4 py-2 w-32 h-20 md:w-48 md:h-28 flex-shrink-0"
              >
                <div className="relative w-full h-full">
                  <Image src={client} alt="Client" fill className="object-contain p-2 mix-blend-multiply" />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

    </div>
  );
}
