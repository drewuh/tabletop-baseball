import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initSchema } from './db/schema';
import { teamsRouter } from './routers/teamsRouter';
import { gamesRouter } from './routers/gamesRouter';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// Init DB schema on startup
initSchema();

app.use('/api/teams', teamsRouter);
app.use('/api/games', gamesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
