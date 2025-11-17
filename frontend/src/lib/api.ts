import { authedFetch as authedFetchServer } from './authedFetch.server';
import { authedFetchClient } from './authedFetch.client';

const API =
  typeof window === 'undefined'
    ? process.env.API_BASE! // server-only env
    : process.env.NEXT_PUBLIC_API_BASE!; // client-visible env

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API}${path}`;
  const fetchFn = typeof window === 'undefined' ? authedFetchServer : authedFetchClient;

  const res = await fetchFn(url, init);
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function requestWith404Fallback<T>(
  path: string,
  init: RequestInit | undefined,
  fallback: T,
): Promise<T> {
  try {
    return await request<T>(path, init);
  } catch (err: any) {
    if (err instanceof Error && err.message.startsWith('404 ')) {
      return fallback;
    }
    throw err;
  }
}

export type Workspace = { id: string; name: string; ownerId: string };
export const listWorkspaces = () => request<Workspace[]>('/api/workspaces');

export const createWorkspace = (name: string) =>
  request<Workspace>('/api/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

export type Theme = {
  id: string;
  workspaceId: string;
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  radius: number;
};
export const getTheme = (workspaceId: string) =>
  requestWith404Fallback<Theme>(`/api/theme?workspaceId=${workspaceId}`, undefined, {
    // placeholder defaults until user customises & backend creates
    id: 'new',
    workspaceId,
    mode: 'light',
    primaryColor: '#3b82f6',
    accentColor: '#22c55e',
    radius: 10,
  });
export const updateTheme = (workspaceId: string, body: Partial<Theme>) =>
  request<Theme>(`/api/theme?workspaceId=${workspaceId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export type Todo = {
  id: string;
  workspaceId: string;
  title: string;
  done: boolean;
  dueAt?: string;
  createdAt: string;
};

export const listTodos = (workspaceId: string) =>
  requestWith404Fallback<Todo[]>(`/api/todos?workspaceId=${workspaceId}`, undefined, []);

export const createTodo = (workspaceId: string, title: string) =>
  request<Todo>('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ workspaceId, title }),
  });

export const updateTodo = (id: string, body: Partial<Pick<Todo, 'title' | 'done' | 'dueAt'>>) =>
  request<Todo>(`/api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const deleteTodo = (id: string) =>
  authedFetchServer(`${API}/api/todos/${id}`, { method: 'DELETE' }).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
  });
