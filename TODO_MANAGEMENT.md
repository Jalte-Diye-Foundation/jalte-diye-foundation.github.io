# To-Do Management Workflow

Use GitHub Issues and pull requests as the single source of truth.

## Status Model

Use issue labels for status:

- `todo`
- `in-progress`
- `review`
- `blocked`
- `done`

## Priority Model

Use priority labels:

- `priority-high`
- `priority-medium`
- `priority-low`

## Team Labels

Use team labels:

- `team-dev`
- `team-deploy`
- `team-doc`

## Sprint Workflow

1. Create sprint issues from backlog.
2. Assign owner, team label, and priority.
3. Move issue to `in-progress` when coding starts.
4. Open PR and reference issue using `Closes #issue-number`.
5. Move issue to `review` while PR is under review.
6. Close issue after PR merge.

## Definition Of Done

A task is done only when:

- Code or docs are merged.
- Related issue is closed.
- Reviewer comments are resolved.
- Deployment note is added if production behavior changes.

## Blocker Handling

If blocked for more than 24 hours:

- Add `blocked` label.
- Add a comment with blocker details.
- Tag team coordinator.
