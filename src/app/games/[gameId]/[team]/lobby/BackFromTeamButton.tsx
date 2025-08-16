"use client";

import { Button } from "@shadcn-components";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useSession } from "@lib/auth-client";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export const BackFromTeamButton = () => {
    const { data } = useSession();
    const router = useRouter();
    const { gameId,team } = useParams();
    const removePlayerFromTeam = useMutation(api.mutations.removePlayerFromTeam);

    const handleOnClickBack = async () => {
        try {
            await removePlayerFromTeam({email: data?.user.email ?? '', gameId : gameId as Id<'games'>, team: team as 'team1' | 'team2'});
            router.back();
        } catch(err: any) {
            throw new Error('Error removing player from team :', err);
        }
    }
    return (
        <Button onClick={handleOnClickBack}>⬅ Back</Button>
    );
};