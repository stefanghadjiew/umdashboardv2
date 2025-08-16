"use client";

import { useSession } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@shadcn-components";

export const NewGameButton = () => {
    const router = useRouter();
    const { data } = useSession();
    const createNewGame = useMutation(api.mutations.createNewGame);

    const handleCreateNewGame = async () => {
        const newGameId = await createNewGame({email: data?.user.email ?? ''});
        router.push(`/games/${newGameId}`)
    }

    return (
        <Button onClick={handleCreateNewGame}>New Game</Button>
    )
}