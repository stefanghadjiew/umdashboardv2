import { LoginForm } from "@shadcn";
import { getSession } from "./getSession";
import { redirect } from "next/navigation";
import { Logo } from "@components";

export default async function Home() {
  const session = await getSession();

  if(session) {
    redirect('/games');
  }

  return (
    <>
      <Logo/>
      <LoginForm />
    </>
    );
}
