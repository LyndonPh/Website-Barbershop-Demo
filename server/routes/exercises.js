import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const exercises = db.prepare('SELECT * FROM exercises ORDER BY day_number, id').all();
  res.json(exercises.map(e => ({ ...e, form_tips: JSON.parse(e.form_tips || '[]') })));
});

router.get('/day/:dayNumber', (req, res) => {
  const exercises = db.prepare('SELECT * FROM exercises WHERE day_number = ? ORDER BY id').all(req.params.dayNumber);
  res.json(exercises.map(e => ({ ...e, form_tips: JSON.parse(e.form_tips || '[]') })));
});

export default router;
