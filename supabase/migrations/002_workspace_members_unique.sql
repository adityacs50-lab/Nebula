-- Prevent duplicate membership rows so re-opening an invite link (or
-- opening one for a workspace you're already in) doesn't inflate member
-- counts or create redundant rows.
alter table workspace_members
  add constraint workspace_members_workspace_user_unique unique (workspace_id, user_id);
