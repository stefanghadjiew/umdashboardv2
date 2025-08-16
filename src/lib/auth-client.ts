import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react

export const PROVIDERS = {
  Github: 'Github',
  Facebook: 'Facebook',
  Google: 'Google'
} as const;

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

const { signIn, useSession, signOut } = createAuthClient({
  // you can pass client configuration here
});

const signInWithSocial = async (provider: Provider) => {
  try {
    await signIn.social({ provider: provider.toLowerCase(), callbackURL: '/games' });
  } catch (error) {
    console.error(`Sign-in with ${provider} failed`, error);
    throw error;
  }
};
const signUserOut = async (callback: () => void) => {
  await signOut({
    fetchOptions: {
      onSuccess: () => callback(),
      onError: (error) => console.error('Error while trying to sign user out:', error.error)
    }
  });
};
export { signInWithSocial, useSession, signUserOut };
