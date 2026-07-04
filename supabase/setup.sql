-- Nebula — one-shot database setup.
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Idempotent: safe to run again on a project that already has the schema.
-- (Equivalent to migrations 001 + 002 + 003 + 004.)

-- Workspaces
create table if not exists workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Workspace members
create table if not exists workspace_members (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id),
  role text default 'member',
  joined_at timestamp with time zone default now()
);

-- Blocks (persisted canvas state)
create table if not exists blocks (
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
create table if not exists connections (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  source_block_id uuid references blocks(id) on delete cascade,
  target_block_id uuid references blocks(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Invite links
create table if not exists invites (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  token text unique default encode(gen_random_bytes(32), 'hex'),
  created_by uuid references auth.users(id),
  expires_at timestamp with time zone default (now() + interval '7 days'),
  used_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- One membership row per user per workspace (invite redemption is idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workspace_members_workspace_user_unique'
  ) then
    alter table workspace_members
      add constraint workspace_members_workspace_user_unique unique (workspace_id, user_id);
  end if;
end $$;

-- Row-level security
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table blocks enable row level security;
alter table connections enable row level security;
alter table invites enable row level security;

-- Users can only see workspaces they're members of
drop policy if exists "workspace_members_select" on workspaces;
create policy "workspace_members_select" on workspaces
  for select using (
    id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "workspaces_insert" on workspaces;
create policy "workspaces_insert" on workspaces
  for insert with check (created_by = auth.uid());

-- Creators can always read their own workspaces (needed at creation time,
-- before their membership row exists)
drop policy if exists "workspaces_select_own" on workspaces;
create policy "workspaces_select_own" on workspaces
  for select using (created_by = auth.uid());

drop policy if exists "memberships_select" on workspace_members;
create policy "memberships_select" on workspace_members
  for select using (user_id = auth.uid());

drop policy if exists "memberships_insert" on workspace_members;
create policy "memberships_insert" on workspace_members
  for insert with check (user_id = auth.uid());

drop policy if exists "blocks_select" on blocks;
create policy "blocks_select" on blocks
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "blocks_insert" on blocks;
create policy "blocks_insert" on blocks
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "blocks_update" on blocks;
create policy "blocks_update" on blocks
  for update using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "connections_select" on connections;
create policy "connections_select" on connections
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "connections_insert" on connections;
create policy "connections_insert" on connections
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Only workspace members can see or create invites
drop policy if exists "invites_select" on invites;
create policy "invites_select" on invites
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "invites_insert" on invites;
create policy "invites_insert" on invites
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Nebula OS: per-member blocks, member identity, and the team feed.

-- Blocks belong to a member
alter table blocks add column if not exists owner_id uuid references auth.users(id);

-- Members carry a display name + cursor color
alter table workspace_members add column if not exists name text not null default 'Member';
alter table workspace_members add column if not exists color text not null default '#7C3AED';

-- Team feed items
create table if not exists feed_items (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  member_id uuid references auth.users(id),
  member_name text not null,
  member_color text not null,
  type text not null,
  title text not null,
  summary text not null,
  block_id uuid references blocks(id),
  created_at timestamptz default now()
);

alter table feed_items enable row level security;

drop policy if exists "members_see_feed" on feed_items;
create policy "members_see_feed" on feed_items
  for select using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

drop policy if exists "members_insert_feed" on feed_items;
create policy "members_insert_feed" on feed_items
  for insert with check (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- Members may edit their own blocks; teammates read-only (select policy
-- already grants workspace-wide reads)
drop policy if exists "blocks_update" on blocks;
drop policy if exists "members_edit_own_blocks" on blocks;
create policy "members_edit_own_blocks" on blocks
  for update using (owner_id = auth.uid());

drop policy if exists "members_delete_own_blocks" on blocks;
create policy "members_delete_own_blocks" on blocks
  for delete using (owner_id = auth.uid());
