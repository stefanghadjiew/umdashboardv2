'use client';

import { Button, Input, Label } from "@shadcn-components"
import { ProviderLoginButton } from "@components"
import { PROVIDERS } from "@lib/auth-client";

export const Form = () => {
  const disabledClasses = "pointer-events-none opacity-50";
    return (
        <form>
            <div className="flex flex-col gap-6">
              <div className={`grid gap-3 ${disabledClasses}`}>
                <Label htmlFor="email">Email(in dev)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className={`grid gap-3 ${disabledClasses}`}>
                <div className="flex items-center">
                  <Label htmlFor="password">Password(in dev)</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" className={`w-full bg-inherit text-black border-1 ${disabledClasses}`}>
                  Login(in dev)
                </Button>
                <ProviderLoginButton provider={PROVIDERS.Facebook} />
                <div className="flex gap-2">

                <ProviderLoginButton provider={PROVIDERS.Github} className="flex-1/2"/>
                <ProviderLoginButton provider={PROVIDERS.Google} className="flex-1/2"/>
                </div>
              </div>
            </div>
            <div className={`mt-4 text-center text-sm ${disabledClasses}`}>
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up(in dev)
              </a>
            </div>
          </form>
    )
}