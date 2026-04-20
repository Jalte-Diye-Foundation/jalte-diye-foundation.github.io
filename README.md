# Jalte Diye Foundation Website

[![Development Integration](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/development-integration.yml/badge.svg?branch=main)](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/development-integration.yml)
[![Testing Integration](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/testing-integration.yml/badge.svg?branch=main)](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/testing-integration.yml)
[![Deployment Integration](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/deployment-integration.yml/badge.svg?branch=main)](https://github.com/Jalte-Diye-Foundation/jalte-diye-foundation.github.io/actions/workflows/deployment-integration.yml)

Official source code for the Jalte Diye Foundation website.

This repository hosts a static website focused on peace education, social welfare initiatives, donor engagement, certificates, and outreach updates.

## Official Links

- Website: https://jalte-diye-foundation.github.io
- X: https://x.com/JalteDiyeNPO
- LinkedIn: https://www.linkedin.com/company/jalte-diye-foundation
- Facebook: https://www.facebook.com/JalteDiyeFoundation
- Instagram: https://www.instagram.com/jalte_diye_foundation
- YouTube: https://www.youtube.com/@JalteDiyeNPO
- WhatsApp: https://wa.me/message/XSTSJ3NR7SL6E1

## Project Vision

We maintain this website to:

- Share the foundation's mission and social impact.
- Publish transparent updates on initiatives and donor support.
- Provide accessible, trustworthy public information.
- Enable volunteers and contributors to improve communication and outreach.

## Repository Structure

- `index.html`, `projects.html`, `donate.html`, and other top-level pages: Main website pages.
- `admin/`: Lightweight administrative pages.
- `certificates/`: Certificate data and assets.
- `css/style.css`: Shared website styles.
- `js/script.js`, `js/certificates.js`: Frontend behavior.
- `images/`: Media assets.

## Run Locally

This is a static site. You can run it with any local HTTP server.

Example with Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## CI Status

This repository uses GitHub Actions workflows to continuously validate development, testing, and deployment integration quality.

- Development Integration: structure and local-link checks on development branches.
- Testing Integration: JSON, structure, and local-link checks on integration branches and pull requests.
- Deployment Integration: deployment-readiness checks and packaged build artifact generation.

## Branch Model

- `main`: Protected branch for stable, production-ready updates.
- `dev`: Regular development branch.
- `doc`: Documentation-focused updates.
- `deploy`: Deployment and release preparation branch.
- `boost`: Performance and feature enhancements.
- `debug`: Debugging-focused changes.
- `team1-dev`: Team 1 working branch for development tasks.
- `team2-deploy`: Team 2 working branch for deployment and release tasks.
- `team3-doc`: Team 3 working branch for documentation and knowledge tasks.

## Team Structure

This repository is organized for 3 teams of 3 members each:

- Team 1 (Development): UI updates, features, bug fixes, refactoring.
- Team 2 (Deployment): release checks, deployment readiness, rollback notes.
- Team 3 (Documentation): contributor docs, policy docs, wiki maintenance.

Read:

- `TEAM_MANAGEMENT.md`
- `TODO_MANAGEMENT.md`
- `PROJECT_MANAGEMENT_SETUP.md`
- `docs/wiki/Home.md`

## How To Contribute

Please read:

- `CONTRIBUTING.md` for contribution workflow.
- `CODE_OF_CONDUCT.md` for expected behavior.
- `SECURITY.md` for reporting vulnerabilities.
- `TEAM_MANAGEMENT.md` for team responsibilities.
- `TODO_MANAGEMENT.md` for sprint and backlog workflow.

You can contribute via:

- Bug reports
- Content improvements
- Accessibility fixes
- UI/UX improvements
- Documentation updates

## Community Standards

This repository includes community health files in line with GitHub community profile recommendations:

- `README.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- Issue and pull request templates in `.github/`

## Support

- General questions and support: `SUPPORT.md`
- Contact: contact@jaltediyefoundation.org

## Wiki Documentation

Wiki-ready documentation pages are available in `docs/wiki/` and can be copied to
the repository Wiki tab.

## License

Released under the MIT License. See `LICENSE`.
