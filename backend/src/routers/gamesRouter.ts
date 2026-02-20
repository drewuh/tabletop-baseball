import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import {
  createGame,
  getGameById,
  updateGameState,
  upsertInningScore,
  addLogEntry,
  getInningScores,
  getGameLog,
} from '../models/game';
import {
  getTeamById,
  getStartingPitcher,
  getLineup,
  getPlayerById,
} from '../models/team';
import { resolveAtBat, BaseRunners } from '../services/gameEngine';

export const gamesRouter = Router();

// POST /api/games — create a new game
gamesRouter.post('/', (req: Request, res: Response) => {
  const { playerTeamId, cpuTeamId } = req.body as {
    playerTeamId?: string;
    cpuTeamId?: string;
  };

  if (!playerTeamId || !cpuTeamId) {
    res.status(400).json({ error: 'playerTeamId and cpuTeamId are required' });
    return;
  }

  const playerTeam = getTeamById(playerTeamId);
  const cpuTeam = getTeamById(cpuTeamId);

  if (!playerTeam || !cpuTeam) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  // Player is home team, CPU is away
  const homePitcher = getStartingPitcher(playerTeamId);
  const awayPitcher = getStartingPitcher(cpuTeamId);

  if (!homePitcher || !awayPitcher) {
    res.status(500).json({ error: 'Starting pitcher not found for one or both teams' });
    return;
  }

  const gameId = randomUUID();
  createGame({
    id: gameId,
    homeTeamId: playerTeamId,
    awayTeamId: cpuTeamId,
    playerTeamId,
    homePitcherId: homePitcher.id,
    awayPitcherId: awayPitcher.id,
  });

  res.status(201).json({ gameId });
});

// GET /api/games/:id/state — full game state
gamesRouter.get('/:id/state', (req: Request, res: Response) => {
  const game = getGameById(req.params.id);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }

  const homeTeam = getTeamById(game.home_team_id);
  const awayTeam = getTeamById(game.away_team_id);
  const homeLineup = getLineup(game.home_team_id);
  const awayLineup = getLineup(game.away_team_id);
  const homePitcher = getPlayerById(game.home_pitcher_id);
  const awayPitcher = getPlayerById(game.away_pitcher_id);
  const scores = getInningScores(game.id);
  const log = getGameLog(game.id);

  res.json({
    id: game.id,
    phase: game.phase,
    currentInning: game.current_inning,
    isTopInning: game.is_top_inning === 1,
    outs: game.outs,
    baseRunners: {
      first: game.runner_on_first === 1,
      second: game.runner_on_second === 1,
      third: game.runner_on_third === 1,
    },
    homeTeam: { ...homeTeam, currentPitcher: homePitcher },
    awayTeam: { ...awayTeam, currentPitcher: awayPitcher },
    homeLineup,
    awayLineup,
    homeBatterIndex: game.home_batter_index,
    awayBatterIndex: game.away_batter_index,
    innings: scores,
    log,
  });
});

// POST /api/games/:id/atbat — resolve one at-bat
gamesRouter.post('/:id/atbat', (req: Request, res: Response) => {
  const game = getGameById(req.params.id);
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  if (game.phase !== 'active') {
    res.status(400).json({ error: 'Game is not active' });
    return;
  }

  const isTop = game.is_top_inning === 1;

  // Batting team is away when top inning, home when bottom
  const battingTeamId = isTop ? game.away_team_id : game.home_team_id;
  const fieldingTeamId = isTop ? game.home_team_id : game.away_team_id;
  const batterIndex = isTop ? game.away_batter_index : game.home_batter_index;
  const pitcherId = isTop ? game.home_pitcher_id : game.away_pitcher_id;

  const lineup = getLineup(battingTeamId);
  const batter = lineup[batterIndex % lineup.length];
  const pitcher = getPlayerById(pitcherId);

  if (!batter || !pitcher) {
    res.status(500).json({ error: 'Could not load batter or pitcher' });
    return;
  }

  const baseRunners: BaseRunners = {
    first: game.runner_on_first === 1,
    second: game.runner_on_second === 1,
    third: game.runner_on_third === 1,
  };

  const outcome = resolveAtBat(
    {
      batterId: batter.id,
      pitcherId: pitcher.id,
      baseRunners,
      outs: game.outs,
    },
    batter.name,
    pitcher.name
  );

  // Update batter index
  const newBatterIndex = (batterIndex + 1) % lineup.length;

  // Update inning score
  if (outcome.runsScored > 0 || outcome.isHit) {
    upsertInningScore(
      game.id,
      game.current_inning,
      isTop,
      outcome.runsScored,
      outcome.isHit ? 1 : 0
    );
  }

  // Add play to log
  const entryType = outcome.isHit
    ? 'hit'
    : outcome.play.type === 'WALK'
    ? 'walk'
    : 'out';
  addLogEntry(game.id, game.current_inning, isTop, entryType, outcome.play.description);

  if (outcome.runsScored > 0) {
    const teamName = getTeamById(battingTeamId)?.abbreviation ?? '';
    addLogEntry(
      game.id,
      game.current_inning,
      isTop,
      'run',
      `${outcome.runsScored} run(s) score for ${teamName}.`
    );
  }

  let newOuts = game.outs + outcome.outsRecorded;
  let newInning = game.current_inning;
  let newIsTop = isTop;
  let newRunners = outcome.newBaseRunners;
  let phase = game.phase;

  // Half-inning over
  if (newOuts >= 3) {
    newOuts = 0;
    newRunners = { first: false, second: false, third: false };

    if (isTop) {
      newIsTop = false;
    } else {
      newIsTop = true;
      newInning++;
    }

    // Check for walk-off or game end
    const scores = getInningScores(game.id);
    const homeRuns = scores.filter(s => s.is_top === 0).reduce((a, s) => a + s.runs, 0);
    const awayRuns = scores.filter(s => s.is_top === 1).reduce((a, s) => a + s.runs, 0);

    const gameOver =
      (newInning > 9 && newIsTop && homeRuns !== awayRuns) || // Game ended cleanly after 9
      (newInning >= 9 && !newIsTop && homeRuns > awayRuns);   // Walk-off

    if (gameOver) {
      phase = 'complete';
      addLogEntry(game.id, game.current_inning, isTop, 'info', 'Game over.');
    } else {
      const label = newIsTop
        ? `--- Top of the ${newInning}${ordinal(newInning)} ---`
        : `--- Bottom of the ${newInning}${ordinal(newInning)} ---`;
      addLogEntry(game.id, newInning, newIsTop, 'inning', label);
    }
  }

  // Persist state
  updateGameState(game.id, {
    currentInning: newInning,
    isTopInning: newIsTop,
    outs: newOuts,
    runners: newRunners,
    ...(isTop
      ? { awayBatterIndex: newBatterIndex }
      : { homeBatterIndex: newBatterIndex }),
    phase,
  });

  res.json({
    roll: outcome.roll,
    play: outcome.play,
    runsScored: outcome.runsScored,
    outsRecorded: outcome.outsRecorded,
    newOuts,
    newBaseRunners: newRunners,
    currentInning: newInning,
    isTopInning: newIsTop,
    phase,
  });
});

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}
