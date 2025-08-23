"use client";

import { useEffect } from "react";
import { ChampionCard } from "@components";
import { DisplayTeams } from "app/games/[gameId]/DisplayTeams";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { IChampion } from "app/intefaces";
import { Button } from "@shadcn-components";
import { useSession } from "@lib/auth-client";
import { useSelectChampions } from "../useSelectChampions";


const disabledClasses = 'pointer-events-none opacity-50';
const banDuplicatesButtonClasses = (isBanDuplicatesEnabled: boolean) => isBanDuplicatesEnabled ? '' : disabledClasses;

const startGameButtonClasses = (shouldStartGame: boolean) => shouldStartGame ? '' : disabledClasses;

export default function Reveal() {
    const { picks, handleSelectChampion, pickedChampionsClasses } = useSelectChampions({isFinalPick: true});
    const { ownPicks, teamMatePicks } = picks;
    const { data } = useSession();
    const { gameId, team } = useParams();
    const typedTeam = team as 'team1' | 'team2';
    const typedGameId = gameId as Id<'games'>;
    const router = useRouter();
    const teamsPicks = useQuery(api.queries.getTeamsPicksForRevealPhase, { gameId: typedGameId });
    const gameMasterData = useQuery(api.queries.getGameMaster, { gameId: typedGameId });
    const playersToRepick = useQuery(api.queries.getPlayersWhoShouldRepick, { gameId: typedGameId });
    const finalPicksForGameStart = useQuery(api.queries.getFinalPicksForStartingGame, { gameId: typedGameId });
    const currentTeam = playersToRepick?.[typedTeam];
    const shouldCurrentPlayerRepick = currentTeam?.map((player) => player?.player === data?.user.email)[0];
    
    const banDuplicateChampions = useMutation(api.mutations.bannDuplicateChampions);
    const ids1 = new Set(teamsPicks?.team1?.map(o => o._id));
    const isBanDuplicatesEnabled = teamsPicks?.team2?.some(o => ids1.has(o._id)) ?? false;
    const duplicatedChampions = teamsPicks?.team2?.filter((champ) => ids1.has(champ._id));
    const isGameMaster = gameMasterData?.gameMaster === data?.user.email;

    const handleGameStart = () => {
        router.push(`/games/${gameId}/start`);
    }

    const handleBanDuplicatedChampions = async () => {
        try {
            await banDuplicateChampions({gameId: typedGameId,champions :duplicatedChampions})
        } catch (err:any) {
            throw new Error('There was a problem banning champions:', err);
        }
    }

    const renderTeamPicks = ( team: 'team1' | 'team2',teamPicks?: IChampion[]) => teamPicks?.map((champ) => 
        <ChampionCard 
            className={`${pickedChampionsClasses(champ, ownPicks, teamMatePicks)} !h-[100px] !w-[70px]`} 
            key={champ._id} name={champ.name} 
            onClick={team === typedTeam ? async () => handleSelectChampion(champ) : () => {}}
        />
    );

    useEffect(() => {
        if(shouldCurrentPlayerRepick) {
            router.back()
        }

    }, [shouldCurrentPlayerRepick])
    
    return (
        <div className="w-full h-[calc(100dvh-63px)] mt-[63px] flex flex-col justify-between">
            <div className="flex flex-1 items-center justify-center flex-col">
                <div className="flex gap-4">{renderTeamPicks('team1',teamsPicks?.team1)}</div>
                <DisplayTeams gameId={gameId as Id<'games'>} showMembers={false}/>
                <div className="flex gap-4">{renderTeamPicks('team2',teamsPicks?.team2)}</div>
            </div>
        <div className="w-full flex flex-col gap-2 mt-4">
            { isGameMaster && 
                <Button className={banDuplicatesButtonClasses(isBanDuplicatesEnabled)} onClick={handleBanDuplicatedChampions}>
                    Ban Duplicates
                </Button> 
            }
            <Button className={startGameButtonClasses(finalPicksForGameStart === 4)} onClick={handleGameStart}>Start Game</Button>
        </div>
        </div>
    )
}