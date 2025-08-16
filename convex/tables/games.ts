import { defineTable } from "convex/server";
import { v } from "convex/values";
import { championSchema } from "./champions";

export const gameStatuses = v.union(
    v.literal('FULL'),
    v.literal('ACTIVE'),
    v.literal('DONE')
)

// A TS type for autocompletion
export type GameStatus = "FULL" | "ACTIVE" | "DONE";

// A constants object for code use
export const GAME_STATUS: Record<GameStatus, GameStatus> = {
  FULL: "FULL",
  ACTIVE: "ACTIVE",
  DONE: "DONE",
};


export const games = defineTable({
    status: gameStatuses,
    /* user: v.id("users"), */
    players: v.optional( v.array(v.string())),
    createdBy: v.string(),
    /* championPool: v.array(v.id('champions')), */
    championPool: v.optional(v.array(v.object(championSchema))),
    /* excludedTiers: v.array(v.string()), */ 
    /* team1: v.array(v.id('users')) */
    team1: v.optional(
      v.array(
        v.object({
          player: v.string(), // email or user identifier
          champions: v.array(v.object(championSchema)),
        })
      )
    ),
    team2: v.optional(
      v.array(
        v.object({
          player: v.string(),
          champions: v.array(v.object(championSchema)),
        })
      )
    ),
});