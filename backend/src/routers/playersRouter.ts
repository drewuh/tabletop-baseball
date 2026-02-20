import { Router, Request, Response } from 'express';
import { getPlayerCard } from '../models/team';

export const playersRouter = Router();

// GET /api/players/:id/card
playersRouter.get('/:id/card', (req: Request, res: Response) => {
  const card = getPlayerCard(req.params.id);
  if (!card) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  res.json(card);
});
