import { DATABASE_TABLES } from "./constants";
import { query } from './_generated/server';
import { GAME_STATUS } from "./tables/games";
import { v } from "convex/values";

export const getTeamChampions = query({
  args: { gameId: v.id('games'), team: v.union(v.literal('team1'), v.literal('team2'))},
  handler: async (ctx, { gameId, team }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found !');
    }
    const currentTeam = currentGame[team];
    return currentTeam;
  }
})

export const getChampionsPool = query({
    args: {gameId: v.id('games')},
    handler: async (ctx, { gameId }) => {
      const currentGame = await ctx.db.get(gameId);
      return { championPool : currentGame?.championPool, createdBy: currentGame?.createdBy };
    }
})

export const getGame = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game does not exist !')
    }
    return currentGame;
  }
})

export const getAllGames = query({
    args: { status: v.optional(
        v.union(
            v.literal(GAME_STATUS.ACTIVE), 
            v.literal(GAME_STATUS.DONE), 
            v.literal(GAME_STATUS.FULL)
        )
    )},
    handler: async (ctx, args) => {
        let query = ctx.db.query(DATABASE_TABLES.GAMES);
        if(args.status) {
            query = query.filter((row) => row.eq(row.field('status'), args.status))
        }
        return await query.collect();
    }
})

/* export const getRandom25Champions = query({
  args: { count: v.optional(v.number()) }, // default will be 25
  handler: async (ctx, args) => {
    const champions = await ctx.db
      .query(DATABASE_TABLES.CHAMPIONS)
      .collect();

    // Fisher–Yates shuffle for randomness
    for (let i = champions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [champions[i], champions[j]] = [champions[j], champions[i]];
    }

    return champions.slice(0, args.count ?? 25);
  },
}); */