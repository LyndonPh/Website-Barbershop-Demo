import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'workout.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY,
    day_number INTEGER,
    name TEXT,
    target_sets INTEGER,
    target_reps TEXT,
    muscle_group TEXT,
    form_tips TEXT,
    youtube_query TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_number INTEGER,
    started_at TEXT,
    finished_at TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS logged_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER REFERENCES sessions(id),
    exercise_id INTEGER REFERENCES exercises(id),
    set_number INTEGER,
    weight_lbs REAL,
    reps INTEGER,
    completed INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS daily_nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE,
    calories INTEGER,
    protein_g INTEGER,
    carbs_g INTEGER,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

const seedExercises = [
  // Day 1: Push
  { id: 1, day_number: 1, name: 'Barbell Bench Press', target_sets: 4, target_reps: '8-10', muscle_group: 'Chest', form_tips: JSON.stringify(['Retract your shoulder blades and keep them pinched together', 'Drive your feet into the floor for a stable base', 'Lower the bar to mid-chest with elbows at ~75°', 'Press explosively, fully locking out at the top']), youtube_query: 'barbell bench press proper form tutorial' },
  { id: 2, day_number: 1, name: 'Dumbbell Shoulder Press', target_sets: 3, target_reps: '10-12', muscle_group: 'Shoulders', form_tips: JSON.stringify(['Start with dumbbells at ear level, palms forward', 'Press straight up without flaring elbows excessively', 'Keep core braced and lower back neutral', 'Lower slowly for a 2-count on the way down']), youtube_query: 'dumbbell shoulder press form tutorial' },
  { id: 3, day_number: 1, name: 'Incline DB Press', target_sets: 3, target_reps: '10-12', muscle_group: 'Upper Chest', form_tips: JSON.stringify(['Set bench to 30-45° incline', 'Lead with your chest, not your shoulders', 'Touch dumbbells at the top of each rep', 'Control the descent — 2 seconds down']), youtube_query: 'incline dumbbell press form tutorial' },
  { id: 4, day_number: 1, name: 'Cable Lateral Raises', target_sets: 3, target_reps: '12-15', muscle_group: 'Side Delts', form_tips: JSON.stringify(['Pull cable across your body from hip to shoulder height', 'Lead with your elbow, not your wrist', 'Keep a slight bend in the elbow throughout', 'Pause 1 second at peak contraction']), youtube_query: 'cable lateral raises form technique' },
  { id: 5, day_number: 1, name: 'Tricep Rope Pushdown', target_sets: 3, target_reps: '12-15', muscle_group: 'Triceps', form_tips: JSON.stringify(['Keep elbows pinned to your sides throughout', 'Spread the rope apart at full extension for peak contraction', 'Do not swing or use momentum', 'Control the rope back up slowly']), youtube_query: 'tricep rope pushdown form tutorial' },

  // Day 2: Soccer
  { id: 6, day_number: 2, name: 'Soccer Practice', target_sets: 1, target_reps: 'Active', muscle_group: 'Full Body', form_tips: JSON.stringify(['Stay hydrated — drink water every 15-20 minutes', 'Warm up with dynamic stretching before play', 'Cool down with light jogging and static stretches after', 'Log effort level and any soreness in notes']), youtube_query: 'soccer warm up routine for players' },

  // Day 3: Pull
  { id: 7, day_number: 3, name: 'Lat Pulldown', target_sets: 4, target_reps: '8-10', muscle_group: 'Lats', form_tips: JSON.stringify(['Use a pronated grip slightly wider than shoulders', 'Pull the bar to your upper chest, not behind your neck', 'Drive elbows down and back — think "elbows to pockets"', 'Fully extend arms at the top for a lat stretch']), youtube_query: 'lat pulldown proper form tutorial' },
  { id: 8, day_number: 3, name: 'Seated Cable Row', target_sets: 3, target_reps: '10-12', muscle_group: 'Mid Back', form_tips: JSON.stringify(['Keep chest tall and do not round your lower back', 'Pull handle to your belly button, not chest', 'Squeeze shoulder blades together at peak contraction', 'Lean slightly forward on the stretch, not the pull']), youtube_query: 'seated cable row form technique' },
  { id: 9, day_number: 3, name: 'Single-Arm DB Row', target_sets: 3, target_reps: '10-12', muscle_group: 'Lats', form_tips: JSON.stringify(['Place one knee and hand on bench for support', 'Pull dumbbell to hip, not shoulder', 'Let your shoulder drop on the stretch phase', 'Keep your torso parallel to the floor']), youtube_query: 'single arm dumbbell row form tutorial' },
  { id: 10, day_number: 3, name: 'Face Pulls', target_sets: 3, target_reps: '15-20', muscle_group: 'Rear Delts', form_tips: JSON.stringify(['Set cable at face height with rope attachment', 'Pull rope to forehead, elbows flared wide', 'External rotate at the end — "double bicep" position', 'Use lighter weight — control and feel the rear delt']), youtube_query: 'face pulls form tutorial rear delts' },
  { id: 11, day_number: 3, name: 'Bicep Curls', target_sets: 3, target_reps: '10-12', muscle_group: 'Biceps', form_tips: JSON.stringify(['Keep elbows glued to your sides — do not swing', 'Supinate (twist) your wrist as you curl up', 'Full range of motion — extend completely at bottom', 'Squeeze hard at the top for a full second']), youtube_query: 'barbell bicep curl proper form' },

  // Day 4: Rest
  { id: 12, day_number: 4, name: 'Mobility Flow', target_sets: 1, target_reps: 'Active', muscle_group: 'Full Body', form_tips: JSON.stringify(['Focus on hip flexors, hamstrings, and thoracic spine', 'Try yoga sun salutations or foam rolling', 'Spend at least 5 minutes on hip mobility', 'Light walking is beneficial on rest days']), youtube_query: 'full body mobility routine for athletes' },

  // Day 5: Legs
  { id: 13, day_number: 5, name: 'Goblet Squat', target_sets: 4, target_reps: '10-12', muscle_group: 'Quads/Glutes', form_tips: JSON.stringify(['Hold dumbbell or kettlebell close to your chest', 'Feet shoulder-width, toes slightly out', 'Push knees out over toes — do not let them cave', 'Sit deep — thighs parallel or below parallel']), youtube_query: 'goblet squat form tutorial beginner' },
  { id: 14, day_number: 5, name: 'Romanian Deadlift', target_sets: 3, target_reps: '10-12', muscle_group: 'Hamstrings', form_tips: JSON.stringify(['Hinge at the hips — push your butt back, not down', 'Keep bar close to your legs the entire way', 'Feel a deep stretch in hamstrings at the bottom', 'Squeeze glutes hard to drive hips forward at top']), youtube_query: 'romanian deadlift proper form tutorial' },
  { id: 15, day_number: 5, name: 'Leg Press', target_sets: 3, target_reps: '12-15', muscle_group: 'Quads', form_tips: JSON.stringify(['Feet shoulder-width on the platform', 'Do not lock out knees at the top of the rep', 'Lower slowly — control the weight with your quads', 'Keep lower back pressed into the seat throughout']), youtube_query: 'leg press machine proper form technique' },
  { id: 16, day_number: 5, name: 'Walking Lunges', target_sets: 3, target_reps: '12 each', muscle_group: 'Quads/Glutes', form_tips: JSON.stringify(['Step forward with a long stride', 'Drop back knee toward floor — do not bang it', 'Keep torso upright — do not lean forward', 'Drive through front heel to rise and step through']), youtube_query: 'walking lunges proper form technique' },
  { id: 17, day_number: 5, name: 'Calf Raises', target_sets: 4, target_reps: '15-20', muscle_group: 'Calves', form_tips: JSON.stringify(['Use full range of motion — deep stretch at bottom', 'Rise on the balls of your feet for full contraction', 'Hold the top position for 1-2 seconds', 'Do both single-leg and double-leg variations']), youtube_query: 'calf raises form standing machine' },

  // Day 6: Soccer
  { id: 18, day_number: 6, name: 'Soccer Game', target_sets: 1, target_reps: 'Active', muscle_group: 'Full Body', form_tips: JSON.stringify(['Warm up 10 minutes before kickoff', 'Stay aggressive but protect yourself from injury', 'Fuel up with carbs 2-3 hours before game time', 'Log performance notes after the game']), youtube_query: 'soccer game day preparation routine' },

  // Day 7: Core
  { id: 19, day_number: 7, name: 'Plank', target_sets: 3, target_reps: '45-60s', muscle_group: 'Core', form_tips: JSON.stringify(['Form a straight line from head to heels', 'Brace your core as if taking a punch', 'Do not let your hips sag or pike up', 'Breathe steadily — do not hold your breath']), youtube_query: 'plank proper form core exercise' },
  { id: 20, day_number: 7, name: 'Dead Bug', target_sets: 3, target_reps: '10 each side', muscle_group: 'Core', form_tips: JSON.stringify(['Press lower back firmly into the floor throughout', 'Extend opposite arm and leg simultaneously', 'Move slowly — 3 seconds per rep', 'Exhale as you extend, inhale as you return']), youtube_query: 'dead bug exercise form tutorial' },
  { id: 21, day_number: 7, name: 'Cable Woodchops', target_sets: 3, target_reps: '12 each side', muscle_group: 'Obliques', form_tips: JSON.stringify(['Pivot your back foot as you rotate', 'Keep arms mostly straight throughout the movement', 'Control the return — do not let cable pull you', 'Feel the obliques working on the pulling side']), youtube_query: 'cable woodchop exercise form obliques' },
  { id: 22, day_number: 7, name: 'Pull-ups', target_sets: 3, target_reps: 'Max reps', muscle_group: 'Lats/Core', form_tips: JSON.stringify(['Start from a dead hang — full arm extension', 'Drive elbows down to pull chest to bar', 'Cross feet and brace core to prevent swinging', 'Lower yourself slowly — 3 second descent']), youtube_query: 'pull up proper form beginner tutorial' },
];

const defaultSettings = [
  { key: 'rest_timer_seconds', value: '60' },
  { key: 'bodyweight_lbs', value: '125' },
];

function seed() {
  const count = db.prepare('SELECT COUNT(*) as c FROM exercises').get();
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO exercises (id, day_number, name, target_sets, target_reps, muscle_group, form_tips, youtube_query)
      VALUES (@id, @day_number, @name, @target_sets, @target_reps, @muscle_group, @form_tips, @youtube_query)
    `);
    const insertAll = db.transaction((exercises) => {
      for (const ex of exercises) insert.run(ex);
    });
    insertAll(seedExercises);
  }

  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (settingsCount.c === 0) {
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    for (const s of defaultSettings) insertSetting.run(s.key, s.value);
  }
}

seed();

export default db;
