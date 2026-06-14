const BASE = 'http://localhost:3001/api';

async function json(url, opts = {}) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Exercises
  getExercisesByDay: (day) => json(`/exercises/day/${day}`),
  getAllExercises: () => json('/exercises'),

  // Sessions
  getSessions: (type) => json(`/sessions${type && type !== 'all' ? `?type=${type}` : ''}`),
  getSession: (id) => json(`/sessions/${id}`),
  startSession: (day_number) => json('/sessions', { method: 'POST', body: { day_number } }),
  finishSession: (id, notes) => json(`/sessions/${id}/finish`, { method: 'PATCH', body: { notes } }),
  clearHistory: () => json('/sessions/all', { method: 'DELETE' }),

  // Sets
  logSet: (data) => json('/sets', { method: 'POST', body: data }),
  updateSet: (id, data) => json(`/sets/${id}`, { method: 'PATCH', body: data }),
  deleteSet: (id) => json(`/sets/${id}`, { method: 'DELETE' }),
  getProgress: (exerciseId) => json(`/sets/progress/${exerciseId}`),

  // Nutrition
  getNutrition: (date) => json(`/nutrition/${date}`),
  saveNutrition: (data) => json('/nutrition', { method: 'POST', body: data }),

  // Settings
  getSettings: () => json('/settings'),
  updateSetting: (key, value) => json(`/settings/${key}`, { method: 'PATCH', body: { value } }),

  // CSV export
  exportCsv: () => window.open(BASE + '/settings/export/csv', '_blank'),
};
