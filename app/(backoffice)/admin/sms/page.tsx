'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createSmsRecipient,
  deleteSmsRecipient,
  getSmsRecipients,
  getSmsStatus,
  isSessionExpiredError,
  updateSmsRecipient,
} from '@/lib/admin-api';
import { getDeliveryZones } from '@/lib/api';
import { ApiError } from '@/lib/api';
import type { SmsRecipient, SmsStatus } from '@/lib/types';
import { ErrorState, LoadingState } from '@/components/backoffice/DataState';

const CATCH_ALL = '__catch_all__'; // sentinel for "All offices" (region = null) in the <select>

// Toggle switch — drives the isActive PATCH.
const StatusSwitch = ({ isOn, onToggle, disabled }: { isOn: boolean; onToggle: () => void; disabled?: boolean }) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    title={isOn ? 'Active — click to deactivate' : 'Inactive — click to activate'}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-60 disabled:cursor-wait ${isOn ? 'bg-accent' : 'bg-gray-200'}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

function extractBalance(balance: unknown): string {
  if (balance && typeof balance === 'object') {
    const b = balance as Record<string, unknown>;
    const data = (b.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : b);
    const credit = data.credit_balance ?? data.creditBalance ?? data.balance;
    if (credit !== undefined && credit !== null) return String(credit);
  }
  return '—';
}

const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';

export default function SmsRecipientsPage() {
  const router = useRouter();
  const [recipients, setRecipients] = useState<SmsRecipient[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [status, setStatus] = useState<SmsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add/edit form state
  const [editId, setEditId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [phone, setPhone] = useState('');
  const [regionValue, setRegionValue] = useState(CATCH_ALL);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, zones] = await Promise.all([getSmsRecipients(), getDeliveryZones()]);
      setRecipients(list);
      setRegions([...new Set(zones.map((z) => z.region))].sort());
      // Beem status is best-effort — don't fail the whole page if it errors.
      try {
        setStatus(await getSmsStatus());
      } catch {
        setStatus(null);
      }
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load SMS recipients.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditId(null);
    setLabel('');
    setPhone('');
    setRegionValue(CATCH_ALL);
    setFormError(null);
  };

  const startEdit = (r: SmsRecipient) => {
    setEditId(r.id);
    setLabel(r.label);
    setPhone(r.phone);
    setRegionValue(r.region ?? CATCH_ALL);
    setFormError(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !phone.trim()) {
      setFormError('Label and phone number are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      label: label.trim(),
      phone: phone.trim(),
      region: regionValue === CATCH_ALL ? null : regionValue,
    };
    try {
      if (editId) await updateSmsRecipient(editId, payload);
      else await createSmsRecipient(payload);
      resetForm();
      await load();
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      setFormError(err instanceof ApiError ? err.message : 'Failed to save recipient.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (r: SmsRecipient) => {
    setBusyId(r.id);
    try {
      const updated = await updateSmsRecipient(r.id, { isActive: !r.isActive });
      setRecipients((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      alert(err instanceof ApiError ? err.message : 'Failed to update recipient.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (r: SmsRecipient) => {
    if (!confirm(`Delete "${r.label}" (${r.phone})? This cannot be undone.`)) return;
    setBusyId(r.id);
    try {
      await deleteSmsRecipient(r.id);
      if (editId === r.id) resetForm();
      await load();
    } catch (err) {
      if (isSessionExpiredError(err)) {
        router.replace('/admin/login');
        return;
      }
      alert(err instanceof ApiError ? err.message : 'Failed to delete recipient.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary font-heading">SMS Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Staff numbers that receive new-order alerts. Alerts route to the office matching the order&apos;s region;
          numbers marked <span className="font-medium">All offices</span> receive every order (including pickups).
        </p>
      </div>

      {/* Beem status */}
      {status && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          {!status.configured ? (
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
              SMS is not configured on the server yet (Beem credentials missing). Recipients can be managed, but no messages will send.
            </div>
          ) : (
            <>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Sender ID</div>
                <div className="mt-1 text-sm font-semibold">
                  {status.senderActive === true ? (
                    <span className="inline-flex items-center gap-2 text-green-700"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Active</span>
                  ) : status.senderActive === false ? (
                    <span className="inline-flex items-center gap-2 text-red-600"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Not active</span>
                  ) : (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Account balance</div>
                <div className="mt-1 text-sm font-semibold text-primary">{extractBalance(status.balance)}</div>
              </div>
              {status.senderNames && status.senderNames.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Sender names</div>
                  <div className="mt-1 text-sm text-primary">{status.senderNames.map((s) => `${s.senderid} (${s.status})`).join(', ')}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add / edit form */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-primary mb-4">{editId ? 'Edit recipient' : 'Add recipient'}</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Label</label>
            <input className={inputClass} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Dar es Salaam office" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone</label>
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0743483769" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Office / region</label>
            <select className={inputClass} value={regionValue} onChange={(e) => setRegionValue(e.target.value)}>
              <option value={CATCH_ALL}>All offices (catch-all)</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          {formError && <div className="sm:col-span-3 text-sm text-red-600">{formError}</div>}
          <div className="sm:col-span-3 flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#2a3038] transition-colors shadow-sm disabled:opacity-60">
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Add recipient'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Recipients table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <LoadingState label="Loading recipients..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : recipients.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No recipients yet. Add one above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[11px] uppercase tracking-wider text-muted-foreground select-none">
                  <th className="p-4 font-semibold">Label</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Office / region</th>
                  <th className="p-4 font-semibold text-center">Active</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recipients.map((r) => {
                  const isBusy = busyId === r.id;
                  return (
                    <tr key={r.id} className={`transition-colors ${isBusy ? 'opacity-60' : 'hover:bg-gray-50/50'}`}>
                      <td className="p-4 font-semibold text-sm text-primary">{r.label}</td>
                      <td className="p-4 text-sm font-mono text-primary">{r.phone}</td>
                      <td className="p-4">
                        <span className="inline-flex px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[11px] font-medium tracking-wide uppercase">
                          {r.region ?? 'All offices'}
                        </span>
                      </td>
                      <td className="p-4 text-center align-middle">
                        <StatusSwitch isOn={r.isActive} disabled={isBusy} onToggle={() => handleToggle(r)} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => startEdit(r)} className="px-3 py-1.5 border border-gray-200 bg-white text-xs font-medium text-primary rounded-lg shadow-sm hover:border-primary transition-colors">
                            Edit
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => handleDelete(r)} className="px-3 py-1.5 border border-red-200 bg-white text-xs font-medium text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-colors disabled:opacity-60">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
