import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LoginPage from './login/page';
import { listWorkspaces } from '@/lib/api';
import { Header } from './w/[id]/header';
import { WorkspaceListClient } from './w/[id]/workspace-list-client';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LoginPage />;
  }

  const workspaces = await listWorkspaces();

  return (
    <>
      <Header />
      <WorkspaceListClient initial={workspaces} />
    </>
  );
}
