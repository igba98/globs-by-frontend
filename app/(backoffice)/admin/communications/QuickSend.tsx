'use client';

import { useState } from 'react';
import { sendCommCampaign, getCommCampaign, isSessionExpiredError } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { smsSegments } from './lib';

export default function QuickSend() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!phone.trim() || !message.trim()) return;
    setSending(true); setError(null); setResult(null);
    try {
      const { campaignId } = await sendCommCampaign({
        message,
        rows: [{ phone: phone.trim(), data: { phone: phone.trim() } }],
      });
      // Poll briefly for the outcome of the single recipient.
      for (let i = 0; i < 20; i++) {
        const c = await getCommCampaign(campaignId);
        if (c.status !== 'PROCESSING') {
          const r = c.recipients[0];
          setResult(r?.status === 'SENT' ? `Sent to ${r.phone}.` : `Failed: ${r?.error ?? 'unknown error'}`);
          if (r?.status === 'SENT') { setPhone(''); setMessage(''); }
          break;
        }
        await new Promise((res) => setTimeout(res, 500));
      }
    } catch (err) {
      if (isSessionExpiredError(err)) { router.replace('/admin/login'); return; }
      setError(err instanceof ApiError ? err.message : 'Send failed.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-500">Phone number</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX or +2557XX..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#94B447]" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-500">Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#94B447]" />
        <p className="text-xs text-gray-400">{message.length} characters · {smsSegments(message)} SMS segment{smsSegments(message) === 1 ? '' : 's'}</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <p className="text-sm text-[#94B447] font-semibold">{result}</p>}
      <button onClick={handleSend} disabled={sending || !phone.trim() || !message.trim()}
        className="bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-black transition-colors disabled:opacity-50">
        {sending ? 'Sending…' : 'Send SMS'}
      </button>
    </div>
  );
}
