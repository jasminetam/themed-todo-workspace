'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Workspace } from '@/lib/api';
import { createWorkspace } from '@/lib/api';

export function WorkspaceListClient({ initial }: { initial: Workspace[] }) {
  const [workspaces, setWorkspaces] = useState(initial);
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || isCreating) return;

    setIsCreating(true);
    try {
      const ws = await createWorkspace(trimmed);
      setWorkspaces((prev) => [...prev, ws]);
      setName('');

      // 🔁 redirect to preview page for this workspace
      router.push(`/w/${ws.id}`);
    } catch (err) {
      console.error('Failed to create workspace', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your Workspaces</h1>

      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <input
          className="rounded-skin flex-1 border px-3 py-2"
          placeholder="Workspace name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={isCreating || !name.trim()}
          className="rounded-skin bg-primary px-3 py-2 text-white disabled:opacity-60"
        >
          {isCreating ? 'Creating…' : 'Create workspace'}
        </button>
      </form>

      {workspaces.length === 0 ? (
        <p>No workspaces yet. Create your first one above 👆</p>
      ) : (
        <ul className="space-y-2">
          {workspaces.map((w) => (
            <li
              key={w.id}
              className="cursor-pointer rounded border px-3 py-2 hover:bg-gray-50"
              onClick={() => router.push(`/w/${w.id}`)}
            >
              {w.name}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
