import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const obj = {};
  for (const r of rows) obj[r.key] = r.value;
  res.json(obj);
});

router.patch('/:key', (req, res) => {
  const { value } = req.body;
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(req.params.key, value);
  res.json({ key: req.params.key, value });
});

router.get('/export/csv', (req, res) => {
  const sets = db.prepare(`
    SELECT s.started_at, s.finished_at, e.name as exercise, e.muscle_group,
      ls.set_number, ls.weight_lbs, ls.reps, ls.completed,
      d.name as day_label
    FROM logged_sets ls
    JOIN sessions s ON s.id = ls.session_id
    JOIN exercises e ON e.id = ls.exercise_id
    LEFT JOIN (
      SELECT 1 as num, 'Push' as name UNION SELECT 2, 'Soccer' UNION SELECT 3, 'Pull'
      UNION SELECT 4, 'Rest' UNION SELECT 5, 'Legs' UNION SELECT 6, 'Soccer'
      UNION SELECT 7, 'Core'
    ) d ON d.num = s.day_number
    ORDER BY s.started_at DESC, ls.exercise_id, ls.set_number
  `).all();

  const headers = ['Date', 'Day', 'Exercise', 'Muscle Group', 'Set #', 'Weight (lbs)', 'Reps', 'Completed'];
  const rows = sets.map(s => [
    s.started_at?.slice(0, 10) || '',
    s.day_label || '',
    s.exercise || '',
    s.muscle_group || '',
    s.set_number,
    s.weight_lbs,
    s.reps,
    s.completed ? 'Yes' : 'No'
  ]);

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="workout_history.csv"');
  res.send(csv);
});

export default router;
