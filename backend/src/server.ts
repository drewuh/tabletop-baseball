import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initSchema } from './db/schema';
import db from './db/client';
import { seed } from './seeds/index';
import { teamsRouter } from './routers/teamsRouter';
import { gamesRouter } from './routers/gamesRouter';
import { playersRouter } from './routers/playersRouter';
import { statsRouter } from './routers/statsRouter';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT ?? 3001;

const allowedOrigin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Init DB schema on startup
initSchema();

// Auto-seed on first run (empty volume)
const { n } = db.prepare('SELECT COUNT(*) as n FROM teams').get() as { n: number };
if (n === 0) {
  console.log('Empty database — running seed…');
  seed();
}

app.use('/api/teams', teamsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/players', playersRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
