'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@shadcn-components';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useSession } from '@lib/auth-client';

export const BackFromGameButton = ({ gameId }: {gameId: Id<'games'>}) => {
  const { data } = useSession();
  const removePlayerFromGame = useMutation(api.mutations.removePlayerFromGame);
  const router = useRouter();

  const handleOnClickBack = async () => {
    try {
      await removePlayerFromGame({gameId, email: data?.user.email ?? ''});
      router.back();
    } catch (err: any) {
      throw new Error('Error removing player from game:', err);
    }
  } 
  return <Button onClick={handleOnClickBack}>⬅ Back</Button>;
}