import { Router, Request, Response } from 'express';
import { getBattingLeaders, getPitchingLeaders } from '../models/stats';

export const statsRouter = Router();

// GET /api/stats/batting
statsRouter.get('/batting', (_req: Request, res: Response) => {
  res.json(getBattingLeaders());
});

// GET /api/stats/pitching
statsRouter.get('/pitching', (_req: Request, res: Response) => {
  res.json(getPitchingLeaders());
});
