import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const DAY_LABELS = ['', 'Push', 'Soccer', 'Pull', 'Rest', 'Legs', 'Soccer', 'Core'];
const DAY_COLORS = ['', 'emerald', 'sky', 'violet', 'zinc', 'amber', 'sky', 'rose'];
const DAY_ICONS = ['', '💪', '⚽', '🏋️', '😴', '🦵', '⚽', '🧘'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayDayNumber() {
  // Monday=1(Push) ... Sunday=7(Core)
  const d = new Date().getDay(); // 0=Sun, 1=Mon...
  return d === 0 ? 7 : d;
}

function ProgressRing({ pct }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width="128" height="128" className="rotate-[-90deg]">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#27272a" strokeWidth="10" />
      <circle
        cx="64" cy="64" r={r} fill="none"
        stroke="#34d399" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

function MacroBar({ label, value, goal, color }) {
  const pct = Math.min((value / goal) * 100, 100);
  const colors = { emerald: 'bg-emerald-500', sky: 'bg-sky-500', amber: 'bg-amber-500' };
  return (
    <div className="flex-1">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300 font-medium">{value}/{goal}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const todayDay = getTodayDayNumber();
  const todayDate = today();

  const [sessions, setSessions] = useState([]);
  const [nutrition, setNutrition] = useState({ calories: 0, protein_g: 0, carbs_g: 0 });
  const [macroEdit, setMacroEdit] = useState(false);
  const [macroInput, setMacroInput] = useState({ calories: '', protein_g: '', carbs_g: '' });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    api.getSessions().then(data => {
      setSessions(data);
      // Compute streak
      const dates = [...new Set(data.map(s => s.started_at?.slice(0, 10)))].sort().reverse();
      let s = 0;
      let check = new Date();
      for (const d of dates) {
        const sessionDate = new Date(d + 'T00:00:00');
        const diff = Math.round((check - sessionDate) / 86400000);
        if (diff <= 1) { s++; check = sessionDate; }
        else break;
      }
      setStreak(s);
    });
    api.getNutrition(todayDate).then(setNutrition);
  }, []);

  // Count sessions this week (Mon–Sun)
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekSessions = sessions.filter(s => new Date(s.started_at) >= weekStart);
  const workoutDaysThisWeek = new Set(weekSessions.map(s => s.day_number)).size;
  const workoutRing = workoutDaysThisWeek / 5; // 5 training days per week

  async function saveMacros() {
    const updated = await api.saveNutrition({
      date: todayDate,
      calories: Number(macroInput.calories) || nutrition.calories,
      protein_g: Number(macroInput.protein_g) || nutrition.protein_g,
      carbs_g: Number(macroInput.carbs_g) || nutrition.carbs_g,
    });
    setNutrition(updated);
    setMacroEdit(false);
  }

  function openMacroEdit() {
    setMacroInput({ calories: nutrition.calories, protein_g: nutrition.protein_g, carbs_g: nutrition.carbs_g });
    setMacroEdit(true);
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-zinc-100">Workout Tracker</h1>
        <p className="text-zinc-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Progress Ring + Streak */}
      <div className="bg-zinc-900 rounded-2xl p-5 flex items-center gap-6">
        <div className="relative">
          <ProgressRing pct={workoutRing} />
          <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
            <span className="text-2xl font-bold text-emerald-400">{workoutDaysThisWeek}</span>
            <span className="text-xs text-zinc-400">/ 5 days</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide">Weekly Progress</p>
            <p className="text-lg font-semibold">{Math.round(workoutRing * 100)}% complete</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xs text-zinc-400">Streak</p>
              <p className="text-lg font-bold text-amber-400">{streak} day{streak !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Workout */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Today's Workout</h2>
        <button
          onClick={() => navigate(`/workout/${todayDay}`)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl p-5 flex items-center justify-between transition-colors"
        >
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{DAY_ICONS[todayDay]}</span>
              <span className="text-xl font-bold">Day {todayDay}: {DAY_LABELS[todayDay]}</span>
            </div>
            <p className="text-emerald-200 text-sm mt-1">Tap to start your workout</p>
          </div>
          <span className="text-3xl">→</span>
        </button>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">This Week</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map(day => {
            const isToday = day === todayDay;
            const done = weekSessions.some(s => s.day_number === day);
            const label = DAY_LABELS[day];
            const icon = DAY_ICONS[day];
            return (
              <button
                key={day}
                onClick={() => navigate(`/workout/${day}`)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-colors ${
                  isToday
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : done
                    ? 'bg-zinc-800 text-emerald-400'
                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label.slice(0, 3)}</span>
                {done && <span className="text-emerald-400">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-zinc-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Today's Nutrition</h2>
          <button onClick={openMacroEdit} className="text-xs text-emerald-400 hover:text-emerald-300">Edit</button>
        </div>
        {macroEdit ? (
          <div className="space-y-3">
            {[['Calories', 'calories', 2800], ['Protein (g)', 'protein_g', 150], ['Carbs (g)', 'carbs_g', 300]].map(([label, key, goal]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-zinc-400 text-sm w-28">{label}</span>
                <input
                  type="number"
                  value={macroInput[key]}
                  onChange={e => setMacroInput(p => ({ ...p, [key]: e.target.value }))}
                  className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder={`Goal: ${goal}`}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={saveMacros} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">Save</button>
              <button onClick={() => setMacroEdit(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg py-2 text-sm font-medium transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <MacroBar label="Calories" value={nutrition.calories} goal={2800} color="emerald" />
            <MacroBar label="Protein" value={nutrition.protein_g} goal={150} color="sky" />
            <MacroBar label="Carbs" value={nutrition.carbs_g} goal={300} color="amber" />
          </div>
        )}
      </div>
    </div>
  );
}
