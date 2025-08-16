'use client';

import { signUserOut, useSession } from '@lib/auth-client';
import { useRouter, useParams } from 'next/navigation';
import { SVG } from 'components/ui/SVG';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

export const LogoutButton = () => {
  const removePlayerFromGame = useMutation(api.mutations.removePlayerFromGame);
  const router = useRouter();
  const { data } = useSession();
  const { gameId } = useParams();
  if (!data?.session) {
    return null;
  }
  const handleLogout = async () => {
    if(gameId) {
      const typedGameId = gameId as Id<'games'>;
      await removePlayerFromGame({email: data.user.email, gameId: typedGameId})
    }
    signUserOut(() => router.push('/'))
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-black px-2 py-1 text-white font-bold cursor-pointer max-w-[3rem] max-h-[3rem] flex items-center rounded-full"
    >
      {SVG.Logout}
    </button>
  );
};
