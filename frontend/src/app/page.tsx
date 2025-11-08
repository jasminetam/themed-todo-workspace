import Link from 'next/link';
import { listWorkspaces } from '@/lib/api';

export default async function Page() {
  let workspaces: any[] = [];
  try {
    workspaces = await listWorkspaces();
  } catch {}

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Workspaces</h2>
      {workspaces.length === 0 ? (
        <p className="opacity-70">No workspaces found.</p>
      ) : (
        <ul className="space-y-2">
          {workspaces.map((w: any) => (
            <li key={w.id}>
              <Link className="underline" href={`/w/${w.id}`}>
                {w.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
