
import { BackFromGameButton } from './BackFromGameButton';
import { JoinTeamButton } from "./[team]/lobby/JoinTeamButton";
import { Id } from "@convex/_generated/dataModel";
import { Logo } from '@components';

export default async function TeamSelection({ params } : Readonly<{ params: Promise<{gameId: Id<'games'>}> }>) {
    const { gameId } = await params;
    return (
        <div className="flex flex-col gap-2 w-full h-full justify-between">
            <Logo />
           <div className='flex flex-col gap-2'>
                <JoinTeamButton team="team1" gameId={gameId} />
                <JoinTeamButton team="team2" gameId={gameId}/>
                <BackFromGameButton gameId={gameId }/>
           </div>
        </div>
    )
}