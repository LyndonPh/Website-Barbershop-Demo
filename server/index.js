import express from 'express';
import cors from 'cors';
import exercisesRouter from './routes/exercises.js';
import sessionsRouter from './routes/sessions.js';
import setsRouter from './routes/sets.js';
import nutritionRouter from './routes/nutrition.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/exercises', exercisesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/sets', setsRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/settings', settingsRouter);

app.listen(PORT, () => {
  console.log(`Workout Tracker API running on http://localhost:${PORT}`);
});
