'use client';

import { type Provider, signInWithSocial } from '@lib/auth-client';

import { Button } from '@shadcn-components';

//TODO: Fix SVG imports

import { SVG } from '@components';


/* const providerIcons: Record<Provider, any> = { Facebook : SVG.Facebook, Google: SVG.Google, Github: SVG.Github }; */

export const ProviderLoginButton = ({ provider, className }: { provider: Provider, className?: string }) => {
  const btnClasses = `cursor-pointer ${className}`;
  /* const ProviderIcon = providerIcons[provider]; */
  return (
    <Button type="button" onClick={() => signInWithSocial(provider)} className={btnClasses}>
     {/*  {SVG.Github} */}
      {provider}
    </Button>
  );
};
