import { Id } from "@convex/_generated/dataModel";

export interface IChampion {
    _id: Id<'champions'>,
    name: string,
    set: string,
    tier: string,
}