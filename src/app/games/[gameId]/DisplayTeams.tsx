'use client';

import { Id } from "@convex/_generated/dataModel";
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Vs } from "@components";
import { JSX } from "react";

const displayTeam = (teamIndex: number, team?: JSX.Element[], showMembers?: boolean) => (
    <div className={`flex flex-col text-center gap-2 min-h-[101.5px] ${teamIndex === 1 ? `flex-col-reverse` : ''}`}>
        <h1 className="text-3xl font-bold">{`Team ${teamIndex} Players`}</h1>
        {showMembers && team}
    </div>
)

export const DisplayTeams = ({ gameId, showMembers = true } : {gameId: Id<'games'>, showMembers?: boolean}) => {
    const teams = useQuery(api.queries.getPlayersPerTeam, { gameId });
    const renderTeam1Players = teams?.team1?.map((player) => <p className='text-lg' key={player}>{player}</p>);
    const renderTeam2Players = teams?.team2?.map((player) => <p className='text-lg' key={player}>{player}</p>);
    

    return (
        <div className="flex flex-col">
            {displayTeam(1,renderTeam1Players,showMembers)}
            <Vs />
            {displayTeam(2,renderTeam2Players,showMembers)}
        </div>
    )
}