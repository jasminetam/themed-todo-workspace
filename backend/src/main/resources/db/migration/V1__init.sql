CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       varchar(320) UNIQUE NOT NULL,
  name        varchar(200),
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE workspaces (
  id       uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES users(id),
  name     text NOT NULL
);

CREATE TABLE themes (
  id            uuid PRIMARY KEY,
  workspace_id  uuid NOT NULL REFERENCES workspaces(id) UNIQUE,
  mode          text NOT NULL,
  primary_color text NOT NULL,
  accent_color  text NOT NULL,
  radius        int NOT NULL DEFAULT 10
);

CREATE TABLE todos (
  id           uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  title        text NOT NULL,
  done         boolean NOT NULL DEFAULT false,
  due_at       timestamp NULL,
  created_at   timestamp NOT NULL DEFAULT now()
);

CREATE INDEX idx_todos_workspace ON todos(workspace_id);
