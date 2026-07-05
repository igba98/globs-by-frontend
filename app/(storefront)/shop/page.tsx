import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import type { Product } from '@/lib/types';
import AnimatedBanner from '@/components/storefront/shop/AnimatedBanner';
import ProductGrid from '@/components/storefront/shop/ProductGrid';
import SortSelect from '@/components/storefront/shop/SortSelect';
import LoadMoreSection from '@/components/storefront/shop/LoadMoreSection';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort } = await searchParams;

  const [prodRes, categories] = await Promise.all([
    getProducts({ limit: 100, category, q, sort }),
    getCategories(),
  ]);

  const products: Product[] = prodRes.data;

  const onSaleProducts = products.filter((p) => p.isOnSale);
  const topSellingProducts = products.filter((p) => p.isTopSelling && !p.isOnSale);
  const regularProducts = products.filter((p) => !p.isOnSale && !p.isTopSelling);

  return (
    <div className="w-full flex flex-col items-center space-y-12 pb-20 pt-4">
      {/* 1. Page Header Bento */}
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-6 sm:px-12 text-center flex flex-col items-center border border-[#18202D]/5 max-w-[1600px] mx-auto">
        <h1 className="text-4xl font-extrabold font-heading text-[#94B447] mb-4">Official Shop Directory</h1>
        <p className="text-[#18202D] max-w-md mb-8">Browse our catalogue of premium B2B corporate supplies and institutional inventory.</p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10">
          <Link
            href={q ? `/shop?q=${encodeURIComponent(q)}` : '/shop'}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all ${
              !category
                ? 'bg-[#18202D] text-white shadow-md'
                : 'bg-white text-[#18202D] hover:text-[#18202D] hover:bg-gray-50 shadow-sm border border-gray-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const params = new URLSearchParams();
            params.set('category', cat.slug);
            if (q) params.set('q', q);
            const isActive = category === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/shop?${params.toString()}`}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#18202D] text-white shadow-md'
                    : 'bg-white text-[#18202D] hover:text-[#18202D] hover:bg-gray-50 shadow-sm border border-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. Shop Grid & Sections */}
      <section className="w-full flex flex-col gap-12">
        {/* Filter & Count Header */}
        <div className="flex justify-between items-center px-4 max-w-[1600px] mx-auto w-full">
          <span className="text-sm font-bold text-[#18202D] bg-gray-100 px-3 py-1 rounded w-fit">{products.length} Supplies Available</span>
          <SortSelect basePath="/shop" currentSort={sort ?? 'featured'} category={category} q={q} />
        </div>

        {/* Section 1: On Promotion */}
        {onSaleProducts.length > 0 && (
          <div className="w-full">
            <div className="max-w-[1600px] mx-auto px-4 mb-6">
              <h2 className="text-2xl font-bold font-heading text-[#FF6B35] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11.1 17.1 2.2 2.2a1 1 0 0 0 1.4 0l6.2-6.2a1 1 0 0 0 0-1.4l-2.2-2.2a1 1 0 0 0-1.4 0l-6.2 6.2a1 1 0 0 0 0 1.4Z"></path><path d="m14 14 3-3"></path><path d="M7 6v6l5 5"></path><path d="M4 6v6"></path><path d="M10 6v2"></path></svg>
                On Promotion
              </h2>
              <p className="text-sm text-gray-500">Specially discounted supplies for a limited time.</p>
            </div>
            <ProductGrid products={onSaleProducts} />
            <div className="w-full mt-12">
              <AnimatedBanner />
            </div>
          </div>
        )}

        {/* Section 2: Top Selling */}
        {topSellingProducts.length > 0 && (
          <div className="w-full">
            <div className="max-w-[1600px] mx-auto px-4 mb-6">
              <h2 className="text-2xl font-bold font-heading text-[#F5A623] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Top Selling items
              </h2>
              <p className="text-sm text-gray-500">Our customer favorites across all categories.</p>
            </div>
            <ProductGrid products={topSellingProducts} />
            {regularProducts.length > 0 && (
              <div className="w-full mt-12 bg-gray-50 border-y border-gray-100 py-8">
                <div className="max-w-[1600px] mx-auto px-4 text-center">
                  <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Explore the rest of our catalogue below</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 3: All Other Products (client: load-more reveal) */}
        <LoadMoreSection products={regularProducts} />
      </section>
    </div>
  );
}
