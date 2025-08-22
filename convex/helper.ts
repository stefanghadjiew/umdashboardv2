import { Team, Champion } from "./tables/interfaces";



export const updatedPicks = (currentTeam: Team[], email: string, champion: Champion, isFinalPick?: boolean) => {
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