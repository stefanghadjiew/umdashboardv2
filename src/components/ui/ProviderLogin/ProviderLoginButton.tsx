'use client';

import { type Provider, signInWithSocial } from '@lib/auth-client';

import { Button } from '@shadcn-components';

import { SVG } from '@components';


/* const providerIcons: Record<Provider, any> = { Facebook : SVG.Facebook, Google: SVG.Google, Github: SVG.Github }; */

export const ProviderLoginButton = ({ provider }: { provider: Provider }) => {
 /*  const providerIcon = providerIcons[provider]; */
  return (
    <Button type="button" onClick={() => signInWithSocial(provider)} className="w-full cursor-pointer">
      {/* {providerIcon} */}
      {provider}
    </Button>
  );
};
