import db from '../db/client';
import { initSchema } from '../db/schema';
import { teams } from './teams';
import { players } from './players';
import { buildBatterCard, buildPitcherCard } from './cards';

export function seed(): void {
  initSchema();

  const insertTeam = db.prepare(`
    INSERT OR REPLACE INTO teams (id, city, name, abbreviation, primary_color, secondary_color)
    VALUES (@id, @city, @name, @abbreviation, @primary_color, @secondary_color)
  `);

  const insertPlayer = db.prepare(`
    INSERT OR REPLACE INTO players (id, team_id, name, position, batting_order, is_pitcher)
    VALUES (@id, @team_id, @name, @position, @batting_order, @is_pitcher)
  `);

  const insertBatterRow = db.prepare(`
    INSERT OR REPLACE INTO batter_cards (player_id, col, row, result)
    VALUES (@player_id, @col, @row, @result)
  `);

  const insertPitcherRow = db.prepare(`
    INSERT OR REPLACE INTO pitcher_cards (player_id, col, row, result)
    VALUES (@player_id, @col, @row, @result)
  `);

  const runAll = db.transaction(() => {
    for (const team of teams) {
      insertTeam.run(team);
    }

    for (const player of players) {
      insertPlayer.run({
        id: player.id,
        team_id: player.team_id,
        name: player.name,
        position: player.position,
        batting_order: player.batting_order,
        is_pitcher: player.is_pitcher ? 1 : 0,
      });

      if (!player.is_pitcher && player.batter_profile) {
        const rows = buildBatterCard(player.batter_profile);
        for (const row of rows) {
          insertBatterRow.run({ player_id: player.id, col: row.col, row: row.row, result: row.result });
        }
      }

      if (player.is_pitcher && player.pitcher_profile) {
        const rows = buildPitcherCard(player.pitcher_profile);
        for (const row of rows) {
          insertPitcherRow.run({ player_id: player.id, col: row.col, row: row.row, result: row.result });
        }
      }
    }
  });

  runAll();
  console.log('Seed complete.');
}

if (require.main === module) {
  seed();
}
