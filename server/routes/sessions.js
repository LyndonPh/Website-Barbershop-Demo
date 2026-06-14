import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const { type } = req.query;
  let sessions;
  if (type && type !== 'all') {
    const dayMap = { Push: 1, Pull: 3, Legs: 5, Core: 7, Soccer: [2, 6] };
    const days = dayMap[type];
    if (Array.isArray(days)) {
      sessions = db.prepare('SELECT * FROM sessions WHERE day_number IN (?,?) ORDER BY started_at DESC').all(...days);
    } else {
      sessions = db.prepare('SELECT * FROM sessions WHERE day_number = ? ORDER BY started_at DESC').all(days);
    }
  } else {
    sessions = db.prepare('SELECT * FROM sessions ORDER BY started_at DESC').all();
  }
  res.json(sessions);
});

router.get('/:id', (req, res) => {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const sets = db.prepare(`
    SELECT ls.*, e.name as exercise_name, e.muscle_group
    FROM logged_sets ls
    JOIN exercises e ON e.id = ls.exercise_id
    WHERE ls.session_id = ?
    ORDER BY ls.exercise_id, ls.set_number
  `).all(req.params.id);
  res.json({ ...session, sets });
});

router.post('/', (req, res) => {
  const { day_number, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO sessions (day_number, started_at, notes)
    VALUES (?, datetime('now'), ?)
  `).run(day_number, notes || null);
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(session);
});

router.patch('/:id/finish', (req, res) => {
  const { notes } = req.body;
  db.prepare(`UPDATE sessions SET finished_at = datetime('now'), notes = ? WHERE id = ?`).run(notes || null, req.params.id);
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
  res.json(session);
});

router.delete('/all', (req, res) => {
  db.prepare('DELETE FROM logged_sets').run();
  db.prepare('DELETE FROM sessions').run();
  res.json({ ok: true });
});

export default router;
