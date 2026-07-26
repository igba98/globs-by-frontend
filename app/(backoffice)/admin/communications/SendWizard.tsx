'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createCommList, downloadCommTemplate, getCommCampaign, getCommList, getCommLists,
  isSessionExpiredError, parseCommSheet, sendCommCampaign,
} from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { CampaignDetail, CommColumn, ContactListSummary, ParseResult, ParsedRow } from '@/lib/types';
import { extractPlaceholders, renderPreview, smsSegments } from './lib';

const SUGGESTED = ['Full Name', 'School Name'];
const PHONE_COL: CommColumn = { key: 'phone', label: 'Phone Number' };

function slugifyKey(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export default function SendWizard({ presetListId, clearPreset }: { presetListId: string | null; clearPreset: () => void }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Recipient source
  const [columns, setColumns] = useState<CommColumn[]>([PHONE_COL, { key: 'full_name', label: 'Full Name' }]);
  const [newCol, setNewCol] = useState('');
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [savedLists, setSavedLists] = useState<ContactListSummary[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compose + send
  const [message, setMessage] = useState('');
  const [saveListName, setSaveListName] = useState('');
  const [wantSave, setWantSave] = useState(false);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fail = useCallback((err: unknown, fallback: string) => {
    if (isSessionExpiredError(err)) { router.replace('/admin/login'); return; }
    setError(err instanceof ApiError ? err.message : fallback);
  }, [router]);

  useEffect(() => {
    getCommLists().then(setSavedLists).catch(() => setSavedLists([]));
  }, []);

  // "Send to this list" jump from the Lists tab
  useEffect(() => {
    if (!presetListId) return;
    setSelectedListId(presetListId);
    getCommList(presetListId).then((l) => { setColumns(l.columns); setParsed(null); }).catch(() => undefined);
    clearPreset();
  }, [presetListId, clearPreset]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const activeColumns = parsed?.columns ?? columns;
  const activeRows: ParsedRow[] = parsed?.rows ?? [];
  const usingList = selectedListId !== null && parsed === null;
  const recipientCount = usingList
    ? savedLists.find((l) => l.id === selectedListId)?.contactCount ?? 0
    : activeRows.length;
  const unknownTokens = extractPlaceholders(message).filter((t) => !activeColumns.some((c) => c.key === t));
  const canSend = message.trim().length > 0 && unknownTokens.length === 0 && recipientCount > 0 && !campaign;

  const addColumn = (label: string) => {
    const key = slugifyKey(label);
    if (!key || key === 'phone' || columns.some((c) => c.key === key)) return;
    setColumns([...columns, { key, label: label.trim() }]);
    setNewCol('');
  };

  const handleTemplate = async () => {
    setBusy('template'); setError(null);
    try {
      const blob = await downloadCommTemplate(columns);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'sms-template.xlsx'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { fail(err, 'Could not generate the template.'); }
    finally { setBusy(null); }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy('parse'); setError(null); setSelectedListId(null);
    try {
      setParsed(await parseCommSheet(file));
    } catch (err) { fail(err, 'Could not read that file.'); }
    finally { setBusy(null); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleSend = async () => {
    setBusy('send'); setError(null);
    try {
      if (wantSave && parsed && saveListName.trim()) {
        await createCommList(saveListName.trim(), parsed.columns, parsed.rows);
        setSavedLists(await getCommLists());
      }
      const { campaignId } = await sendCommCampaign(
        usingList ? { message, listId: selectedListId as string } : { message, rows: activeRows },
      );
      const poll = async () => {
        const c = await getCommCampaign(campaignId);
        setCampaign(c);
        if (c.status !== 'PROCESSING' && pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      };
      await poll();
      pollRef.current = setInterval(() => { void poll(); }, 1500);
    } catch (err) { fail(err, 'Send failed.'); }
    finally { setBusy(null); }
  };

  const reset = () => {
    setCampaign(null); setParsed(null); setMessage(''); setWantSave(false); setSaveListName(''); setSelectedListId(null);
  };

  if (campaign) {
    const done = campaign.status !== 'PROCESSING';
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-primary text-lg">{done ? 'Send complete' : 'Sending…'}</h3>
        <div className="flex gap-8 text-sm font-semibold">
          <span className="text-gray-500">Total: {campaign.total}</span>
          <span className="text-[#94B447]">Sent: {campaign.sentCount}</span>
          <span className="text-red-500">Failed: {campaign.failedCount}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="bg-[#94B447] h-2 transition-all"
            style={{ width: `${campaign.total ? Math.round(((campaign.sentCount + campaign.failedCount) / campaign.total) * 100) : 0}%` }} />
        </div>
        {done && (
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100">
                <th className="px-4 py-2">Phone</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Error</th>
              </tr></thead>
              <tbody>
                {campaign.recipients.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="px-4 py-2 font-medium">{r.phone}</td>
                    <td className={`px-4 py-2 text-xs font-bold ${r.status === 'SENT' ? 'text-[#94B447]' : 'text-red-500'}`}>{r.status}</td>
                    <td className="px-4 py-2 text-gray-500">{r.error ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {done && (
          <button onClick={reset} className="bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-black transition-colors">
            Send another
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: recipients */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-bold text-primary">1 · Recipients</h3>

        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-500">Build a template</p>
          <div className="flex flex-wrap gap-2 items-center">
            {columns.map((c) => (
              <span key={c.key} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                c.key === 'phone' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'}`}>
                {c.label}{c.key === 'phone' && ' (required)'}
                {c.key !== 'phone' && (
                  <button onClick={() => setColumns(columns.filter((x) => x.key !== c.key))} className="hover:text-red-500">×</button>
                )}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {SUGGESTED.filter((s) => !columns.some((c) => c.key === slugifyKey(s))).map((s) => (
              <button key={s} onClick={() => addColumn(s)} className="text-xs font-semibold text-[#94B447] border border-[#94B447]/40 rounded-full px-3 py-1.5 hover:bg-[#94B447]/10">+ {s}</button>
            ))}
            <input value={newCol} onChange={(e) => setNewCol(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addColumn(newCol); }}
              placeholder="Custom column…" className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#94B447]" />
            {newCol.trim() && <button onClick={() => addColumn(newCol)} className="text-xs font-bold text-primary">Add</button>}
          </div>
          <button onClick={handleTemplate} disabled={busy === 'template'}
            className="text-sm font-semibold text-primary border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-400 transition-colors disabled:opacity-50">
            {busy === 'template' ? 'Generating…' : 'Download template (.xlsx)'}
          </button>
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-4 items-center">
          <button onClick={() => fileRef.current?.click()} disabled={busy === 'parse'}
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-black transition-colors disabled:opacity-50">
            {busy === 'parse' ? 'Reading…' : 'Upload filled sheet (.xlsx / .csv)'}
          </button>
          <input ref={fileRef} type="file" hidden accept=".xlsx,.csv" onChange={(e) => handleFile(e.target.files?.[0])} />
          <span className="text-xs text-gray-400">or</span>
          <select value={selectedListId ?? ''} onChange={(e) => {
            const id = e.target.value || null;
            setSelectedListId(id); setParsed(null);
            if (id) getCommList(id).then((l) => setColumns(l.columns)).catch(() => undefined);
          }} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#94B447]">
            <option value="">Use a saved list…</option>
            {savedLists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.contactCount})</option>)}
          </select>
        </div>

        {parsed && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#94B447]">{parsed.rows.length} valid recipient{parsed.rows.length === 1 ? '' : 's'} loaded.</p>
            {parsed.invalid.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
                <p className="font-bold mb-1">{parsed.invalid.length} row{parsed.invalid.length === 1 ? '' : 's'} skipped:</p>
                <ul className="list-disc ml-5 space-y-0.5">
                  {parsed.invalid.slice(0, 10).map((iv) => <li key={iv.rowNumber}>Row {iv.rowNumber}: {iv.reason}</li>)}
                  {parsed.invalid.length > 10 && <li>…and {parsed.invalid.length - 10} more</li>}
                </ul>
              </div>
            )}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead><tr className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100">
                  {parsed.columns.map((c) => <th key={c.key} className="px-4 py-2">{c.label}</th>)}
                </tr></thead>
                <tbody>
                  {parsed.rows.slice(0, 10).map((r, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {parsed.columns.map((c) => <td key={c.key} className="px-4 py-2 text-gray-600">{r.data[c.key] ?? ''}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <input type="checkbox" checked={wantSave} onChange={(e) => setWantSave(e.target.checked)} />
              Save this list for future use
            </label>
            {wantSave && (
              <input value={saveListName} onChange={(e) => setSaveListName(e.target.value)} placeholder="List name (e.g. Mbeya Schools)"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#94B447] w-72" />
            )}
          </div>
        )}
        {usingList && recipientCount > 0 && (
          <p className="text-sm font-semibold text-[#94B447]">Sending to saved list ({recipientCount} contact{recipientCount === 1 ? '' : 's'}).</p>
        )}
      </div>

      {/* Step 2: compose */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-primary">2 · Message</h3>
        <div className="flex flex-wrap gap-2">
          {activeColumns.map((c) => (
            <button key={c.key} onClick={() => setMessage((m) => `${m}{${c.key}}`)}
              className="text-xs font-bold text-primary bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200">
              {'{'}{c.key}{'}'}
            </button>
          ))}
        </div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
          placeholder="Habari {full_name}, …"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#94B447]" />
        <p className="text-xs text-gray-400">{message.length} characters · {smsSegments(message)} SMS segment{smsSegments(message) === 1 ? '' : 's'} per recipient</p>
        {unknownTokens.length > 0 && (
          <p className="text-sm text-red-600 font-semibold">
            Unknown placeholder{unknownTokens.length === 1 ? '' : 's'}: {unknownTokens.map((t) => `{${t}}`).join(', ')} — they don&apos;t match any column.
          </p>
        )}
        {message && activeRows[0] && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Preview (first recipient)</p>
            <p className="text-sm text-primary">{renderPreview(message, activeRows[0].data)}</p>
          </div>
        )}
      </div>

      {/* Step 3: send */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm font-semibold text-gray-600">
          {recipientCount > 0 ? `Ready to send to ${recipientCount} recipient${recipientCount === 1 ? '' : 's'}.` : 'Upload a sheet or pick a saved list first.'}
        </p>
        {error && <p className="text-sm text-red-600 font-semibold w-full">{error}</p>}
        <button onClick={handleSend} disabled={!canSend || busy === 'send'}
          className="bg-[#94B447] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#86a53f] transition-colors disabled:opacity-50">
          {busy === 'send' ? 'Starting…' : 'Send SMS'}
        </button>
      </div>
    </div>
  );
}
