import { Router, Request, Response } from 'express';
import { getAllTeams, getTeamById, getRoster } from '../models/team';
import { getAllTeamRecords } from '../models/stats';

export const teamsRouter = Router();

teamsRouter.get('/', (_req: Request, res: Response) => {
  const teams = getAllTeams();
  const records = getAllTeamRecords();
  const result = teams.map(team => ({
    ...team,
    wins:   records[team.id]?.wins   ?? 0,
    losses: records[team.id]?.losses ?? 0,
  }));
  res.json(result);
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
