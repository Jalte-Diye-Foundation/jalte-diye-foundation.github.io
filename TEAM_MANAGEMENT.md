# Team Management Guide

This repository uses a 3-team structure with 3 members per team.

## Teams

- Team 1 (Development)
- Team 2 (Deployment)
- Team 3 (Documentation)

## Branch Ownership

- Team 1: `team1-dev` and `dev`
- Team 2: `team2-deploy` and `deploy`
- Team 3: `team3-doc` and `doc`

## Team Responsibilities

- Team 1: Build features, fix bugs, optimize UI and scripts.
- Team 2: Validate release readiness, deployment safety, rollback notes.
- Team 3: Maintain README, contributor docs, governance docs, wiki pages.

## Weekly Cadence

- Weekly planning: Assign issues and sprint goals.
- Mid-week sync: Share blockers and dependencies.
- Weekly review: Demo completed work and close sprint tasks.

## Coordinator Rotation

Each team rotates one coordinator every sprint.

Coordinator tasks:

- Maintain team issue board state.
- Confirm PR-to-issue linking.
- Share weekly status summary.
- Escalate blockers to maintainers.

## Collaboration Rules

- One issue maps to one clear task.
- One pull request should focus on one issue.
- Cross-team dependencies must be logged in issue comments.
- Deployment-impacting changes require Team 2 review.
- Public text and policy changes require Team 3 review.
