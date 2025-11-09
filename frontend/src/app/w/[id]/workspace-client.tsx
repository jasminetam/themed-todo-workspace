'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, deleteTodo, getTheme, listTodos, updateTheme, updateTodo } from '@/lib/api';
import { type Theme, applyThemeNow } from '@/theme/useApplyTheme';
import { useEffect, useRef, useState } from 'react';

export function WorkspaceClient({ workspaceId }: { workspaceId: string }) {
  const qc = useQueryClient();

  const themeQ = useQuery({
    queryKey: ['theme', workspaceId],
    queryFn: () => getTheme(workspaceId),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const todosQ = useQuery({
    queryKey: ['todos', workspaceId],
    queryFn: () => listTodos(workspaceId),
  });

  const [localTheme, setLocalTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    if (themeQ.data) {
      setLocalTheme(themeQ.data);
      applyThemeNow(themeQ.data);
    }
  }, [themeQ.data]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mTheme = useMutation({
    mutationFn: (body: Theme) => updateTheme(workspaceId, body),
    onSuccess: (serverTheme) => {
      qc.setQueryData(['theme', workspaceId], serverTheme);
      applyThemeNow(serverTheme);
    },
  });

  const updateLocalAndQueueSave = (patch: Partial<Theme>) => {
    setLocalTheme((prev) => {
      const next: Theme = { ...(prev ?? {}), ...patch };
      applyThemeNow(next);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => mTheme.mutate(next), 250);
      return next;
    });
  };

  // --- Todos ---
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

  if (themeQ.isLoading || todosQ.isLoading) return <p>Loading…</p>;
  if (themeQ.error || todosQ.error) return <p className="text-red-600">Failed to load.</p>;

  const todos = todosQ.data ?? [];

  return (
    <div className="grid gap-6 p-4 md:grid-cols-3">
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
            className="rounded-skin flex-1 border px-3 py-2"
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="rounded-skin bg-primary px-3 py-2 text-white">Add</button>
        </form>

        <ul className="space-y-2">
          {todos.map((td) => (
            <li key={td.id} className="flex items-center justify-between rounded border p-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!td.done}
                  onChange={() => mToggle.mutate({ id: td.id, done: !td.done })}
                  className="rounded-skin"
                />
                <span className={td.done ? 'text-accent line-through opacity-100' : ''}>
                  {td.title}
                </span>
              </label>
              <button className="text-error text-sm" onClick={() => mDelete.mutate(td.id)}>
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
            className="rounded-skin border px-3 py-1"
            onClick={() => updateLocalAndQueueSave({ mode: 'light' })}
          >
            Light
          </button>
          <button
            className="rounded-skin border px-3 py-1"
            onClick={() => updateLocalAndQueueSave({ mode: 'dark' })}
          >
            Dark
          </button>
        </div>

        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-28">Primary (button)</label>
            <input
              type="color"
              value={localTheme?.primaryColor ?? '#3b82f6'}
              onChange={(e) => updateLocalAndQueueSave({ primaryColor: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28">Accent (checked todo)</label>
            <input
              type="color"
              value={localTheme?.accentColor ?? '#22c55e'}
              onChange={(e) => updateLocalAndQueueSave({ accentColor: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28">Nav bar</label>
            <input
              type="color"
              value={localTheme?.navColor ?? '#111827'}
              onChange={(e) => updateLocalAndQueueSave({ navColor: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28">Radius (buttons)</label>
            <input
              type="range"
              min={0}
              max={24}
              value={localTheme?.radius ?? 10}
              onChange={(e) => updateLocalAndQueueSave({ radius: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-skin bg-primary p-4 text-white">Primary button preview</div>
          <div className="rounded-skin p-4">
            <span className="text-accent">Deleted item (accent text)</span>
          </div>
          <div className="rounded-skin p-4" style={{ background: 'var(--nav)', color: '#fff' }}>
            Nav bar preview
          </div>
        </div>
      </aside>
    </div>
  );
}
