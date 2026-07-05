'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createAdminProduct,
  getAdminProduct,
  isSessionExpiredError,
  presignUpload,
  updateAdminProduct,
  uploadFileToPresignedUrl,
} from '@/lib/admin-api';
import { ApiError, getBrands, getCategories } from '@/lib/api';
import type { AdminProductImageInput, AdminProductPayload, Brand, Category } from '@/lib/types';
import { LoadingState } from '@/components/backoffice/DataState';

function digitsToNumber(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  return parseInt(digits, 10);
}

export default function ProductCreationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = Boolean(editId);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [compareAtPriceInput, setCompareAtPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [isOnSale, setIsOnSale] = useState(false);
  const [isTopSelling, setIsTopSelling] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [images, setImages] = useState<AdminProductImageInput[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadFormData = useCallback(async () => {
    setInitialLoading(true);
    setLoadError(null);
    try {
      const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
      setCategories(cats);
      setBrands(brs);
      if (editId) {
        const product = await getAdminProduct(editId);
        setName(product.name);
        setDescription(product.description ?? '');
        setPriceInput(String(product.price));
        setCompareAtPriceInput(product.compareAtPrice != null ? String(product.compareAtPrice) : '');
        setStockInput(String(product.stock ?? 0));
        setSku(product.sku ?? '');
        setCategoryId(product.category?.id ?? '');
        setBrandId(product.brand?.id ?? '');
        setIsOnSale(product.isOnSale);
        setIsTopSelling(product.isTopSelling);
        setIsPublished(product.isPublished);
        setImages(
          product.images
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => ({ url: img.url, alt: img.alt ?? undefined })),
        );
      } else if (cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load form data.');
    } finally {
      setInitialLoading(false);
    }
  }, [editId, router]);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSaveError(null);
    try {
      const presign = await presignUpload({ filename: file.name, contentType: file.type, folder: 'products' });
      await uploadFileToPresignedUrl(presign.uploadUrl, file);
      setImages((prev) => [...prev, { url: presign.publicUrl, alt: name || file.name }]);
      setImagesChanged(true);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setSaveError(err instanceof ApiError ? err.message : 'Image upload failed — please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesChanged(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!name.trim()) {
      setSaveError('Product title is required.');
      return;
    }
    if (!categoryId) {
      setSaveError('Category is required.');
      return;
    }
    const price = digitsToNumber(priceInput);
    if (!price) {
      setSaveError('A valid price is required.');
      return;
    }

    const payload: AdminProductPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price,
      stock: stockInput ? digitsToNumber(stockInput) : undefined,
      categoryId,
      brandId: brandId || undefined,
      isOnSale,
      isTopSelling,
      isPublished,
      sku: sku.trim() || undefined,
      compareAtPrice: compareAtPriceInput ? digitsToNumber(compareAtPriceInput) : undefined,
    };

    if (!isEdit || imagesChanged) {
      payload.images = images.map((img, idx) => ({ url: img.url, alt: img.alt, sortOrder: idx }));
    }

    setSaving(true);
    try {
      if (isEdit && editId) {
        await updateAdminProduct(editId, payload);
      } else {
        await createAdminProduct(payload);
      }
      router.push('/admin/products');
    } catch (err) {
      setSaving(false);
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setSaveError(err instanceof ApiError ? err.message : 'Failed to save product.');
    }
  };

  if (initialLoading) {
    return <LoadingState label="Loading product form..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-2">
            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{isEdit ? 'Edit' : 'Add New'}</span>
          </nav>
          <h1 className="text-3xl font-bold text-primary font-heading">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground mt-1">{isEdit ? 'Update this product listing.' : 'Create a new product listing for your storefront.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
            Discard
          </Link>
          <button onClick={handleSave} disabled={saving || uploading} className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] disabled:opacity-70 transition-colors shadow-sm">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </div>

      {loadError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}
      {saveError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* General Information Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">General Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Executive Leather Diary 2026"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20 resize-y"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Media / Images Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-heading font-semibold text-primary">Media</h2>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={img.url + idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group">
                    <Image src={img.url} alt={img.alt ?? name} fill sizes="200px" className="object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-accent text-white shadow">Main</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-accent/50 transition-colors cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors mb-3">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                )}
              </div>
              <p className="text-sm font-medium text-primary">{uploading ? 'Uploading...' : 'Click to upload an image'}</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP. First image is the main image.</p>
            </label>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">Pricing</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (TZS) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price (TZS)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">TZS</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={compareAtPriceInput}
                    onChange={(e) => setCompareAtPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">To show a crossed-out discount.</p>
              </div>
            </div>
          </div>

          {/* Inventory Tracking Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-6">Inventory</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. ST-ED-001"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (1/3) */}
        <div className="space-y-8">

          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">Product Status</h2>

            <div className="relative inline-block w-full">
              <select
                value={isPublished ? 'published' : 'draft'}
                onChange={(e) => setIsPublished(e.target.value === 'published')}
                className="appearance-none w-full border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white shadow-sm cursor-pointer"
              >
                <option value="published">Published (visible on storefront)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Product Organization</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm bg-white cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm bg-white cursor-pointer"
                  >
                    <option value="">No brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Merchandising Flags */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-heading font-semibold text-primary mb-4">Merchandising</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
                <span className="text-sm font-medium text-gray-700">On Sale (shows in Promotions)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isTopSelling} onChange={(e) => setIsTopSelling(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
                <span className="text-sm font-medium text-gray-700">Top Selling (shows in Top Selling)</span>
              </label>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
