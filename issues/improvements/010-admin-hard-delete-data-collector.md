## Parent PRD

None — standalone admin user-management improvement (not part of the per-tool downloads PRD).

## What to build

Allow an **Admin** to **hard-delete** a data collector account. Deletion is allowed **even when the collector has submissions**. **Submissions and related field data remain**; only the user account (and credentials) are removed.

Today `submissions.collector_id` is `NOT NULL REFERENCES users(id)` — a Flyway migration must allow delete-without-cascade-of-submissions (e.g. drop FK restrict, make `collector_id` **nullable**, `ON DELETE SET NULL`, and update joins/DTOs so admin UIs show a clear **“Deleted collector”** / blank name when the user row is gone). Apply the same treatment to any other tables that FK to `users` for collectors if they would block delete.

Deactivate / reactivate remain available; delete is a separate, confirmed destructive action (cannot delete `ADMIN` accounts).

## Acceptance criteria

- [x] `DELETE /api/v1/admin/users/{id}` (or equivalent) — `ADMIN` only; target must be a data collector; admin accounts → 400/403.
- [x] Collector with zero or many submissions can be deleted; **submission rows remain** with preserved answers; `collector_id` null (or equivalent) after delete.
- [x] Admin list/detail/export that previously joined collector name still work: show deleted-collector placeholder, not 500.
- [x] Manage Users UI: delete action with confirm dialog; success removes the user from the list; errors surfaced.
- [x] Domain/application tests: delete rules; cannot delete admin; submissions survive; adapter tests for 204/404/403 and FK migration behaviour.
- [x] Soft deactivate remains unchanged for reversible cases.

## Blocked by

None — can start immediately (parallel to download work). Recommend coordinating with 009 if both touch Manage Users in the same PR.

## User stories addressed

N/A — operational admin UX.
