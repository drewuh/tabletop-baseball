import { Router, Request, Response } from 'express';
import {
  getAllTeams, getTeamById, getRoster,
  createTeam, updateTeam, deleteTeam, teamHasGames,
  bulkCreatePlayers,
  type TeamCreateInput, type PlayerCreateInput,
} from '../models/team';
import { getAllTeamRecords } from '../models/stats';
import { USE_MOCK, GENERATION_MODEL } from '../config/generationPrompt';
import db from '../db/client';
import { buildMockRoster } from '../services/mockRoster';

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

// Alias used by editor
teamsRouter.get('/:id/players', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  res.json(getRoster(req.params.id));
});

// ── Editor CRUD ───────────────────────────────────────────────────────────────

function isValidHex(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

teamsRouter.post('/', (req: Request, res: Response) => {
  const { city, name, abbreviation, primary_color, secondary_color } = req.body as Partial<TeamCreateInput>;
  if (!city || !name || !abbreviation || !primary_color || !secondary_color) {
    res.status(400).json({ error: 'Missing required fields: city, name, abbreviation, primary_color, secondary_color' });
    return;
  }
  if (abbreviation.replace(/[^a-zA-Z]/g, '').length !== 3) {
    res.status(400).json({ error: 'Abbreviation must be exactly 3 letters' });
    return;
  }
  if (!isValidHex(primary_color) || !isValidHex(secondary_color)) {
    res.status(400).json({ error: 'Colors must be valid 6-digit hex values (e.g. #1a2b3c)' });
    return;
  }
  const team = createTeam({ city, name, abbreviation, primary_color, secondary_color });
  res.status(201).json(team);
});

teamsRouter.put('/:id', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  const input = req.body as Partial<TeamCreateInput>;
  if (input.abbreviation && input.abbreviation.replace(/[^a-zA-Z]/g, '').length !== 3) {
    res.status(400).json({ error: 'Abbreviation must be exactly 3 letters' });
    return;
  }
  if (input.primary_color && !isValidHex(input.primary_color)) {
    res.status(400).json({ error: 'primary_color must be a valid 6-digit hex value' });
    return;
  }
  if (input.secondary_color && !isValidHex(input.secondary_color)) {
    res.status(400).json({ error: 'secondary_color must be a valid 6-digit hex value' });
    return;
  }
  const updated = updateTeam(req.params.id, input);
  res.json(updated);
});

teamsRouter.delete('/:id', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  if (teamHasGames(req.params.id)) {
    res.status(409).json({ error: 'Cannot delete a team that has played games.' });
    return;
  }
  deleteTeam(req.params.id);
  res.status(204).send();
});

// POST /api/teams/:id/bulk-players — atomic roster replacement
teamsRouter.post('/:id/bulk-players', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  const players = req.body as PlayerCreateInput[];
  if (!Array.isArray(players) || players.length === 0) {
    res.status(400).json({ error: 'Body must be a non-empty array of players' });
    return;
  }
  try {
    bulkCreatePlayers(req.params.id, players);
    res.status(201).json({ count: players.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write players', detail: String(err) });
  }
});

// POST /api/teams/:id/generate-roster — F3 AI generation (mock)
teamsRouter.post('/:id/generate-roster', (req: Request, res: Response) => {
  const team = getTeamById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  if (!USE_MOCK) {
    // Real API path — swap in Anthropic SDK call here when ready.
    res.status(501).json({ error: 'Live generation not yet implemented' });
    return;
  }
  // Log mock usage
  db.prepare(
    `INSERT INTO api_usage (model, prompt_tokens, completion_tokens, is_mock) VALUES (?, ?, ?, 1)`
  ).run(GENERATION_MODEL, 312, 890);

  const players = buildMockRoster(team.abbreviation, team.city, team.name)
    .map(p => ({ ...p, team_id: team.id }));
  res.json({ players, isSimulated: true });
});
