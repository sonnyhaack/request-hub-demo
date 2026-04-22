# Architecture Note

## Direction

Request Hub Demo started backend-first so the API contract, domain model, validation, and tests could be designed before the UI. It now includes a small React dashboard that stays within the implemented backend scope.

This is a professional full-stack demo, not an MVP or production-ready product.

## Why Django And DRF

Django provides a mature foundation for models, migrations, admin tooling, settings, routing, and tests. Django REST Framework adds serializers, validation, API views, routing patterns, and standard response handling.

This stack is suitable because the domain is small but still benefits from established backend conventions.

## Intended Structure

The project should start with a conventional Django layout under `backend/`:

- `config/` for project settings, root URLs, ASGI, and WSGI
- `apps/requests/models.py` for `Request` and `Comment`
- `apps/requests/serializers.py` for input validation and response shapes
- `apps/requests/views.py` for thin API views or viewsets
- `apps/requests/urls.py` for request API routes
- `apps/requests/filters.py` for explicit API filtering if needed
- `apps/requests/selectors.py` reserved for query helpers if read logic grows
- `apps/requests/services.py` reserved for write helpers if behavior outgrows serializer saves
- `apps/requests/tests/` for Django test runner tests

Extra layers should earn their place. Start simple and extract only when the code becomes clearer.

## Principles

- Clarity over cleverness.
- Thin views.
- Explicit serializers.
- Simple query and write helpers when useful.
- Business rules captured in tests.
- Stable JSON responses aligned with `docs/api-spec.md`.
- No v1 scope creep.

## V1 Boundaries

v1 includes request CRUD-like API behavior, comments, filtering, summary counts, and a small frontend dashboard for that API. It does not include authentication, authorization, pagination, soft delete, audit logging, notifications, background jobs, file uploads, analytics, charts, or extra pages.

## Frontend Phase

The frontend is a small React, Vite, TypeScript, Tailwind, and shadcn/ui-style dashboard for the implemented backend API. It intentionally stays within the phase 1 product scope: request list, filters, details, create request, add comment, update status/priority, and summary cards.

The visual direction is a clean Nordic SaaS interface: light theme, soft gray surfaces, restrained blue accents, quiet borders, compact tables, and practical forms. It is not a marketing site and does not add analytics, authentication, routing, charts, or extra pages.

Frontend structure:

- `frontend/src/api/` for typed fetch helpers and API types
- `frontend/src/components/ui/` for local shadcn/ui-style primitives
- `frontend/src/components/layout/` for the app shell
- `frontend/src/components/requests/` for request-specific UI
- `frontend/src/lib/` for shared utilities

## MCP Setup

The intended MCP setup is minimal and high signal:

- Context7 for up-to-date framework documentation.
- GitHub MCP for repo-aware workflow and review context.
- Playwright MCP planned for frontend validation with browser checks and screenshots.

This setup supports AI-assisted engineering without turning the demo into a process-heavy project.
