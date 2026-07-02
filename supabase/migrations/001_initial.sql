-- Nebula — initial schema
-- Run with: supabase db push  (or paste into the Supabase SQL editor)

-- Workspaces
create table workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Workspace members
create table workspace_members (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id),
  role text default 'member',
  joined_at timestamp with time zone default now()
);

-- Blocks (persisted canvas state)
create table blocks (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  type text not null,
  title text,
  content jsonb default '{}',
  position jsonb default '{"x": 0, "y": 0}',
  size jsonb default '{"width": 400, "height": 300}',
  created_by uuid references auth.users(id),
  last_edited_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Connections between blocks
create table connections (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  source_block_id uuid references blocks(id) on delete cascade,
  target_block_id uuid references blocks(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Invite links
create table invites (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  token text unique default encode(gen_random_bytes(32), 'hex'),
  created_by uuid references auth.users(id),
  expires_at timestamp with time zone default (now() + interval '7 days'),
  used_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table blocks enable row level security;
alter table connections enable row level security;
alter table invites enable row level security;

-- Users can only see workspaces they're members of
create policy "workspace_members_select" on workspaces
  for select using (
    id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Workspace creation
create policy "workspaces_insert" on workspaces
  for insert with check (created_by = auth.uid());

-- Membership: users can see their own memberships and join rows for
-- workspaces they belong to
create policy "memberships_select" on workspace_members
  for select using (user_id = auth.uid());

create policy "memberships_insert" on workspace_members
  for insert with check (user_id = auth.uid());

-- Block policies
create policy "blocks_select" on blocks
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "blocks_insert" on blocks
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "blocks_update" on blocks
  for update using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Connection policies
create policy "connections_select" on connections
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "connections_insert" on connections
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Invite policies
create policy "invites_select" on invites
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "invites_insert" on invites
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );
