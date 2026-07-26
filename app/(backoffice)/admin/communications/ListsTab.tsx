'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCommList, getCommList, getCommLists, isSessionExpiredError } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { ContactListDetail, ContactListSummary } from '@/lib/types';

export default function ListsTab({ onSendToList }: { onSendToList: (id: string) => void }) {
  const router = useRouter();
  const [lists, setLists] = useState<ContactListSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactListDetail | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setLists(await getCommLists()); }
    catch (err) {
      if (isSessionExpiredError(err)) { router.replace('/admin/login'); return; }
      setError(err instanceof ApiError ? err.message : 'Failed to load lists.');
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (list: ContactListSummary) => {
    if (!window.confirm(`Delete the list "${list.name}" (${list.contactCount} contacts)?`)) return;
    try { await deleteCommList(list.id); setDetail(null); await load(); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Delete failed.'); }
  };

  if (loading) return <p className="text-sm text-gray-400 py-8">Loading lists…</p>;

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
            <th className="px-5 py-3">Name</th><th className="px-5 py-3">Columns</th>
            <th className="px-5 py-3 text-right">Contacts</th><th className="px-5 py-3">Created</th><th className="px-5 py-3"></th>
          </tr></thead>
          <tbody>
            {lists.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No saved lists — upload a sheet in Bulk Send and tick &quot;Save this list&quot;.</td></tr>
            )}
            {lists.map((l) => (
              <tr key={l.id} className="border-b border-gray-50">
                <td className="px-5 py-3 font-semibold text-primary">{l.name}</td>
                <td className="px-5 py-3 text-gray-500">{l.columns.map((c) => c.label).join(', ')}</td>
                <td className="px-5 py-3 text-right font-semibold">{l.contactCount}</td>
                <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 whitespace-nowrap space-x-3 text-right">
                  <button onClick={() => onSendToList(l.id)} className="text-xs font-bold text-[#94B447] hover:underline">Send</button>
                  <button onClick={async () => setDetail(await getCommList(l.id))} className="text-xs font-bold text-gray-400 hover:text-primary">View</button>
                  <button onClick={() => handleDelete(l)} className="text-xs font-bold text-gray-400 hover:text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary">{detail.name}</h3>
            <button onClick={() => setDetail(null)} className="text-sm text-gray-400 hover:text-primary">Close</button>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100">
                {detail.columns.map((c) => <th key={c.key} className="px-4 py-2">{c.label}</th>)}
              </tr></thead>
              <tbody>
                {detail.contacts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50">
                    {detail.columns.map((col) => <td key={col.key} className="px-4 py-2 text-gray-600">{c.data[col.key] ?? ''}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
