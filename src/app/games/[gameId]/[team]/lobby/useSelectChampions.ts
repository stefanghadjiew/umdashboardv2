"use client";

import { IChampion } from "app/intefaces";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";
import { useSession } from "@lib/auth-client";
import { Id } from "@convex/_generated/dataModel";

interface TeamPicks  {
    champions: IChampion[];
    player: string;
}

const pickedChampionsClasses = (champion: IChampion, ownPicks?: TeamPicks, teamMatePicks?: TeamPicks) => {
    if(ownPicks?.champions?.map((champion) => champion.name).includes(champion.name)) {
        return 'border-10 border-green-400 h-[200px] w-[155px]';
    }
    if(teamMatePicks?.champions?.map((champion) => champion.name).includes(champion.name)) {
        return 'border-10 border-red-400 h-[200px] w-[155px]';
    }
    return 'h-[200px] w-[155px]';
}

export const useSelectChampions = ({isFinalPick = false} : { isFinalPick: boolean }) => {
    const { gameId, team } = useParams();
    const typedGameId = gameId as Id<'games'>;
    const typedTeam = team as 'team1' | 'team2';
    const { data } = useSession();
    const query = isFinalPick ? api.queries.getFinalChampionsForTeam : api.queries.getTeamChampions;
    const mutation = isFinalPick ? api.mutations.pickFinalChampion : api.mutations.pickChampions;
    const currentTeamChampions = useQuery(query, { gameId: typedGameId, team: typedTeam })
    const pickChampions = useMutation(mutation);
    const ownPicks = currentTeamChampions?.filter((picks) => picks.player === data?.user.email)[0];
    const teamMatePicks = currentTeamChampions?.filter((picks) => picks.player !== data?.user.email)[0];
    const handleSelectChampion = async (champion: IChampion) => {
        try {
            await pickChampions({ gameId: typedGameId, team: typedTeam, email: data?.user.email ?? '', champion });
        }catch (err: any) {
            throw new Error('There was an issue picking champions:', err)
        }
    }

    return { picks: { ownPicks, teamMatePicks }, handleSelectChampion , pickedChampionsClasses};
}