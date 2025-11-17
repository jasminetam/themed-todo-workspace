import { WorkspaceClient } from './workspace-client';
import { Header } from './header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LoginPage from '@/app/login/page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoginPage />;
    //TODO: redirect('/login') using next/navigation
  }

  return (
    <>
      <Header workspaceId={id} />
      <WorkspaceClient workspaceId={id} />
    </>
  );
}
