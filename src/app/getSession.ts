'use server';
import { headers } from "next/headers"

export const getSession = async () => {
    const headersList = await headers();
    const cookie = headersList.get('cookie');

    const session = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/get-session`, {
        headers: {
        'Content-Type': 'application/json',
        cookie: cookie ?? ''
        }
    }).then((res) => res.json());

    return session;
}