"use client";

import { useEffect } from "react";
import { Button } from "@shadcn-components";
import { api } from "@convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@convex/_generated/dataModel";
import { ChampionCard } from "@components";
import { IChampion } from "app/intefaces";
import { DisplayTeams } from "../DisplayTeams";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@lib/auth-client";;

export default function GameStart() {
    const router = useRouter();
    const { data: userData } = useSession();
    const { gameId } = useParams();
    const typedGameId = gameId as Id<'games'>;
    const data =  useQuery(api.queries.getFinalPicksForStartGamePage, { gameId: typedGameId });
    const gameStatus = useQuery(api.queries.getGameStatus, { gameId: typedGameId });
    const gameMasterData = useQuery(api.queries.getGameMaster, { gameId: typedGameId });
    const endGame = useMutation(api.mutations.endGame);
    const isGameMaster = gameMasterData?.gameMaster === userData?.user.email;

    const renderTeamPicks = ( teamPicks?: IChampion[]) => teamPicks?.map((champ) => 
        <ChampionCard key={champ._id} name={champ.name} className="h-[100px] w-[70px]"/>
    );

    const handleEndGame = async () => {
        try {
            await endGame({gameId: typedGameId});
        } catch(err: any) {
            throw new Error('There was a problem ending game!')
        }
    };

    useEffect(() =>{
        if(gameStatus?.status === 'DONE') {
            router.push('/games');
        }
    },
    [gameStatus?.status, router]);

    return (
            <div className="w-full h-[calc(100dvh-63px)] mt-[63px] flex flex-col justify-between">
                <div className="flex flex-1 items-center justify-center flex-col">
                    <div className="flex gap-4">{renderTeamPicks(data?.team1)}</div>
                    <DisplayTeams gameId={typedGameId} showMembers={false}/>
                    <div className="flex gap-4">{renderTeamPicks(data?.team2)}</div>
                </div>
            <div className="w-full flex flex-col gap-2 mt-4">
                
                {
                    isGameMaster && <Button onClick={handleEndGame}>End Game</Button>
                }
            </div>
            </div>
        )
}