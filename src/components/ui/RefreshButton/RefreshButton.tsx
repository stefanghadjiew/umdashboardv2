'use client';

import { Button } from "@shadcn-components"
import { useRouter } from "next/navigation";

export const RefreshButton = () => {
    const router = useRouter();
    const handleRefresh = () => router.refresh();

    return (
        <Button onClick={handleRefresh}>Refresh</Button>
    )
}