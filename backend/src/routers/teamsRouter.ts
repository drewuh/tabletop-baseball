import { Router, Request, Response } from 'express';
import { getAllTeams, getTeamById, getRoster } from '../models/team';

export const teamsRouter = Router();

teamsRouter.get('/', (_req: Request, res: Response) => {
  const teams = getAllTeams();
  res.json(teams);
});

teamsRouter.get('/:id', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  res.json(team);
});

teamsRouter.get('/:id/roster', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  const roster = getRoster(req.params.id);
  res.json(roster);
});
