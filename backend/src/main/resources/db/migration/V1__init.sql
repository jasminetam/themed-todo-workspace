create table users (
  id uuid primary key,
  email text unique not null,
  name text,
  avatar_url text
);

create table workspaces (
  id uuid primary key,
  owner_id uuid not null references users(id),
  name text not null
);

create table themes (
  id uuid primary key,
  workspace_id uuid not null references workspaces(id) unique,
  mode text not null,
  primary_color text not null,
  accent_color text not null,
  radius int not null default 10
);

create table todos (
  id uuid primary key,
  workspace_id uuid not null references workspaces(id),
  title text not null,
  done boolean not null default false,
  due_at timestamp null,
  created_at timestamp not null default now()
);

create index idx_todos_workspace on todos(workspace_id);
