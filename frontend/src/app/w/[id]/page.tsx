import { WorkspaceClient } from './workspace-client';
import { Header } from './header';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Header workspaceId={id} />
      <WorkspaceClient workspaceId={id} />
    </>
  );
}
