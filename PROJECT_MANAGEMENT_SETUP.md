# Project Management Setup

Use GitHub Projects (board view) with repository issues.

## Recommended Board

Project name:

- Website Delivery Board

Views:

- Sprint Board
- Backlog
- Deployment Queue
- Documentation Queue

## Recommended Columns

- Backlog
- Todo
- In Progress
- In Review
- Blocked
- Done

## Recommended Custom Fields

- Team: Team 1, Team 2, Team 3
- Priority: High, Medium, Low
- Sprint: Sprint-1, Sprint-2, Sprint-3
- Type: Dev, Deploy, Doc, Bug, Enhancement

## Label Set

Create these labels:

- `todo`
- `in-progress`
- `review`
- `blocked`
- `done`
- `team-dev`
- `team-deploy`
- `team-doc`
- `priority-high`
- `priority-medium`
- `priority-low`
- `good first issue`
- `help wanted`

## Automation Rules

- New issue added to Todo.
- PR linked to issue moves issue to In Review.
- Merged PR closes issue and moves it to Done.

## Team Ownership

- Team 1 owns Dev and Bug items.
- Team 2 owns Deploy and Release items.
- Team 3 owns Doc and Wiki items.
