import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Paper & Books', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop' },
  { name: 'Tech', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop' },
  { name: 'Art Supplies', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop' },
  { name: 'Organizers', image: 'https://images.unsplash.com/photo-1505075955904-15580503e70c?w=500&auto=format&fit=crop' },
  { name: 'Printers', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&auto=format&fit=crop" />' },
  { name: 'Business', image: 'https://images.unsplash.com/photo-1563206767-1763137a5495?w=500&auto=format&fit=crop' },
  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop' },
  { name: 'School', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop' }
];

export default function CategoryGrid() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto py-16 bg-[#f8f9fA] rounded-[3rem] my-8">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-normal text-primary">Categories</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
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
