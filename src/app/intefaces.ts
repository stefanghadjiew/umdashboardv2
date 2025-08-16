import { Id } from "@convex/_generated/dataModel";

interface IPlayerPicks {
    champions?: IChampion[];
    player: string;
}

export interface IChampion {
    _id: Id<'champions'>,
    name: string,
    set: string,
    tier: string,
}

export interface IGame {
    _id: Id<'games'>,
    players?: string[],
    status: 'FULL' | 'ACTIVE' | 'DONE',
    createdBy: string,
    championPool?: IChampion[],
    team1?: IPlayerPicks[];
    team2?: IPlayerPicks[];
}
