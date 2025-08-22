import { Id } from "../_generated/dataModel";

export interface Champion {
    _id: Id<'champions'>;
    name: string;
    set: string;
    tier: string;
};

export interface Team {
    champions: {
        _id: Id<"champions">;
        name: string;
        set: string;
        tier: string;
    }[];
    player: string;
};

export interface Game {
  status: 'FULL' | 'ACTIVE' | 'DONE';
  players?: string[];
  createdBy: string;
  championPool?: Champion[];
  bannedChampions? : Champion[];
  team1?: {
    player: string;
    champions: Champion[];
  }[];
  team2?: {
    player: string;
    champions: Champion[];
  }[];
}