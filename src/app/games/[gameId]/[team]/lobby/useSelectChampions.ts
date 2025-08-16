"use client";

import { IChampion } from "app/intefaces";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams } from "next/navigation";
import { useSession } from "@lib/auth-client";
import { Id } from "@convex/_generated/dataModel";

export const useSelectChampions = () => {
    const { gameId, team } = useParams();
    const typedGameId = gameId as Id<'games'>;
    const typedTeam = team as 'team1' | 'team2';
    const { data } = useSession();
    const currentTeamChampions = useQuery(api.queries.getTeamChampions, { gameId: typedGameId, team: typedTeam })
    const pickChampions = useMutation(api.mutations.pickChampions);
    const ownPicks = currentTeamChampions?.filter((picks) => picks.player === data?.user.email)[0];
    const teamMatePicks = currentTeamChampions?.filter((picks) => picks.player !== data?.user.email)[0];

    const handleSelectChampion = async (champion: IChampion) => {
        try {
            await pickChampions({ gameId: typedGameId, team: typedTeam, email: data?.user.email ?? '', champion })
        }catch (err: any) {
            throw new Error('There was an issue picking champions:', err)
        }
    }

    return { picks: { ownPicks, teamMatePicks }, handleSelectChampion};
}