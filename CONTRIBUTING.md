# Contributing To Jalte Diye Foundation Website

Thank you for your interest in contributing.

We welcome improvements in code, design, accessibility, content, and documentation.

## Before You Start

- Read `README.md` to understand project goals and structure.
- Read `CODE_OF_CONDUCT.md`.
- Search existing issues before opening a new one.

## Ways To Contribute

- Report bugs.
- Suggest features or improvements.
- Improve content clarity and grammar.
- Improve accessibility, performance, and responsive behavior.
- Improve documentation.

## Local Setup

Run a local HTTP server from the repository root.

Example:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

## Branches

- `main`: Protected and stable.
- `dev`: Regular development.
- `doc`: Documentation-focused updates.
- `deploy`: Deployment and release preparation.
- `boost`: Feature/performance updates.
- `debug`: Debugging-focused updates.
- `team1-dev`: Team 1 branch for development execution.
- `team2-deploy`: Team 2 branch for deployment execution.
- `team3-doc`: Team 3 branch for documentation execution.

Please open pull requests against the most relevant branch.

## Team Workflow

- Team 1 works from `team1-dev` and opens PRs to `dev`.
- Team 2 works from `team2-deploy` and opens PRs to `deploy`.
- Team 3 works from `team3-doc` and opens PRs to `doc`.
- Maintainers merge `dev`, `deploy`, and `doc` into `main` after review.

For all teams:

- Use one issue per task.
- Link every PR to at least one issue.
- Keep PRs focused on one outcome.
- Add testing notes in the PR description.

See `TODO_MANAGEMENT.md` and `TEAM_MANAGEMENT.md`.

## Pull Request Process

1. Fork the repository and create a feature branch.
2. Keep changes focused and small.
3. Explain what changed and why.
4. Include screenshots for visible UI changes.
5. Link related issues where possible.
6. Confirm no sensitive data is added.

## Content And Policy Changes

For updates to legal, policy, or organizational pages, mention:

- Why the change is needed.
- Which public source or internal policy it aligns with.

## Response Expectations

Maintainers aim to acknowledge new issues and pull requests within 7 days.
Complex reviews may take longer.

## Good First Contributions

If you are new, start with:

- Documentation fixes.
- Minor UI polish.
- Accessibility fixes.
- Broken links and typos.

Thank you for helping make this project better for everyone.
