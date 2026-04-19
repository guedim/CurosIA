import { relations } from 'drizzle-orm/relations';
import {
  teams,
  matches,
  competitions,
  seasons,
  players,
  staff,
  matchEvents,
  playerSeasonStats,
  standings,
} from './schema';

export const matchesRelations = relations(matches, ({ one, many }) => ({
  team_awayTeamId: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: 'matches_awayTeamId_teams_id',
  }),
  competition: one(competitions, {
    fields: [matches.competitionId],
    references: [competitions.id],
  }),
  team_homeTeamId: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: 'matches_homeTeamId_teams_id',
  }),
  season: one(seasons, {
    fields: [matches.seasonId],
    references: [seasons.id],
  }),
  matchEvents: many(matchEvents),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  matches_awayTeamId: many(matches, {
    relationName: 'matches_awayTeamId_teams_id',
  }),
  matches_homeTeamId: many(matches, {
    relationName: 'matches_homeTeamId_teams_id',
  }),
  players: many(players),
  staff: many(staff),
  matchEvents: many(matchEvents),
  standings: many(standings),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  matches: many(matches),
  playerSeasonStats: many(playerSeasonStats),
  standings: many(standings),
}));

export const seasonsRelations = relations(seasons, ({ many }) => ({
  matches: many(matches),
  playerSeasonStats: many(playerSeasonStats),
  standings: many(standings),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  matchEvents: many(matchEvents),
  playerSeasonStats: many(playerSeasonStats),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  team: one(teams, {
    fields: [staff.teamId],
    references: [teams.id],
  }),
}));

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matches, {
    fields: [matchEvents.matchId],
    references: [matches.id],
  }),
  player: one(players, {
    fields: [matchEvents.playerId],
    references: [players.id],
  }),
  team: one(teams, {
    fields: [matchEvents.teamId],
    references: [teams.id],
  }),
}));

export const playerSeasonStatsRelations = relations(playerSeasonStats, ({ one }) => ({
  competition: one(competitions, {
    fields: [playerSeasonStats.competitionId],
    references: [competitions.id],
  }),
  player: one(players, {
    fields: [playerSeasonStats.playerId],
    references: [players.id],
  }),
  season: one(seasons, {
    fields: [playerSeasonStats.seasonId],
    references: [seasons.id],
  }),
}));

export const standingsRelations = relations(standings, ({ one }) => ({
  competition: one(competitions, {
    fields: [standings.competitionId],
    references: [competitions.id],
  }),
  season: one(seasons, {
    fields: [standings.seasonId],
    references: [seasons.id],
  }),
  team: one(teams, {
    fields: [standings.teamId],
    references: [teams.id],
  }),
}));
