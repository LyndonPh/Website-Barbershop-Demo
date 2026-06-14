import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Settings() {
  const [settings, setSettings] = useState({ rest_timer_seconds: '60', bodyweight_lbs: '125' });
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  async function saveSetting(key, value) {
    await api.updateSetting(key, value);
    setSettings(p => ({ ...p, [key]: value }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function clearHistory() {
    await api.clearHistory();
    setShowConfirm(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  }

  return (
    <div className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Training Settings */}
      <div className="bg-zinc-900 rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Training</h2>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">Default Rest Timer</label>
          <div className="flex gap-2">
            {[30, 60, 90, 120].map(s => (
              <button key={s} onClick={() => saveSetting('rest_timer_seconds', String(s))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  settings.rest_timer_seconds === String(s)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}>
                {s}s
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">Bodyweight (lbs)</label>
          <input
            type="number" min="50" max="400" step="0.5"
            value={settings.bodyweight_lbs}
            onChange={e => setSettings(p => ({ ...p, bodyweight_lbs: e.target.value }))}
            onBlur={e => saveSetting('bodyweight_lbs', e.target.value)}
            className="w-full bg-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <p className="text-xs text-zinc-500 mt-1">Used for bodyweight exercise volume calculations</p>
        </div>
      </div>

      {/* About */}
      <div className="bg-zinc-900 rounded-2xl p-5 space-y-2">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">About</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-400">Split</span><span className="text-zinc-200">Push / Pull / Legs + Soccer</span></div>
          <div className="flex justify-between"><span className="text-zinc-400">Goal</span><span className="text-zinc-200">Lean muscle + athleticism</span></div>
          <div className="flex justify-between"><span className="text-zinc-400">Frequency</span><span className="text-zinc-200">5 days / week</span></div>
        </div>
      </div>

      {/* Data */}
      <div className="bg-zinc-900 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Data</h2>

        <button onClick={() => api.exportCsv()}
          className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 rounded-xl px-4 py-3 transition-colors">
          <span className="text-sm text-zinc-200">Export History as CSV</span>
          <span className="text-zinc-400">↓</span>
        </button>

        <button onClick={() => setShowConfirm(true)}
          className="w-full flex items-center justify-between bg-red-950/50 hover:bg-red-900/50 border border-red-800/50 rounded-xl px-4 py-3 transition-colors">
          <span className="text-sm text-red-400">Clear All History</span>
          <span className="text-red-600">🗑</span>
        </button>

        {cleared && (
          <p className="text-sm text-emerald-400 text-center">History cleared successfully.</p>
        )}
      </div>

      {saved && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          Settings saved ✓
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-100">Clear All History?</h3>
            <p className="text-sm text-zinc-400">This will permanently delete all workout sessions and logged sets. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-200 text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={clearHistory}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white text-sm font-medium transition-colors">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
