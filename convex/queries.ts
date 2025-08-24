import { DATABASE_TABLES } from "./constants";
import { query } from './_generated/server';
import { GAME_STATUS } from "./tables/games";
import { v } from "convex/values";
import { filterBannedChampionsFromTeam, getPlayersWhoNeedRepick } from "./helper";

export const getGameStatus = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    return { status: currentGame.status };
  }
})

export const getFinalPicksForStartGamePage = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    const team1Picks = currentGame.finalPicks?.team1?.map((player) => player.champions).flat();
    const team2Picks = currentGame.finalPicks?.team2?.map((player) => player.champions).flat();

    return { team1: team1Picks, team2: team2Picks };
  }
})

export const getFinalPicksForStartingGame = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    return [...currentGame.finalPicks?.team1 ?? [], ...currentGame.finalPicks?.team2 ?? []].flatMap((player) => player.champions).length;
  }
})


export const getFinalChampionsForTeam = query({
  args: {gameId: v.id('games'), team: v.union(v.literal('team1'), v.literal('team2'))},
  handler: async (ctx, { gameId, team }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    return currentGame.finalPicks?.[team]
  }
})

export const getPlayersWhoShouldRepick = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    const {team1, team2, bannedChampions} = currentGame;
    if(!bannedChampions?.length) {
      return { team1: [], team2: [] };
    }
    const team1Repicks = team1 ? getPlayersWhoNeedRepick(team1, bannedChampions) : [];
    const team2Repicks = team2 ? getPlayersWhoNeedRepick(team2, bannedChampions) : [];

    return { team1: team1Repicks, team2: team2Repicks };
  }
})

export const getGameMaster = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    if(!currentGame) {
      throw new Error('Game not found!')
    }
    return { gameMaster: currentGame.createdBy }
  }
})

export const getTeamsPicksForRevealPhase = query({
  args: { gameId: v.id('games') },
  handler: async(ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    const bannedChampions = currentGame?.bannedChampions;
    const team1Picks = currentGame?.team1?.map((obj) => obj.champions).flat();
    const team2Picks = currentGame?.team2?.map((obj) => obj.champions).flat();
    if(bannedChampions?.length) {
      return { 
        team1: filterBannedChampionsFromTeam(bannedChampions, team1Picks),
        team2:  filterBannedChampionsFromTeam(bannedChampions, team2Picks)
      }
    }
    return { team1: team1Picks, team2: team2Picks }
  }
})

export const getPlayersPerTeam = query({
  args: { gameId: v.id('games') },
  handler: async (ctx, { gameId }) => {
    const currentGame = await ctx.db.get(gameId);
    const team1Players = currentGame?.team1?.map((player) => player.player);
    const team2Players = currentGame?.team2?.map((player) => player.player);
    return { team1: team1Players, team2: team2Players };
  }
})

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

//TODO: Remove banned and already picked champions
export const getChampionsPool = query({
    args: {gameId: v.id('games')},
    handler: async (ctx, { gameId }) => {
      const currentGame = await ctx.db.get(gameId);
      if(! currentGame) {
        throw new Error('Game not found!')
      }
      const bannedChampionIds = new Set(currentGame.bannedChampions?.map((champ) => champ._id));
      const championPool =  currentGame?.championPool?.filter(o => !bannedChampionIds.has(o._id));
      return { championPool, createdBy: currentGame?.createdBy };
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