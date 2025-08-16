'use client';

import { Button, Input, Label } from "@shadcn-components"
import { ProviderLoginButton } from "@components"
import { PROVIDERS } from "@lib/auth-client";

export const Form = () => {
    return (
        <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-inherit text-black border-1">
                  Login
                </Button>
                <ProviderLoginButton provider={PROVIDERS.Facebook} />
                <ProviderLoginButton provider={PROVIDERS.Github}/>
                <ProviderLoginButton provider={PROVIDERS.Google}/>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
    )
}