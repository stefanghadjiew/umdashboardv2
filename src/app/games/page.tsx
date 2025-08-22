'use client';

import { Button } from "@shadcn-components";
import { Logo } from "@components";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { GameStatus, GAME_STATUS } from "@convex/tables/games";
import { useSession } from "@lib/auth-client";
import { Id } from "@convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { NewGameButton } from "./NewGameButton";

const mapGameStatusToColor = (gameStatus: GameStatus) => {
  switch(gameStatus) {
    case GAME_STATUS.ACTIVE:
      return 'text-green-300';
    case GAME_STATUS.FULL:
      return 'text-yellow-600';
    case GAME_STATUS.DONE:
      return 'text-red-400';
    default: 
      return '';
  }
}

const inactiveGameClasses = (gameStatus: GameStatus) => [GAME_STATUS.DONE, GAME_STATUS.FULL].includes(gameStatus) ? 'opacity-50 pointer-events-none' : ''

export default function Board() {
    const router = useRouter();
    const games = useQuery(api.queries.getAllGames, {});
    const joinPlayerToGame = useMutation(api.mutations.addUserToGame);
    const { data } = useSession();

    const handleJoinPlayerToGame = async (gameId: Id<'games'>) => {
      try {
        await joinPlayerToGame({gameId, email: data?.user.email ?? ''});
        router.push(`/games/${gameId}`)
      } catch(err: any) {
        throw new Error('Failed to add player to game:', err);
      }
    }

    const renderGames = games?.map((game) => <div className="flex gap-4 items-center justify-between border-b border-b-gray-400 rounded-b-sm p-1" key={game._id}>
      <Button onClick={() => handleJoinPlayerToGame(game._id)} className={`font-bold text-black bg-inherit flex-1 justify-start ${inactiveGameClasses(game.status)}`}>{`Join ${game.createdBy}'s Game`}</Button>
      <pre className="text-sm font-bold">{`${game.players?.length} players`}</pre>
      <pre>|</pre>
      <pre className={`text-sm font-bold ${mapGameStatusToColor(game.status)}`}>{game.status}</pre>
    </div>)

    return (
        <>
        <Logo />
        <div className="flex flex-col overflow-auto gap-4 m-6 w-full">
          {renderGames}
        </div>
        <div className="w-full flex flex-col gap-2">
          <NewGameButton />
        </div>
        </>
    
    )
}