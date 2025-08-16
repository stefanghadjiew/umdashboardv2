import { redirect } from 'next/navigation';
import { ConvexClientProvider } from "components/ConvexClientProvider";
import { getSession } from "app/getSession";
import { Navigation } from '@components';

export default async function MainLayout({children} : Readonly<{children: React.ReactNode}>) {
    const session = await getSession();
  
    if (!session) {
      redirect('/');
    }

    return (
      <ConvexClientProvider>
        <Navigation />
          {children}
      </ConvexClientProvider>
    )
}