import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatTzs } from '@/lib/format';
import ProductImage from '@/components/storefront/shop/ProductImage';
import AllSuppliesFilterBar, { AllSuppliesSearchBox } from '@/components/storefront/shop/AllSuppliesFilterBar';

const ITEMS_PER_PAGE = 48;

function AllSuppliesGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      {products.map((product) => {
        const inStock = product.stock > 0;
        return (
          <Link
            href={`/product/${product.slug}`}
            key={product.id}
            className="bg-white rounded-2xl aspect-[3/4] relative flex flex-col items-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-gray-100 p-4 hover:shadow-md"
          >
            {/* Brand Tag */}
            {product.brand && (
              <div className="absolute top-2 left-2 z-20">
                <span className="bg-gray-100 text-[#18202D] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {product.brand.name}
                </span>
              </div>
            )}

            <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-sm px-2 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-[10px] sm:text-xs font-bold text-[#18202D] z-10 text-center truncate border-b border-gray-50">
              {product.name}
            </div>

            <div className="w-full h-[65%] mt-6 relative z-0 group-hover:scale-105 transition-transform duration-700 bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-50">
              <ProductImage
                src={product.images[0]?.url}
                alt={product.images[0]?.alt ?? product.name}
                className="object-contain p-2"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />
              {/* Rating Badge */}
              {product.rating != null && (
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm border border-gray-100">
                  <span className="text-[10px] font-bold text-[#18202D]">{product.rating}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              )}
            </div>

            <div className="w-full mt-auto text-center flex flex-col items-center">
              <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{product.category.name}</div>
              <div className="text-sm sm:text-base font-extrabold text-[#94B447]">{formatTzs(product.price)}</div>
              <div className={`text-[9px] font-bold mt-1 ${inStock ? 'text-green-500' : 'text-orange-500'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function buildPageHref(page: number, params: { q?: string; category?: string; brand?: string; sort?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.category) search.set('category', params.category);
  if (params.brand) search.set('brand', params.brand);
  if (params.sort && params.sort !== 'featured') search.set('sort', params.sort);
  if (page > 1) search.set('page', String(page));
  const qs = search.toString();
  return qs ? `/shop/all-supplies?${qs}` : '/shop/all-supplies';
}

export default async function AllSuppliesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; sort?: string; page?: string }>;
}) {
  const { q = '', category = '', brand = '', sort = 'featured', page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const [prodRes, categories, brands] = await Promise.all([
    getProducts({ q: q || undefined, category: category || undefined, brand: brand || undefined, sort, page, limit: ITEMS_PER_PAGE }),
    getCategories(),
    getBrands(),
  ]);

  const products: Product[] = prodRes.data;
  const { total, totalPages } = prodRes.meta;

  const categoryOptions = [{ label: 'All Categories', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.slug }))];
  const brandOptions = [{ label: 'All Brands', value: '' }, ...brands.map((b) => ({ label: b.name, value: b.slug }))];

  const activeParams = { q, category, brand, sort };

  return (
    <div className="w-full flex flex-col items-center space-y-8 pb-20 pt-8">
      {/* 1. Header Section */}
      <section className="w-full max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/shop" className="text-sm font-bold text-[#94B447] flex items-center gap-2 hover:underline w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Shop
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold font-heading text-[#18202D]">Full Inventory</h1>
              <p className="text-gray-500 max-w-md">Browse our entire collection of {total} premium corporate supplies.</p>
            </div>
            <AllSuppliesSearchBox q={q} category={category} brand={brand} sort={sort} />
          </div>
        </div>

        {/* 2. Detailed Filter Bar */}
        <AllSuppliesFilterBar
          categoryOptions={categoryOptions}
          brandOptions={brandOptions}
          q={q}
          category={category}
          brand={brand}
          sort={sort}
          resultCount={total}
        />
      </section>

      {/* 3. Main Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-4">
        {products.length > 0 ? (
          <AllSuppliesGrid products={products} />
        ) : (
          <div className="w-full py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#18202D]">No products match these filters</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            <Link
              href="/shop/all-supplies"
              className="mt-6 px-6 py-2 bg-[#94B447] text-white rounded-full font-bold hover:bg-[#18202D] transition-all"
            >
              Clear All Filters
            </Link>
          </div>
        )}
      </section>

      {/* 4. Pagination Controls */}
      {totalPages > 1 && (
        <section className="w-full max-w-[1600px] mx-auto px-4 flex justify-center items-center gap-2 mt-8">
          <Link
            href={buildPageHref(Math.max(1, page - 1), activeParams)}
            aria-disabled={page === 1}
            className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>

          <div className="flex items-center gap-2 px-4 overflow-x-auto max-w-[300px] sm:max-w-none no-scrollbar">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildPageHref(p, activeParams)}
                className={`min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                  page === p ? 'bg-[#18202D] text-white shadow-md' : 'text-[#18202D] hover:bg-gray-100'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>

          <Link
            href={buildPageHref(Math.min(totalPages, page + 1), activeParams)}
            aria-disabled={page === totalPages}
            className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${page === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </section>
      )}

      {/* Summary Footer */}
      <div className="w-full max-w-[1600px] mx-auto px-4 mt-8 flex justify-center">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-[#18202D] font-bold">{products.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
          <span className="text-[#18202D] font-bold">{Math.min(page * ITEMS_PER_PAGE, total)}</span> of{' '}
          <span className="text-[#18202D] font-bold">{total}</span> supplies
        </p>
      </div>
    </div>
  );
}
