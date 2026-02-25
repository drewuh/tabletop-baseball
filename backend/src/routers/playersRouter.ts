import { Router, Request, Response } from 'express';
import {
  getPlayerById, getPlayerCard,
  createPlayer, updatePlayer, deletePlayer,
  type PlayerCreateInput,
} from '../models/team';

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

// GET /api/players/:id
playersRouter.get('/:id', (req: Request, res: Response) => {
  const player = getPlayerById(req.params.id);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const card = getPlayerCard(req.params.id);
  res.json({ ...player, card: card?.rows ?? [] });
});

// POST /api/players
playersRouter.post('/', (req: Request, res: Response) => {
  const input = req.body as PlayerCreateInput;
  if (!input.id || !input.team_id || !input.name || !input.position) {
    res.status(400).json({ error: 'Missing required fields: id, team_id, name, position' });
    return;
  }
  if (!Array.isArray(input.card) || input.card.length !== 36) {
    res.status(400).json({ error: 'card must be an array of exactly 36 cells' });
    return;
  }
  try {
    const player = createPlayer(input);
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create player', detail: String(err) });
  }
});

// PUT /api/players/:id
playersRouter.put('/:id', (req: Request, res: Response) => {
  const player = getPlayerById(req.params.id);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const input = req.body as Partial<Omit<PlayerCreateInput, 'id' | 'team_id'>>;
  if (input.card !== undefined && (!Array.isArray(input.card) || input.card.length !== 36)) {
    res.status(400).json({ error: 'card must be an array of exactly 36 cells' });
    return;
  }
  const updated = updatePlayer(req.params.id, input);
  res.json(updated);
});

// DELETE /api/players/:id
playersRouter.delete('/:id', (req: Request, res: Response) => {
  const player = getPlayerById(req.params.id);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  deletePlayer(req.params.id);
  res.status(204).send();
});
