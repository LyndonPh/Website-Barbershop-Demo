import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../api';

const CHART_TABS = [
  { key: 'volume', label: 'Volume', color: '#34d399', dataKey: 'volume', unit: 'lb·reps' },
  { key: 'weight', label: 'Max Weight', color: '#60a5fa', dataKey: 'max_weight', unit: 'lbs' },
];

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="text-zinc-100 font-semibold">{payload[0].value?.toLocaleString()} {unit}</p>
    </div>
  );
}

export default function Progress() {
  const [exercises, setExercises] = useState([]);
  const [selectedEx, setSelectedEx] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [tab, setTab] = useState('volume');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getAllExercises().then(data => {
      const filtered = data.filter(e => e.day_number !== 2 && e.day_number !== 4 && e.day_number !== 6);
      setExercises(filtered);
      if (filtered.length) setSelectedEx(filtered[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedEx) return;
    setLoading(true);
    api.getProgress(selectedEx.id).then(data => {
      setProgressData(data.map(row => ({
        ...row,
        date: new Date(row.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Math.round(row.volume),
        max_weight: row.max_weight,
      })));
      setLoading(false);
    });
  }, [selectedEx]);

  const currentTab = CHART_TABS.find(t => t.key === tab);

  return (
    <div className="p-4 space-y-5">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-zinc-400 text-sm mt-1">Track your strength over time</p>
      </div>

      {/* Exercise Selector */}
      <div>
        <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wide">Exercise</label>
        <select
          value={selectedEx?.id || ''}
          onChange={e => setSelectedEx(exercises.find(ex => ex.id === parseInt(e.target.value)))}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
      </div>

      {/* Chart Type Tabs */}
      <div className="flex gap-2">
        {CHART_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : progressData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
            <p className="text-3xl mb-2">📈</p>
            <p className="text-sm">No data yet — log some sets!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={progressData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<CustomTooltip unit={currentTab.unit} />} />
              <Line
                type="monotone" dataKey={currentTab.dataKey}
                stroke={currentTab.color} strokeWidth={2.5}
                dot={{ fill: currentTab.color, r: 4 }}
                activeDot={{ r: 6, fill: currentTab.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Summary */}
      {progressData.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: progressData.length },
            { label: 'Best Volume', value: `${Math.max(...progressData.map(d => d.volume)).toLocaleString()}` },
            { label: 'Max Weight', value: `${Math.max(...progressData.map(d => d.max_weight || 0))} lbs` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 rounded-xl p-3 text-center">
              <p className="text-xs text-zinc-400 mb-1">{label}</p>
              <p className="font-bold text-zinc-100 text-sm">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
