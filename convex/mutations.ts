import { mutation } from './_generated/server';
import { v } from "convex/values";
import { GAME_STATUS } from './tables/games';
import { DATABASE_TABLES } from './constants';
import { championSchema } from './tables/champions';

const newGame = {
    status: GAME_STATUS.ACTIVE,
    championPool: [],
    team1: [],
    team2: []
}

export const pickChampions = mutation({
  args: {
    gameId: v.id('games'),
    email: v.string(),
    team: v.union(v.literal('team1'), v.literal('team2')),
    champion: v.object(championSchema)
  },
  handler: async (ctx, { gameId, email, team, champion }) => {
    const currentGame = await ctx.db.get(gameId);
    if (!currentGame) {
      throw new Error('Game not found!');
    }

    const currentTeam = currentGame[team] ?? [];

    // Find current player picks
    const existingPlayerIndex = currentTeam.findIndex(p => p.player === email);

    let updatedTeam;

    if (existingPlayerIndex >= 0) {
      const existingPlayer = currentTeam[existingPlayerIndex];

      // Toggle champion: remove if exists, otherwise add
      const alreadyPicked = existingPlayer.champions.some(c => c._id === champion._id);
      let updatedChampions;
      if (alreadyPicked) {
        updatedChampions = existingPlayer.champions.filter(c => c._id !== champion._id);
      } else {
        updatedChampions = [...existingPlayer.champions, champion].slice(-2); // keep max 2
      }

      const updatedPlayer = { ...existingPlayer, champions: updatedChampions };

      updatedTeam = [
        ...currentTeam.slice(0, existingPlayerIndex),
        updatedPlayer,
        ...currentTeam.slice(existingPlayerIndex + 1)
      ];
    } else {
      // First pick for this player
      updatedTeam = [
        ...currentTeam,
        { player: email, champions: [champion] }
      ];
    }

    await ctx.db.patch(gameId, {
      [team]: updatedTeam
    });
  }
});

export const createNewGame = mutation({ 
    args: {email: v.string()},
    handler: async (ctx, { email }) => {
        const allChampions = await ctx.db.query(DATABASE_TABLES.CHAMPIONS).collect();
        const championPool = allChampions.map(({name, set, tier, _id}) => ({name,set, tier, _id }));
        const createdGame = await ctx.db.insert(DATABASE_TABLES.GAMES, {...newGame, createdBy: email, players: [email], championPool});
        return createdGame;
    }
})

export const patchChampionPool = mutation({
    args: { gameId:v.id('games') , champions: v.array(v.object(championSchema)) },
    handler: async (ctx, { gameId,champions }) => {
        await ctx.db.patch(gameId, {
            championPool: champions
        })
    }
})


//TODO: remove player picks from game
export const removePlayerFromTeam = mutation({
    args: {email: v.string(), gameId: v.id('games'), team: v.union(v.literal('team1'), v.literal('team2'))},
    handler: async (ctx, { email, gameId, team }) => {
        const currentGame = await ctx.db.get(gameId);
        if(!currentGame) {
            throw new Error('Game not found !')
        }
        const currentTeam = currentGame[team];
        const updatedTeam = currentTeam?.filter((member) => member.player !== email);
        await ctx.db.patch(gameId,{
            [team]: updatedTeam
        })
    }
})

//TODO: remove player picks from game
export const removePlayerFromGame = mutation({
    args: {email: v.string(), gameId: v.id('games')},
    handler: async (ctx, { email, gameId }) => {
        const currentGame = await ctx.db.get(gameId);
        if(!currentGame?.players?.includes(email)) {
            throw new Error('Player was not found in the game !')
        }
        // 2. Remove the player from the array
        const updatedPlayers = currentGame.players.filter(
        (playerEmail: string) => playerEmail !== email
        );
        // 3.Remove the player from teams
        const updatedTeam1 = currentGame.team1?.filter((member) => member.player !== email);
        const updatedTeam2 = currentGame.team2?.filter((member) => member.player !== email);

        // 4. Update the game in the database
        await ctx.db.patch(gameId, {
            players: updatedPlayers,
            team1: updatedTeam1,
            team2: updatedTeam2
        });  
        }
    })

export const addUserToGame = mutation({
    args: { email: v.string(), gameId: v.id('games') },
    handler: async (ctx, { email, gameId }) => {
        const currentGame = await ctx.db.get(gameId);
        const playersInGameArray = currentGame?.players || [];
        if(!currentGame) {
            throw new Error("Game not found !")
        }
        if(playersInGameArray.length >= 4) {
            throw new Error("Game is full !")
        }

        await ctx.db.patch(gameId , {
            players: [...playersInGameArray, email]
        })
    } 
})


export const addUserToTeam = mutation({
    args: { 
        email: v.string(), 
        gameId: v.id('games'), 
        team: v.union(v.literal('team1'),v.literal('team2')) 
    },
    handler: async (ctx, {email, gameId, team}) => {
        const currentGame = await ctx.db.get(gameId);
        const teamArray = currentGame?.[team] || [];
        const teamMembers = teamArray.map((t) => t.player);
        if (!currentGame) {
            throw new Error("Game not found !");
        }
        if(teamArray.length >= 2) {
            throw new Error(`Cannot add more than 2 players to ${team}`);
        }
        if (teamMembers.includes(email)) {
            throw new Error(`Player already in ${team}`);
        }

        await ctx.db.patch(gameId, {
        [team]: [...teamArray, email],
        });
    }
})