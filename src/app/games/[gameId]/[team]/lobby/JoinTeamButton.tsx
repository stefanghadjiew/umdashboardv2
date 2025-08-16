"use client";

import { Button } from "@shadcn-components";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useSession } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { IChampion } from "app/intefaces";

interface IGame {
    team1?: string[];
    team2?: string[] ;
    players?: string[];
    status: "FULL" | "ACTIVE" | "DONE";
    createdBy: string;
    championPool?: IChampion[];
}

interface IJoinGameButton {
    team: 'team1' | 'team2';
    gameId: Id<"games">;
}

const shouldDisableTeamButton = ( team:IJoinGameButton['team'], currentGame?: IGame ,email?: string) => {
    if(currentGame) {
        if(!currentGame[team] || !email) {
            return false;
        }
        return currentGame[team]?.length >= 2 || currentGame[team]?.includes(email);
    }
}

export const JoinTeamButton = ({team, gameId} : IJoinGameButton) => {
    const { data } = useSession();
    const router = useRouter();
    const addPlayer = useMutation(api.mutations.addUserToTeam);
    const currentGame = useQuery(api.queries.getGame, { gameId });
    const btnText = `Join ${team}`;
    const shouldDisableButton = shouldDisableTeamButton(team,currentGame,data?.user.email);
    const handleAddPlayer = async () => {
        if(shouldDisableButton) {
            return;
        }
        addPlayer({team, email: data?.user.email ?? '', gameId });
        router.push(`/games/${gameId}/${team}/lobby`)
    }

    const buttonClassName = shouldDisableButton ? 'pointer-events-none opacity-50' : '';

    return (
        <Button className={buttonClassName} onClick={handleAddPlayer}>{btnText}</Button>
    )
}