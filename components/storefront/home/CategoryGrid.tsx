import Link from 'next/link';
import Image from 'next/image';

const categories = [
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

export default function CategoryGrid() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto py-16 bg-[#f8f9fA] rounded-[3rem] my-8">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-normal text-[#94B447]">Supply Categories</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {categories.map((category) => (
          <Link 
            key={category.name} 
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            className="group relative"
          >
            {/* Pill standing out on top */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 bg-white px-6 py-2 rounded-full shadow-sm text-sm font-medium text-primary whitespace-nowrap group-hover:-translate-y-1 transition-transform">
              {category.name}
            </div>

            {/* Grid Box */}
            <div className="bg-[#e4e5e7] rounded-3xl aspect-[4/5] relative overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
               <Image
                 src={category.image}
                 alt={category.name}
                 fill
                 className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
               />
               {/* Soft overlay gradient to clean up edges */}
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e4e5e7]/80" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
