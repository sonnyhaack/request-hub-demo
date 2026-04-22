# Request Hub Demo

Request Hub Demo is a small full-stack demo for an internal request management system.

The project demonstrates a clean Django REST Framework backend, a polished React dashboard, and how AI-assisted development can accelerate delivery while preserving normal engineering standards. It is intentionally small: this is not an MVP and not a production-ready product.

## Stack

- Python
- Django
- Django REST Framework
- SQLite for local development
- Django's built-in test runner
- React
- Vite
- TypeScript
- Tailwind
- shadcn/ui-style components

## Implemented Phase 1 Scope

- Create requests
- List requests, newest first, without pagination
- Filter requests by `status` and `priority`
- View request details with nested comments in chronological order
- Update request `status` and `priority`
- Add comments to requests
- View summary counts by status, including zero values

The demo excludes authentication, authorization, pagination, soft delete, audit logging, notifications, background jobs, file uploads, analytics, charts, and extra pages.

## Run The Demo

For a non-technical reviewer on Windows, double-click:

```text
Start Demo.bat
```

It installs missing dependencies, prepares the database, starts the backend and frontend servers, and opens the browser at `http://127.0.0.1:5173/`. Keep the two server windows open while reviewing the app.

Start the backend API first:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures\sample_requests.json
python manage.py runserver
```

In a second terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. The frontend proxies `/api` to the Django backend at `http://127.0.0.1:8000`.

## Backend Commands

Run from `backend/`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
python -m pip install -r requirements.txt
```

```powershell
python manage.py migrate
python manage.py runserver
python manage.py test
```

Load sample requests and comments:

```powershell
python manage.py loaddata fixtures\sample_requests.json
```

## Frontend Commands

Run from `frontend/`:

```powershell
npm install
npm run dev
npm run build
npm run lint
```

## Endpoint Overview

- `POST /api/requests/` creates a request
- `GET /api/requests/` lists requests newest first
- `GET /api/requests/?status=open` filters by status
- `GET /api/requests/?priority=high` filters by priority
- `GET /api/requests/?status=in_progress&priority=high` combines filters
- `GET /api/requests/{id}/` returns request details with comments
- `PATCH /api/requests/{id}/` updates only `status` and `priority`
- `POST /api/requests/{id}/comments/` adds a comment
- `GET /api/summary/` returns counts for `open`, `in_progress`, and `closed`

Allowed statuses are `open`, `in_progress`, and `closed`. Allowed priorities are `low`, `medium`, and `high`. Omitted `requester_name` and `author_name` values serialize as `null`.

## Project Layout

```text
.
|-- backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- config/
|   |-- apps/
|   |   `-- requests/
|   |       |-- filters.py
|   |       |-- models.py
|   |       |-- serializers.py
|   |       |-- views.py
|   |       |-- urls.py
|   |       |-- migrations/
|   |       `-- tests/
|   `-- fixtures/
|-- frontend/
|   |-- package.json
|   |-- vite.config.ts
|   `-- src/
|       |-- api/
|       |-- components/
|       |-- lib/
|       `-- App.tsx
|-- docs/
|-- README.md
`-- AGENTS.md
```

## Documentation

- `AGENTS.md` contains repo-specific engineering guidance.
- `docs/stories.md` defines scope, stories, and acceptance criteria.
- `docs/api-spec.md` defines the v1 API contract.
- `docs/architecture.md` explains the backend-first origin and current full-stack architecture.

## AI And Codex Workflow

Codex is expected to work from the documented contract first: read `AGENTS.md`, `docs/stories.md`, `docs/api-spec.md`, and `docs/architecture.md` before changing behavior or structure. Keep changes small, update docs/tests with behavior changes, and avoid adding product scope outside the phase 1 boundaries.

The repo includes `.codex/config.toml` with safe project defaults, expected read-first files, quality gates, scope boundaries, and intended MCP servers. Personal MCP credentials, local tool paths, and machine-specific secrets should stay in the developer's user-level Codex configuration.

Current quality gates:

```powershell
cd backend
python manage.py check
python manage.py test
```

```powershell
cd frontend
npm run build
npm run lint
```

For backend-only changes, run the backend gates. For frontend-only changes, run the frontend gates. For dependency, API contract, or cross-cutting changes, run all gates.

## MCP Setup

The intended MCP setup is deliberately small and high signal:

- Context7 for current framework documentation when working with Django, DRF, React, Vite, Tailwind, and shadcn/ui.
- GitHub MCP for repo-aware workflow, issue context, diffs, and pull request review.
- Playwright MCP planned for frontend validation with browser-level checks and screenshots.

The goal is to improve engineering feedback loops without adding noisy process or product scope.

MCP cannot be fully configured from repository files alone. Each developer still needs to configure their local Codex environment with the actual MCP server commands, credentials, and GitHub authorization. Keep those values out of source control.

## Candidate Codex Skills

These workflows are good candidates for future skills if they repeat, but they are not necessary yet:

- API slice workflow: update the API spec, backend serializers/views/tests, frontend API types, and UI behavior for one contract change.
- UI smoke-check workflow: run frontend gates and capture Playwright screenshots for dashboard layout or interaction changes.
- Dependency audit workflow: check package freshness, consult Context7 upgrade notes, update lockfiles, and run all gates.
