'use client';

import { api } from "@convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { ChampionCard } from "@components";
import { Button } from "@shadcn-components";
import { BackFromTeamButton } from "./BackFromTeamButton";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { useSession } from "@lib/auth-client";
import { IChampion } from "app/intefaces";
import { useSelectChampions } from "./useSelectChampions";

interface TeamPicks  {
    champions: IChampion[];
    player: string;
}

const readyButtonClasses = (ownPicks?: TeamPicks,shouldDisableReadyButton?: boolean) => {
    const disabledClasses = 'pointer-events-none opacity-50';
    const disabledState = !ownPicks?.champions || [0,1].includes(ownPicks?.champions.length) || shouldDisableReadyButton;
    return disabledState ? disabledClasses : '';
}

//TODO: Add functionality to Randomize ( the algorithm is in queries of convex )

export default function Lobby() {
    const { picks, handleSelectChampion, pickedChampionsClasses } = useSelectChampions({isFinalPick: false});
    const { ownPicks, teamMatePicks } = picks;
    const { data: userData } = useSession();
    const { gameId, team } = useParams();
    const router = useRouter();
    const typedTeam = team as 'team1' | 'team2';
    const gameIdTyped = gameId as Id<'games'>;
    const data = useQuery(api.queries.getChampionsPool,{gameId :gameIdTyped});
    const playersToRepick = useQuery(api.queries.getPlayersWhoShouldRepick, { gameId: gameIdTyped });
    const teamPicks = useQuery(api.queries.getTeamsPicksForRevealPhase, ({ gameId: gameIdTyped }));
    const currentTeamToRepick = playersToRepick?.[typedTeam];
    const shouldDisableReadyButton = 
        currentTeamToRepick?.map((player) => player?.player).includes(userData?.user.email) 
        || !(teamPicks?.team1?.length === 4 && teamPicks.team2?.length === 4);
    const patchChampionPool = useMutation(api.mutations.patchChampionPool);
    const isGameMaster = data?.createdBy === userData?.user.email;

    const renderChampions = data?.championPool?.map(
        (champion) => <ChampionCard 
                        className={pickedChampionsClasses(champion, ownPicks, teamMatePicks)} 
                        onClick={async () => await handleSelectChampion(champion)} 
                        key={champion._id} 
                        name={champion.name}/>
    );
    const renderTeammateChampions = teamMatePicks?.champions.map((champ) => 
        <span 
            className="relative flex items-center justify-center before:content-['\2192'] after:content-['\2190'] before:mr-2 after:ml-2 text-lg font-bold text-red-400" 
            key={champ._id}>
                {champ.name}
        </span>);
    const handleExcludeTiers = async () => {
        const excluded = data?.championPool?.filter((champion) => !['S+', 'D+'].includes(champion.tier));
        await patchChampionPool({gameId: gameIdTyped, champions: excluded ?? []});
    };

    const handleOnReadyClick = () => router.push(`/games/${gameId}/${team}/lobby/reveal`);

    return (
        <>
            <div className="flex mt-20 mb-2 w-[325px] justify-between flex-col items-center min-w-[73.5px]">
                <span className="font-bold text-xl items-center">Teammate picks:</span>
                {renderTeammateChampions}
            </div>
            <div className="w-full h-full overflow-auto grid grid-cols-[repeat(auto-fill,minmax(155px,155px))] gap-2 justify-center mb-2">
                {renderChampions}
            </div>
            <div className="w-full flex flex-col gap-2 max-w-[325px]">
                {isGameMaster && 
                    <div className="flex gap-2">
                        <Button className="flex-1/2 opacity-50 pointer-events-none">Randomize 25(in dev)</Button>
                        <Button className="flex-1/2" onClick={handleExcludeTiers}>Exclude S+/D+</Button>
                    </div>
                }
                <Button onClick={handleOnReadyClick} className={readyButtonClasses(ownPicks, shouldDisableReadyButton)}>Ready</Button>
                <BackFromTeamButton />
            </div>
        </>
    )
}