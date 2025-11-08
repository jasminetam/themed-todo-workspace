const API = process.env.NEXT_PUBLIC_API!;
const USER = process.env.NEXT_PUBLIC_USER_ID!;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', 'X-User-Id': USER },
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export type Workspace = { id: string; name: string; ownerId: string };
export const listWorkspaces = () => request<Workspace[]>('/api/workspaces');

export type Theme = {
  id: string;
  workspaceId: string;
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  radius: number;
};
export const getTheme = (workspaceId: string) =>
  request<Theme>(`/api/theme?workspaceId=${workspaceId}`);
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
  request<Todo[]>(`/api/todos?workspaceId=${workspaceId}`);
export const createTodo = (workspaceId: string, title: string) =>
  request<Todo>('/api/todos', { method: 'POST', body: JSON.stringify({ workspaceId, title }) });
export const updateTodo = (id: string, body: Partial<Pick<Todo, 'title' | 'done' | 'dueAt'>>) =>
  request<Todo>(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteTodo = (id: string) =>
  fetch(`${API}/api/todos/${id}`, { method: 'DELETE', headers: { 'X-User-Id': USER } }).then(
    (r) => {
      if (!r.ok) throw new Error(`${r.status}`);
    },
  );
