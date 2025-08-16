'use client';

import { useSession } from "@lib/auth-client";
import { LogoutButton } from "./LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@shadcn-components"


export const Navigation = () => {
    const { data, isPending } = useSession();

    if(isPending) {
        return 'Loading session...'
    }
    
    if(!data?.session) {
        return null;
    }

    return (
        <div className="fixed w-full flex justify-between mx-2 px-8 pt-2">
            <LogoutButton />
            <Avatar>
                <AvatarImage src={data?.user.image ?? ''} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}