import { Id } from "./_generated/dataModel";
import { Team, Champion } from "./tables/interfaces";

export const filterBannedChampionsFromTeam = (bannedChampions:Champion[],teamPicks?:Champion[]) => {
  const bannedChampionsSetOfIds = new Set(bannedChampions.map((champ) => champ._id));
  return teamPicks?.filter((champ) => !bannedChampionsSetOfIds.has(champ._id));
};


export const getPlayersWhoNeedRepick = (team: {player: string, champions: Champion[]}[], bannedChampions: Champion[] ) => {
  const bannedChampionsIds = new Set(bannedChampions.map((champ) => champ._id));
  const playersNeedingRePick = team
    .map((team: any) => {
      // count how many of their champions are banned
      const bannedCount = team.champions.filter((c: any) =>
        bannedChampionsIds.has(c._id)
      ).length;

      const remaining = team.champions.filter(
        (c: any) => !bannedChampionsIds.has(c._id)
      );

      if (bannedCount > 0) {
        return {
          player: team.player,
          numberOfPicks: bannedCount, // 1 or 2
          remainingChampions: remaining
        };
      }
      return null;
    })
    .filter(Boolean);
  
    return playersNeedingRePick;
}



export const updatedPicks = (
    currentTeam: Team[], 
    email: string, 
    champion: Champion, 
    isFinalPick?: boolean, 
    bannedChampionsSet?: Set<Id<"champions">>
  ) => {
     // Find current player picks
    const existingPlayerIndex = currentTeam.findIndex(p => p.player === email);
    const teammatePicks = currentTeam
    .filter(p => p.player !== email)
    .flatMap(p => p.champions.map(c => c._id));

    let updatedTeam;

    if (existingPlayerIndex >= 0) {
      const existingPlayer = currentTeam[existingPlayerIndex];

      // Toggle champion: remove if exists, otherwise add
      const alreadyPicked = existingPlayer.champions.some(c => c._id === champion._id);
      let updatedChampions;
      if (alreadyPicked) {
        updatedChampions = existingPlayer.champions.filter(c => c._id !== champion._id);
      } else if(teammatePicks.includes(champion._id)) {
        return currentTeam;
      } else if(bannedChampionsSet?.size && !isFinalPick) {
        const remainingChampion = existingPlayer.champions.filter((champ) => !bannedChampionsSet.has(champ._id))[0];
        updatedChampions = [remainingChampion, champion];
      } else {
        updatedChampions = [...existingPlayer.champions, champion].slice(isFinalPick ? -1 : -2); // keep max 2
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

    return updatedTeam;
}