# Release And Deployment

## Pre-Release Checklist

- Changes merged to `dev`, `doc`, or `deploy`.
- User-facing docs updated.
- No unresolved blockers.
- Smoke check completed on major pages.

## Deployment Flow

1. Team 2 validates release candidate from `deploy`.
2. Maintainers approve merge to `main`.
3. Post-merge smoke test on production URL.

## Rollback Readiness

For each release, store:

- List of changed files
- Risk summary
- Rollback commit reference

## Post-Release

- Monitor reported issues.
- Open follow-up tasks for regressions.
- Publish release summary in repository discussions or issue thread.
