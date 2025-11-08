// src/app/w/[id]/workspace-client.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, deleteTodo, getTheme, listTodos, updateTheme, updateTodo } from '@/lib/api';
import { useApplyTheme, applyThemeNow } from '@/theme/useApplyTheme';
import { useState } from 'react';

export function WorkspaceClient({ workspaceId }: { workspaceId: string }) {
  const qc = useQueryClient();

  const themeQ = useQuery({
    queryKey: ['theme', workspaceId],
    queryFn: () => getTheme(workspaceId),
  });
  const todosQ = useQuery({
    queryKey: ['todos', workspaceId],
    queryFn: () => listTodos(workspaceId),
  });

  // Apply theme once it loads
  useApplyTheme(themeQ.data);

  const [title, setTitle] = useState('');

  const mCreate = useMutation({
    mutationFn: () => createTodo(workspaceId, title),
    onSuccess: () => {
      setTitle('');
      qc.invalidateQueries({ queryKey: ['todos', workspaceId] });
    },
  });

  const mToggle = useMutation({
    mutationFn: (args: { id: string; done: boolean }) => updateTodo(args.id, { done: args.done }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todos', workspaceId] }),
  });

  const mDelete = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todos', workspaceId] }),
  });

  const mTheme = useMutation({
    mutationFn: (body: {
      mode?: 'light' | 'dark';
      primaryColor?: string;
      accentColor?: string;
      radius?: number;
    }) => updateTheme(workspaceId, body),
    onSuccess: (t) => {
      // live preview
      applyThemeNow(t);
      qc.setQueryData(['theme', workspaceId], t);
    },
  });

  if (themeQ.isLoading || todosQ.isLoading) return <p>Loading…</p>;
  if (themeQ.error || todosQ.error) return <p className="text-red-600">Failed to load.</p>;

  const todos = todosQ.data ?? [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="space-y-4 md:col-span-2">
        <h2 className="text-lg font-semibold">Todos</h2>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            mCreate.mutate();
          }}
        >
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="rounded border px-3 py-2">Add</button>
        </form>

        <ul className="space-y-2">
          {todos.map((td) => (
            <li key={td.id} className="flex items-center justify-between rounded border p-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!td.done}
                  onChange={() => mToggle.mutate({ id: td.id, done: !td.done })}
                />
                <span className={td.done ? 'line-through opacity-60' : ''}>{td.title}</span>
              </label>
              <button className="text-sm text-red-600" onClick={() => mDelete.mutate(td.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-4">
        <h2 className="text-lg font-semibold">Theme</h2>
        <div className="flex gap-2">
          <button
            className="rounded border px-3 py-1"
            onClick={() => mTheme.mutate({ mode: 'light' })}
          >
            Light
          </button>
          <button
            className="rounded border px-3 py-1"
            onClick={() => mTheme.mutate({ mode: 'dark' })}
          >
            Dark
          </button>
        </div>

        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-28">Primary</label>
            <input
              type="color"
              defaultValue={themeQ.data?.primaryColor}
              onChange={(e) => mTheme.mutate({ primaryColor: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28">Accent</label>
            <input
              type="color"
              defaultValue={themeQ.data?.accentColor}
              onChange={(e) => mTheme.mutate({ accentColor: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28">Radius</label>
            <input
              type="range"
              min={0}
              max={24}
              defaultValue={themeQ.data?.radius ?? 10}
              onChange={(e) => mTheme.mutate({ radius: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-4">
          <div
            className="p-4"
            style={{ borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff' }}
          >
            Primary preview
          </div>
        </div>
      </aside>
    </div>
  );
}
