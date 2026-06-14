import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

const DAY_LABELS = ['', 'Push', 'Soccer', 'Pull', 'Rest', 'Legs', 'Soccer', 'Core'];

function RestTimer({ defaultSeconds }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState(defaultSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function startTimer(secs) {
    clearInterval(intervalRef.current);
    setSelected(secs);
    setSeconds(secs);
    setRunning(true);
  }

  const pct = (seconds / selected) * 100;
  const circ = 2 * Math.PI * 28;

  return (
    <div className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4">
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="rotate-[-90deg]" width="80" height="80">
          <circle cx="40" cy="40" r="28" fill="none" stroke="#27272a" strokeWidth="6" />
          <circle cx="40" cy="40" r="28" fill="none" stroke={seconds === 0 ? '#ef4444' : '#34d399'} strokeWidth="6"
            strokeDasharray={`${circ * pct / 100} ${circ}`} strokeLinecap="round"
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${seconds === 0 ? 'text-red-400' : 'text-zinc-100'}`}>
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-xs text-zinc-400 font-medium">Rest Timer</p>
        <div className="flex gap-1.5">
          {[30, 60, 90, 120].map(s => (
            <button key={s} onClick={() => startTimer(s)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selected === s && running ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}>
              {s}s
            </button>
          ))}
        </div>
        <button onClick={() => { if (running) { clearInterval(intervalRef.current); setRunning(false); setSeconds(selected); } else startTimer(selected); }}
          className="w-full py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
          {running ? 'Reset' : seconds === 0 ? 'Done! Tap to restart' : 'Start'}
        </button>
      </div>
    </div>
  );
}

function SetRow({ setNum, data, onChange, onDelete }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500 w-6 text-center font-mono">{setNum}</span>
      <input type="number" min="0" step="2.5" placeholder="lbs"
        value={data.weight_lbs || ''}
        onChange={e => onChange({ ...data, weight_lbs: parseFloat(e.target.value) || 0 })}
        className="w-20 bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-center text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      <input type="number" min="0" placeholder="reps"
        value={data.reps || ''}
        onChange={e => onChange({ ...data, reps: parseInt(e.target.value) || 0 })}
        className="w-20 bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-center text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      <button
        onClick={() => onChange({ ...data, completed: !data.completed })}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          data.completed ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-600'
        }`}>
        ✓
      </button>
      <button onClick={onDelete} className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 text-zinc-600 hover:text-red-400 transition-colors">
        ×
      </button>
    </div>
  );
}

function ExerciseCard({ exercise, sessionId, restTimerDefault }) {
  const [sets, setSets] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function addSet() {
    const last = sets[sets.length - 1];
    const setNum = sets.length + 1;
    if (!sessionId) { setSets(p => [...p, { id: null, set_number: setNum, weight_lbs: last?.weight_lbs || 0, reps: last?.reps || 0, completed: false }]); return; }
    const row = await api.logSet({ session_id: sessionId, exercise_id: exercise.id, set_number: setNum, weight_lbs: last?.weight_lbs || 0, reps: last?.reps || 0, completed: 0 });
    setSets(p => [...p, { ...row, completed: !!row.completed }]);
  }

  async function updateSet(idx, updated) {
    const set = sets[idx];
    const newSets = sets.map((s, i) => i === idx ? updated : s);
    setSets(newSets);
    if (!set.id || !sessionId) return;
    await api.updateSet(set.id, { weight_lbs: updated.weight_lbs, reps: updated.reps, completed: updated.completed });
  }

  async function deleteSet(idx) {
    const set = sets[idx];
    if (set.id && sessionId) await api.deleteSet(set.id);
    setSets(p => p.filter((_, i) => i !== idx));
  }

  const completedCount = sets.filter(s => s.completed).length;
  const muscle_group = exercise.muscle_group;

  const groupColors = {
    Chest: 'bg-rose-900/50 text-rose-300', Shoulders: 'bg-sky-900/50 text-sky-300',
    'Upper Chest': 'bg-rose-900/50 text-rose-300', 'Side Delts': 'bg-sky-900/50 text-sky-300',
    Triceps: 'bg-violet-900/50 text-violet-300', Lats: 'bg-emerald-900/50 text-emerald-300',
    'Mid Back': 'bg-emerald-900/50 text-emerald-300', 'Rear Delts': 'bg-sky-900/50 text-sky-300',
    Biceps: 'bg-violet-900/50 text-violet-300', 'Quads/Glutes': 'bg-amber-900/50 text-amber-300',
    Hamstrings: 'bg-amber-900/50 text-amber-300', Quads: 'bg-amber-900/50 text-amber-300',
    'Quads/Glutes': 'bg-amber-900/50 text-amber-300', Calves: 'bg-amber-900/50 text-amber-300',
    Core: 'bg-zinc-700 text-zinc-300', Obliques: 'bg-zinc-700 text-zinc-300',
    'Lats/Core': 'bg-emerald-900/50 text-emerald-300', 'Full Body': 'bg-zinc-700 text-zinc-300',
  };

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setCollapsed(p => !p)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-zinc-100">{exercise.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${groupColors[muscle_group] || 'bg-zinc-800 text-zinc-400'}`}>
                {muscle_group}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {exercise.target_sets} sets × {exercise.target_reps} reps
              {sets.length > 0 && ` · ${completedCount}/${sets.length} done`}
            </p>
          </div>
          <span className="text-zinc-500 text-lg">{collapsed ? '▶' : '▼'}</span>
        </div>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {/* Set Logger */}
          <div>
            <div className="flex text-xs text-zinc-500 px-1 mb-1 gap-2">
              <span className="w-6 text-center">#</span>
              <span className="w-20 text-center">Weight</span>
              <span className="w-20 text-center">Reps</span>
              <span className="w-8 text-center">Done</span>
            </div>
            {sets.map((set, i) => (
              <SetRow key={i} setNum={i + 1} data={set} onChange={u => updateSet(i, u)} onDelete={() => deleteSet(i)} />
            ))}
            <button onClick={addSet}
              className="mt-2 w-full py-2 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:border-emerald-600 hover:text-emerald-400 text-sm transition-colors">
              + Add Set
            </button>
          </div>

          {/* Form Tips */}
          <button onClick={() => setTipsOpen(p => !p)}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <span>{tipsOpen ? '▼' : '▶'}</span>
            <span>Form Tips</span>
          </button>
          {tipsOpen && (
            <ul className="space-y-1.5 pl-4">
              {(exercise.form_tips || []).map((tip, i) => (
                <li key={i} className="text-xs text-zinc-400 list-disc">{tip}</li>
              ))}
            </ul>
          )}

          {/* Watch Demo */}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_query)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <span>▶</span> Watch Demo on YouTube
          </a>
        </div>
      )}
    </div>
  );
}

export default function Workout() {
  const { day } = useParams();
  const dayNum = parseInt(day);
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [session, setSession] = useState(null);
  const [started, setStarted] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [restDefault, setRestDefault] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    api.getExercisesByDay(dayNum).then(setExercises);
    api.getSettings().then(s => setRestDefault(parseInt(s.rest_timer_seconds) || 60));
  }, [dayNum]);

  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started]);

  async function startWorkout() {
    const s = await api.startSession(dayNum);
    setSession(s);
    setStarted(true);
  }

  async function finishWorkout() {
    if (!session) return;
    clearInterval(timerRef.current);
    await api.finishSession(session.id, null);
    navigate('/history');
  }

  const label = DAY_LABELS[dayNum];
  const elapsedStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-zinc-200 transition-colors">←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Day {dayNum}: {label}</h1>
          {started && <p className="text-xs text-emerald-400">⏱ {elapsedStr}</p>}
        </div>
        {!started && (
          <button onClick={startWorkout} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Start
          </button>
        )}
      </div>

      {/* Rest Timer */}
      <RestTimer defaultSeconds={restDefault} />

      {/* Exercises */}
      <div className="space-y-3">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} sessionId={session?.id} restTimerDefault={restDefault} />
        ))}
      </div>

      {/* Finish */}
      {started && (
        <button
          onClick={finishWorkout}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl py-4 font-bold text-lg transition-colors mt-4">
          Finish Workout ✓
        </button>
      )}
    </div>
  );
}
