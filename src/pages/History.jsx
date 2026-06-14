import { useState, useEffect } from 'react';
import { api } from '../api';

const DAY_LABELS = { 1: 'Push', 2: 'Soccer', 3: 'Pull', 4: 'Rest', 5: 'Legs', 6: 'Soccer', 7: 'Core' };
const DAY_ICONS = { 1: '💪', 2: '⚽', 3: '🏋️', 4: '😴', 5: '🦵', 6: '⚽', 7: '🧘' };
const FILTERS = ['all', 'Push', 'Pull', 'Legs', 'Core', 'Soccer'];

function duration(started, finished) {
  if (!started || !finished) return '—';
  const ms = new Date(finished) - new Date(started);
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function SessionItem({ session }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);

  async function toggle() {
    if (!expanded && !detail) {
      const data = await api.getSession(session.id);
      setDetail(data);
    }
    setExpanded(p => !p);
  }

  const label = DAY_LABELS[session.day_number] || 'Workout';
  const icon = DAY_ICONS[session.day_number] || '🏋️';
  const date = session.started_at ? new Date(session.started_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left p-4" onClick={toggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-semibold text-zinc-100">{label}</p>
              <p className="text-xs text-zinc-400">{date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-300">{duration(session.started_at, session.finished_at)}</p>
            <span className="text-zinc-500 text-sm">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {expanded && detail && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
          {detail.sets?.length === 0 ? (
            <p className="text-sm text-zinc-500">No sets logged.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(
                (detail.sets || []).reduce((acc, s) => {
                  const key = s.exercise_name;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(s);
                  return acc;
                }, {})
              ).map(([exName, exSets]) => (
                <div key={exName}>
                  <p className="text-xs font-semibold text-zinc-400 mb-1">{exName}</p>
                  <div className="grid grid-cols-3 text-xs text-zinc-500 mb-1 px-1">
                    <span>Set</span><span>Weight</span><span>Reps</span>
                  </div>
                  {exSets.map((s, i) => (
                    <div key={i} className={`grid grid-cols-3 text-sm px-1 py-0.5 rounded ${s.completed ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>
                      <span>{s.set_number}</span>
                      <span>{s.weight_lbs || 0} lbs</span>
                      <span>{s.reps}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSessions(filter).then(data => { setSessions(data); setLoading(false); });
  }, [filter]);

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-zinc-400 text-sm mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-4xl mb-3">📋</p>
          <p>No sessions yet. Start a workout!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => <SessionItem key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}
