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
