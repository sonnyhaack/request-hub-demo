# Repository Guidance

Request Hub Demo is a compact Django REST Framework + React demo for a small internal request management system. It should show fast AI-assisted development while keeping normal engineering standards visible: clear scope, readable code, focused tests, and a polished but intentionally small UI.

This is a demo project, not an MVP and not a production-ready product.

## Working Principles

- Keep the project small, explicit, and reviewable.
- Prefer conventional Django, DRF, React, Vite, Tailwind, and shadcn-style patterns.
- Implement one coherent slice at a time and verify it before moving on.
- Treat `docs/stories.md` and `docs/api-spec.md` as the product/API contract.
- Read `docs/architecture.md` before changing structure, layering, or workflow.
- Do not add production concerns unless the documented scope changes.
- Keep the frontend product-like and professional, not flashy or marketing-oriented.
- Prefer small, direct edits over broad rewrites. If a change crosses backend and frontend, keep the API contract explicit and update docs/tests together.

## Current Structure

```text
.
|-- backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- config/
|   |-- apps/
|   |   `-- requests/
|   |       |-- admin.py
|   |       |-- apps.py
|   |       |-- filters.py
|   |       |-- models.py
|   |       |-- serializers.py
|   |       |-- selectors.py
|   |       |-- services.py
|   |       |-- urls.py
|   |       |-- views.py
|   |       |-- migrations/
|   |       `-- tests/
|   `-- fixtures/
|-- frontend/
|   |-- package.json
|   |-- vite.config.ts
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |   |-- layout/
|   |   |   |-- requests/
|   |   |   `-- ui/
|   |   |-- lib/
|   |   |-- App.tsx
|   |   `-- index.css
|-- docs/
|   |-- api-spec.md
|   |-- architecture.md
|   `-- stories.md
|-- README.md
`-- AGENTS.md
```

Use `filters.py` for explicit API filter parsing. Use `selectors.py` only if read/query logic grows beyond simple view code. Use `services.py` only if write behavior becomes more than serializer validation and save operations.

## Domain Rules

- Status values are only `open`, `in_progress`, and `closed`.
- Priority values are only `low`, `medium`, and `high`.
- New requests default to `status = open` and `priority = medium`.
- Request `title` and `description` are required.
- `requester_name` is optional and serializes as `null` when omitted.
- Comment `author_name` is optional and serializes as `null` when omitted.
- Comment `body` is required.
- Request lists are sorted newest first and are not paginated in v1.
- Request detail responses include nested comments in chronological order.
- `PATCH /api/requests/{id}/` updates only `status` and `priority`; empty PATCH payloads are invalid.

## Backend Guidance

- Use DRF serializers for validation and response shaping.
- Keep views thin: route requests, invoke serializers or focused helpers, and return responses.
- Use explicit serializer fields.
- Use standard status codes: `201` for creates, `200` for reads and updates, `400` for validation errors, and `404` for missing resources.
- Filtering is limited to `status` and `priority`.
- Stay within scope: no authentication, authorization, pagination, soft delete, audit logging, notifications, background jobs, or file uploads.

## Frontend Guidance

- Keep the UI as a single compact dashboard for the existing backend API.
- Use React, Vite, TypeScript, Tailwind, and local shadcn/ui-style components.
- Maintain a clean Nordic SaaS look: light theme, soft grays, restrained blue accents, quiet borders, compact tables, and polished forms.
- Do not add routing, charts, analytics, auth, extra pages, or new product workflows.
- Keep state management simple with local React state and a small fetch-based API layer.
- Make loading, empty, and error states explicit but unobtrusive.
- Preserve table readability and detail-panel clarity; this is an interview demo.

## Testing And Verification

Backend:

```powershell
cd backend
python manage.py check
python manage.py test
```

Frontend:

```powershell
cd frontend
npm run build
npm run lint
```

Before handoff, run the relevant checks for the files touched. For cross-cutting changes, run both backend and frontend verification.

If a check cannot be run because of local environment limits, state the exact command, the failure, and what remains unverified.

## Local Run Commands

Backend:

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

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://127.0.0.1:5173/` and proxies `/api` to `http://127.0.0.1:8000`.

## Process Expectations

- Keep documentation, tests, and behavior aligned.
- Keep changesets small and easy to review.
- Review AI-generated code like any other code.
- Avoid unrelated refactors.
- If the UI is changed, consider whether the first viewport still looks employer-demo ready.
- Use Context7 when framework behavior, current APIs, or version-specific guidance matters.
- Use browser-level validation for meaningful UI layout or interaction changes when Playwright MCP is available.
- Do not create new skills, scripts, or workflow layers unless the same workflow has repeated enough to justify maintenance.

## Codex Workflow Defaults

- Start by reading `AGENTS.md`, `README.md`, `docs/stories.md`, `docs/api-spec.md`, and `docs/architecture.md` when the task affects behavior, structure, or setup.
- Keep `.codex/config.toml` limited to safe project defaults. Do not commit personal MCP credentials, local absolute tool paths, or machine-specific secrets.
- For backend-only work, run `python manage.py check` and `python manage.py test` from `backend/`.
- For frontend-only work, run `npm run build` and `npm run lint` from `frontend/`.
- For dependency, API contract, or full-stack changes, run both backend and frontend gates.
- In handoff notes, separate completed changes from recommended follow-ups and manual environment setup.

## MCP Usage Notes

The intended MCP setup is minimal and high signal:

- Context7 for current framework documentation.
- GitHub MCP for repo-aware workflow and review context.
- Playwright MCP planned for browser-level frontend validation and screenshots.

Use MCP/app tools only when they add concrete value. Reconcile external or generated context with repository files and project scope before changing behavior.

MCP server credentials and install commands belong in the developer's user-level Codex configuration, not in this repository. The repo can document expected servers, but each developer must configure local access.

## Candidate Skills

Do not implement these until the workflow repeats enough to justify them:

- `request-hub-api-slice`: update `docs/api-spec.md`, DRF serializers/views/tests, and frontend API types for one contract change.
- `request-hub-ui-check`: run the frontend quality gates and, when Playwright MCP is available, capture a quick dashboard smoke-test screenshot.
- `request-hub-dependency-audit`: check Django/DRF/npm package freshness, consult Context7 for upgrade notes, update lockfiles, and run all gates.
