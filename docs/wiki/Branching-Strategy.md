# Branching Strategy

## Protected Branch

- `main` is protected and production-facing.

## Role Branches

- `dev` for development integration.
- `deploy` for deployment readiness and release checks.
- `doc` for documentation and wiki content.

## Team Branches

- `team1-dev` for Team 1 implementation work.
- `team2-deploy` for Team 2 deployment work.
- `team3-doc` for Team 3 documentation work.

## Merge Flow

1. Team branch to role branch.
2. Role branch to `main` after maintainer review.

## Naming For Feature Branches

Use:

`team-name/type/short-description`

Examples:

- `team1-dev/feature/donor-wall-filter`
- `team2-deploy/chore/release-checklist-apr`
- `team3-doc/docs/wiki-onboarding`
