import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.post('/', (req, res) => {
  const { session_id, exercise_id, set_number, weight_lbs, reps, completed } = req.body;
  const result = db.prepare(`
    INSERT INTO logged_sets (session_id, exercise_id, set_number, weight_lbs, reps, completed)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(session_id, exercise_id, set_number, weight_lbs ?? 0, reps ?? 0, completed ? 1 : 0);
  const row = db.prepare('SELECT * FROM logged_sets WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.patch('/:id', (req, res) => {
  const { weight_lbs, reps, completed } = req.body;
  db.prepare(`
    UPDATE logged_sets SET weight_lbs = ?, reps = ?, completed = ? WHERE id = ?
  `).run(weight_lbs ?? 0, reps ?? 0, completed ? 1 : 0, req.params.id);
  const row = db.prepare('SELECT * FROM logged_sets WHERE id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM logged_sets WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Progress data — volume over time per exercise
router.get('/progress/:exerciseId', (req, res) => {
  const rows = db.prepare(`
    SELECT s.started_at, s.id as session_id,
      SUM(ls.weight_lbs * ls.reps) as volume,
      MAX(ls.weight_lbs) as max_weight,
      COUNT(ls.id) as total_sets
    FROM logged_sets ls
    JOIN sessions s ON s.id = ls.session_id
    WHERE ls.exercise_id = ? AND ls.completed = 1
    GROUP BY s.id
    ORDER BY s.started_at ASC
  `).all(req.params.exerciseId);
  res.json(rows);
});

export default router;
