'use client';

import { type Provider, signInWithSocial } from '@lib/auth-client';

import { Button } from '@shadcn-components';

export const ProviderLoginButton = ({ provider }: { provider: Provider }) => {
  return (
    <Button type="button" onClick={() => signInWithSocial(provider)} className="w-full cursor-pointer">
      {provider}
    </Button>
  );
};
