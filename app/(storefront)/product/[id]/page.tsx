import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApiError, getProduct, getProducts } from '@/lib/api';
import { formatTzs } from '@/lib/format';
import ProductGrid from '@/components/storefront/shop/ProductGrid';
import Gallery from './Gallery';
import AddToCartPanel from './AddToCartPanel';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const relatedRes = await getProducts({ category: product.category.slug, limit: 4 });
  const relatedProducts = relatedRes.data.filter((p) => p.slug !== product.slug).slice(0, 4);

  const inStock = product.stock > 0;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 lg:py-16">
      {/* Breadcrumb back to shop */}
      <div className="mb-8">
        <Link href="/shop" className="text-sm font-bold text-[#18202D] hover:text-[#94B447] transition-colors flex items-center gap-2">
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left Column: Image Gallery */}
        <Gallery images={product.images} name={product.name} />

        {/* Right Column: Product Detail Pane */}
        <div className="flex flex-col justify-start py-8">
          <div className="text-[12px] uppercase tracking-wider font-bold text-[#94B447] mb-2">{product.category.name}</div>
          <h1 className="text-4xl lg:text-[40px] font-medium font-heading text-[#94B447] mb-6">
            {product.name}
          </h1>

          <p className="text-[15px] leading-relaxed text-[#18202D] mb-8 max-w-[90%] font-medium">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-2">
            <div className="text-[28px] font-medium text-[#18202D]">{formatTzs(product.price)}</div>
            {product.isOnSale && product.compareAtPrice != null && (
              <div className="text-lg font-medium text-gray-400 line-through">{formatTzs(product.compareAtPrice)}</div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className={`text-sm font-bold ${inStock ? 'text-[#94B447]' : 'text-red-500'}`}>
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
            {product.rating != null && (
              <span className="text-sm font-bold text-[#18202D] flex items-center gap-1">
                {product.rating}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
            )}
          </div>

          <AddToCartPanel
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            category={product.category.name}
            image={product.images[0]?.url ?? ''}
          />

          {/* Shipping & Delivery Grid */}
          <div className="pt-10 border-t border-gray-100">
            <h3 className="text-xl font-medium text-[#94B447] mb-8">Shipping & Delivery</h3>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline><path d="M16.5 4.5l3-3"></path><path d="M21 7V3h-4"></path></svg>
                <p className="text-[13px] text-[#18202D] font-medium leading-snug">
                  Quick order preparation and dispatch.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                <p className="text-[13px] text-[#18202D] font-medium leading-snug">
                  Safe and reliable on-time delivery assured.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#18202D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                <p className="text-[13px] text-[#18202D] font-medium leading-snug">
                  Easy tracking from dispatch to arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="w-full mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-heading text-[#94B447]">You Might Also Like</h2>
            <p className="text-sm text-gray-500">More from {product.category.name}.</p>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
