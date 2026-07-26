'use client';

import { useState } from 'react';
import SendWizard from './SendWizard';
import QuickSend from './QuickSend';
import ListsTab from './ListsTab';
import HistoryTab from './HistoryTab';

type Tab = 'send' | 'quick' | 'lists' | 'history';

const TABS: { id: Tab; label: string }[] = [
  { id: 'send', label: 'Bulk Send' },
  { id: 'quick', label: 'Quick Send' },
  { id: 'lists', label: 'Saved Lists' },
  { id: 'history', label: 'History' },
];

export default function CommunicationsPage() {
  const [tab, setTab] = useState<Tab>('send');
  const [presetListId, setPresetListId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-bold text-primary font-heading">Communications</h1>
        <p className="text-sm text-gray-500 mt-1">Send SMS to clients — one at a time or in bulk from a spreadsheet.</p>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#94B447] text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'send' && <SendWizard presetListId={presetListId} clearPreset={() => setPresetListId(null)} />}
      {tab === 'quick' && <QuickSend />}
      {tab === 'lists' && <ListsTab onSendToList={(id) => { setPresetListId(id); setTab('send'); }} />}
      {tab === 'history' && <HistoryTab />}
    </div>
  );
}
