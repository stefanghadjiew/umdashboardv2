import { BackFromGameButton } from './BackFromGameButton';
import { JoinTeamButton } from "./[team]/lobby/JoinTeamButton";
import { Id } from "@convex/_generated/dataModel";
import { Logo } from '@components';
import { DisplayTeams } from './DisplayTeams';

export default async function TeamSelection({ params } : Readonly<{ params: Promise<{gameId: Id<'games'>}> }>) {
    const { gameId } = await params;
    return (
        <div className="flex flex-col gap-2 w-full h-full justify-between">
            <Logo />
            <DisplayTeams gameId={gameId}/>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                    <JoinTeamButton team="team1" gameId={gameId} className='flex-1/2'/>
                    <JoinTeamButton team="team2" gameId={gameId} className='flex-1/2'/>
                </div>
                <BackFromGameButton gameId={gameId }/>
            </div>
        </div>
    )
}