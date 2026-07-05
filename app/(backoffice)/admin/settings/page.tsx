'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSettings, isSessionExpiredError, updateAdminSettings } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

type FormState = {
  announcementText: string;
  paymentInstructions: string;
  contactDsm: string;
  contactMbeya: string;
  phoneDsm: string;
  phoneMbeya: string;
  emailInfo: string;
  emailMarketing: string;
  instagramUrl: string;
  facebookUrl: string;
};

function toFormState(settings: SiteSettings): FormState {
  return {
    announcementText: settings.announcementText ?? '',
    paymentInstructions: settings.paymentInstructions ?? '',
    contactDsm: settings.contactDsm ?? '',
    contactMbeya: settings.contactMbeya ?? '',
    phoneDsm: settings.phoneDsm ?? '',
    phoneMbeya: settings.phoneMbeya ?? '',
    emailInfo: settings.emailInfo ?? '',
    emailMarketing: settings.emailMarketing ?? '',
    instagramUrl: settings.instagramUrl ?? '',
    facebookUrl: settings.facebookUrl ?? '',
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await getAdminSettings();
      setForm(toFormState(settings));
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updated = await updateAdminSettings(form);
      setForm(toFormState(updated));
      setSaved(true);
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setSaveError(err instanceof ApiError ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading settings..." />;
  }

  if (error || !form) {
    return <ErrorState message={error ?? 'Failed to load settings.'} onRetry={load} />;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your storefront announcement, contact details, and payment instructions.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-10">

        {saveError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {saveError}
          </div>
        )}

        {/* Storefront Messaging */}
        <div>
          <h2 className="text-xl font-bold text-[#18202D] mb-6 border-b border-gray-100 pb-4">Storefront Messaging</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Announcement Bar Text</label>
              <input
                type="text"
                value={form.announcementText}
                onChange={(e) => setField('announcementText', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Payment Instructions</label>
              <textarea
                value={form.paymentInstructions}
                onChange={(e) => setField('paymentInstructions', e.target.value)}
                rows={5}
                placeholder="e.g. Pay via M-Pesa Lipa Namba 123456 and share the confirmation SMS with our support line."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/50 transition-all resize-y"
              ></textarea>
              <p className="text-xs text-muted-foreground">Shown to customers on the order success page.</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h2 className="text-xl font-bold text-[#18202D] mb-6 border-b border-gray-100 pb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Dar es Salaam Address</label>
              <input type="text" value={form.contactDsm} onChange={(e) => setField('contactDsm', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Mbeya Address</label>
              <input type="text" value={form.contactMbeya} onChange={(e) => setField('contactMbeya', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Dar es Salaam Phone</label>
              <input type="tel" value={form.phoneDsm} onChange={(e) => setField('phoneDsm', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Mbeya Phone</label>
              <input type="tel" value={form.phoneMbeya} onChange={(e) => setField('phoneMbeya', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Info Email</label>
              <input type="email" value={form.emailInfo} onChange={(e) => setField('emailInfo', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Marketing Email</label>
              <input type="email" value={form.emailMarketing} onChange={(e) => setField('emailMarketing', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-xl font-bold text-[#18202D] mb-6 border-b border-gray-100 pb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Instagram URL</label>
              <input type="url" value={form.instagramUrl} onChange={(e) => setField('instagramUrl', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500">Facebook URL</label>
              <input type="url" value={form.facebookUrl} onChange={(e) => setField('facebookUrl', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#C9A84C] transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-4">
          {saved && <span className="text-sm font-semibold text-emerald-600">Saved.</span>}
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#18202D] text-white font-bold rounded-xl shadow-sm hover:bg-[#253041] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
