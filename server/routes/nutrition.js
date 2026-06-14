import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/:date', (req, res) => {
  const row = db.prepare('SELECT * FROM daily_nutrition WHERE date = ?').get(req.params.date);
  res.json(row || { date: req.params.date, calories: 0, protein_g: 0, carbs_g: 0, notes: '' });
});

router.post('/', (req, res) => {
  const { date, calories, protein_g, carbs_g, notes } = req.body;
  db.prepare(`
    INSERT INTO daily_nutrition (date, calories, protein_g, carbs_g, notes)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      calories = excluded.calories,
      protein_g = excluded.protein_g,
      carbs_g = excluded.carbs_g,
      notes = excluded.notes
  `).run(date, calories || 0, protein_g || 0, carbs_g || 0, notes || null);
  const row = db.prepare('SELECT * FROM daily_nutrition WHERE date = ?').get(date);
  res.json(row);
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM daily_nutrition ORDER BY date DESC LIMIT 30').all();
  res.json(rows);
});

export default router;
