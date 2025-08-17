'use client';

import { api } from "@convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { ChampionCard } from "@components";
import { Button } from "@shadcn-components";
import { BackFromTeamButton } from "./BackFromTeamButton";
import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { useSession } from "@lib/auth-client";
import { IChampion } from "app/intefaces";
import { useSelectChampions } from "./useSelectChampions";

interface TeamPicks  {
    champions: IChampion[];
    player: string;
}
const pickedChampionsClasses = (champion: IChampion, ownPicks?: TeamPicks, teamMatePicks?: TeamPicks) => {
    if(ownPicks?.champions?.map((champion) => champion.name).includes(champion.name)) {
        return 'border-10 border-green-400';
    }
    if(teamMatePicks?.champions?.map((champion) => champion.name).includes(champion.name)) {
        return 'border-10 border-red-400';
    }
    return '';
}

const readyButtonClasses = (ownPicks?: TeamPicks) => {
    if(!ownPicks?.champions) {
        return 'pointer-events-none opacity-50';
    }
    if([0,1].includes(ownPicks?.champions.length)) {
      return 'pointer-events-none opacity-50';  
    }
    return '';
}

export default function Lobby() {
    const { picks, handleSelectChampion } = useSelectChampions();
    const { ownPicks, teamMatePicks } = picks;
    const { data: userData } = useSession();
    const { gameId } = useParams();
    const gameIdTyped = gameId as Id<'games'>;
    const data = useQuery(api.queries.getChampionsPool,{gameId :gameIdTyped});
    const patchChampionPool = useMutation(api.mutations.patchChampionPool);
    const isGameMaster = data?.createdBy === userData?.user.email;

    const renderChampions = data?.championPool?.map((champion) => <ChampionCard className={pickedChampionsClasses(champion, ownPicks, teamMatePicks)} onClick={async () => await handleSelectChampion(champion)} key={champion._id} name={champion.name}/>);
    const renderTeammateChampions = teamMatePicks?.champions.map((champ) => <p className="text-xl font-bold" key={champ._id}>{champ.name}</p>);
    const handleExcludeTiers = async () => {
        const excluded = data?.championPool?.filter((champion) => !['S+', 'D+'].includes(champion.tier));
        await patchChampionPool({gameId: gameIdTyped, champions: excluded ?? []});
    };

    return (
        <>
            <h1 className="mt-20 mb-2 font-bold text-2xl">Teammate picks:</h1>
            <div className="mb-2 flex border-5 p-2 border-red-400 w-[320px] justify-between min-h-[48.5px]">
                {renderTeammateChampions}
            </div>
            <div className="w-full h-full overflow-auto grid grid-cols-[repeat(auto-fill,minmax(155px,155px))] gap-2 justify-center mb-2">
                {renderChampions}
            </div>
            <div className="w-full flex flex-col gap-2 max-w-[325px]">
                {isGameMaster && 
                    <div className="flex gap-2">
                        <Button className="flex-1/2">Randomize 25</Button>
                        <Button className="flex-1/2" onClick={handleExcludeTiers}>Exclude S+/D+</Button>
                    </div>
                }
                <Button className={readyButtonClasses(ownPicks)}>Ready</Button>
                <BackFromTeamButton />
            </div>
        </>
    )
}