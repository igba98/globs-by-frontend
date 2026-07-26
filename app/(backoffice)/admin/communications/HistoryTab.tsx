'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCommCampaigns, getCommCampaign, isSessionExpiredError } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Campaign, CampaignDetail } from '@/lib/types';

export default function HistoryTab() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<CampaignDetail | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setCampaigns((await getCommCampaigns()).items);
    } catch (err) {
      if (isSessionExpiredError(err)) { router.replace('/admin/login'); return; }
      setError(err instanceof ApiError ? err.message : 'Failed to load history.');
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-sm text-gray-400 py-8">Loading history…</p>;
  if (error) return <p className="text-sm text-red-600 py-8">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
              <th className="px-5 py-3">Date</th><th className="px-5 py-3">Message</th><th className="px-5 py-3">List</th>
              <th className="px-5 py-3 text-right">Sent</th><th className="px-5 py-3 text-right">Failed</th>
              <th className="px-5 py-3">Status</th><th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No messages sent yet.</td></tr>
            )}
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="px-5 py-3 whitespace-nowrap text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3 max-w-[280px] truncate font-medium text-primary">{c.message}</td>
                <td className="px-5 py-3 text-gray-500">{c.listName ?? '—'}</td>
                <td className="px-5 py-3 text-right font-semibold text-[#94B447]">{c.sentCount}</td>
                <td className="px-5 py-3 text-right font-semibold text-red-500">{c.failedCount}</td>
                <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  c.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : c.status === 'FAILED' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{c.status}</span></td>
                <td className="px-5 py-3">
                  <button onClick={async () => setDetail(await getCommCampaign(c.id))} className="text-xs font-bold text-gray-400 hover:text-primary">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-primary">Recipients — {new Date(detail.createdAt).toLocaleString()}</h3>
            <button onClick={() => setDetail(null)} className="text-sm text-gray-400 hover:text-primary">Close</button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 mb-4 whitespace-pre-wrap">{detail.message}</p>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100">
                <th className="px-4 py-2">Phone</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Error</th><th className="px-4 py-2">Sent at</th>
              </tr></thead>
              <tbody>
                {detail.recipients.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="px-4 py-2 font-medium">{r.phone}</td>
                    <td className={`px-4 py-2 font-bold text-xs ${r.status === 'SENT' ? 'text-[#94B447]' : r.status === 'FAILED' ? 'text-red-500' : 'text-yellow-600'}`}>{r.status}</td>
                    <td className="px-4 py-2 text-gray-500">{r.error ?? ''}</td>
                    <td className="px-4 py-2 text-gray-400">{r.sentAt ? new Date(r.sentAt).toLocaleTimeString() : ''}</td>
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
