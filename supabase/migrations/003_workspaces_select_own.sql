-- Let creators read workspaces they created. Without this, the row a
-- user just inserted is invisible to them until their membership row
-- lands (the only select policy required membership), which broke
-- insert-with-returning during workspace creation.
drop policy if exists "workspaces_select_own" on workspaces;
create policy "workspaces_select_own" on workspaces
  for select using (created_by = auth.uid());
