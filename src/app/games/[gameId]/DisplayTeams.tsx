'use client';

import { Id } from "@convex/_generated/dataModel";
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Vs } from "@components";
import { JSX } from "react";

const displayTeam = (teamIndex: number, team?: JSX.Element[]) => (
    <div className="flex flex-col text-center gap-2 min-h-[101.5px]">
        <h1 className="text-3xl font-bold">{`Team ${teamIndex} Players`}</h1>
        {team}
    </div>
)

export const DisplayTeams = ({ gameId } : {gameId: Id<'games'>}) => {
    const teams = useQuery(api.queries.getPlayersPerTeam, { gameId });
    const renderTeam1Players = teams?.team1?.map((player) => <p className='text-2xl' key={player}>{player}</p>);
    const renderTeam2Players = teams?.team2?.map((player) => <p className='text-2xl' key={player}>{player}</p>);
    

    return (
        <div className="flex flex-col gap-6">
            {displayTeam(1,renderTeam1Players)}
            <Vs />
            {displayTeam(2,renderTeam2Players)}
        </div>
    )
}