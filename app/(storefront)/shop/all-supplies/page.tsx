'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supplyProducts } from '@/lib/data';
import { Select } from '@/components/ui/select';

const ITEMS_PER_PAGE = 48;

const categories = [
  { label: 'All Categories', value: 'All' },
  { label: 'Paper & Books', value: 'Paper & Books' },
  { label: 'Organizers', value: 'Organizers' },
  { label: 'Supplies', value: 'Supplies' },
  { label: 'Stationery', value: 'Stationery' },
  { label: 'Hardware', value: 'Hardware' }
];

const priceRanges = [
  { label: 'All Prices', value: 'All' },
  { label: 'Under TZS 10,000', value: '0-10000' },
  { label: 'TZS 10,000 - 50,000', value: '10000-50000' },
  { label: 'TZS 50,000 - 100,000', value: '50000-100000' },
  { label: 'Over TZS 100,000', value: '100000-9999999' }
];

const brands = [
  { label: 'All Brands', value: 'All' },
  { label: 'Globs-By', value: 'Globs-By' },
  { label: 'Naserian', value: 'Naserian' },
  { label: 'Stanley', value: 'Stanley' },
  { label: 'HP', value: 'HP' },
  { label: 'Canon', value: 'Canon' },
  { label: 'Parker', value: 'Parker' },
  { label: 'Generic', value: 'Generic' }
];

const stockStatuses = [
  { label: 'All Status', value: 'All' },
  { label: 'In Stock', value: 'In Stock' },
  { label: 'Limited Stock', value: 'Limited Stock' }
];

const sortOptions = [
  { label: 'Featured', value: 'Featured' },
  { label: 'Price: Low to High', value: 'Price: Low to High' },
  { label: 'Price: High to Low', value: 'Price: High to Low' },
  { label: 'Top Rated', value: 'Top Rated' }
];

export default function AllSuppliesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activeStockStatus, setActiveStockStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Featured');

  // Helper to parse price string to number
  const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''));

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = supplyProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      
      const price = parsePrice(p.price);
      let matchesPrice = true;
      if (activePriceRange !== 'All') {
        const [min, max] = activePriceRange.split('-').map(Number);
        matchesPrice = price >= min && price <= max;
      }

      const matchesBrand = activeBrand === 'All' || p.brand === activeBrand;
      const matchesStock = activeStockStatus === 'All' || p.stockStatus === activeStockStatus;

      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesStock;
    });

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === 'Top Rated') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [searchQuery, activeCategory, activePriceRange, activeBrand, activeStockStatus, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setActivePriceRange('All');
    setActiveBrand('All');
    setActiveStockStatus('All');
    setSearchQuery('');
    setSortBy('Featured');
    setCurrentPage(1);
  };

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
              <p className="text-gray-500 max-w-md">Browse our entire collection of {supplyProducts.length} premium corporate supplies.</p>
            </div>
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search specifically in full inventory..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#94B447] outline-none shadow-sm pr-12 text-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Detailed Filter Bar */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Category</label>
              <Select value={activeCategory} onValueChange={(v) => { setActiveCategory(v); setCurrentPage(1); }} options={categories} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Price Range</label>
              <Select value={activePriceRange} onValueChange={(v) => { setActivePriceRange(v); setCurrentPage(1); }} options={priceRanges} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Brand</label>
              <Select value={activeBrand} onValueChange={(v) => { setActiveBrand(v); setCurrentPage(1); }} options={brands} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Availability</label>
              <Select value={activeStockStatus} onValueChange={(v) => { setActiveStockStatus(v); setCurrentPage(1); }} options={stockStatuses} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy} options={sortOptions} />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">{filteredProducts.length} Results Matching Your Criteria</span>
            <button 
              onClick={resetFilters}
              className="text-xs font-bold text-[#94B447] hover:text-[#18202D] transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Clear All Filters
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-4">
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {paginatedProducts.map((pkg) => (
              <Link href={`/product/${pkg.id}`} key={pkg.id} className="bg-white rounded-2xl aspect-[3/4] relative flex flex-col items-center group overflow-hidden drop-shadow-sm hover:-translate-y-1 transition-transform border border-gray-100 p-4 hover:shadow-md">
                {/* Brand Tag */}
                <div className="absolute top-2 left-2 z-20">
                  <span className="bg-gray-100 text-[#18202D] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    {pkg.brand}
                  </span>
                </div>

                <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-sm px-2 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-[10px] sm:text-xs font-bold text-[#18202D] z-10 text-center truncate border-b border-gray-50">
                  {pkg.name}
                </div>
                
                <div className="w-full h-[65%] mt-6 relative z-0 group-hover:scale-105 transition-transform duration-700 bg-[#f8f9fa] rounded-lg overflow-hidden border border-gray-50">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-contain p-2" />
                  {/* Rating Badge */}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm border border-gray-100">
                    <span className="text-[10px] font-bold text-[#18202D]">{pkg.rating}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                </div>

                <div className="w-full mt-auto text-center flex flex-col items-center">
                   <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{pkg.category}</div>
                   <div className="text-sm sm:text-base font-extrabold text-[#94B447]">{pkg.price}</div>
                   <div className={`text-[9px] font-bold mt-1 ${pkg.stockStatus === 'In Stock' ? 'text-green-500' : 'text-orange-500'}`}>
                     {pkg.stockStatus}
                   </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-[#18202D]">No products match these filters</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            <button 
              onClick={resetFilters}
              className="mt-6 px-6 py-2 bg-[#94B447] text-white rounded-full font-bold hover:bg-[#18202D] transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. Pagination Controls */}
      {totalPages > 1 && (
        <section className="w-full max-w-[1600px] mx-auto px-4 flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex items-center gap-2 px-4 overflow-x-auto max-w-[300px] sm:max-w-none no-scrollbar">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all ${
                  currentPage === page 
                    ? 'bg-[#18202D] text-white shadow-md' 
                    : 'text-[#18202D] hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </section>
      )}

      {/* Summary Footer */}
      <div className="w-full max-w-[1600px] mx-auto px-4 mt-8 flex justify-center">
        <p className="text-sm text-gray-400 font-medium">
          Showing <span className="text-[#18202D] font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[#18202D] font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="text-[#18202D] font-bold">{filteredProducts.length}</span> supplies
        </p>
      </div>

    </div>
  );
}
