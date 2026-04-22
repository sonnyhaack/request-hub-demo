# Product Stories

## Purpose

Request Hub Demo is a small internal request management system. It exists to demonstrate a clean Django REST Framework backend, a compact React dashboard, and disciplined AI-assisted development. It is not an MVP or production-ready product.

## Scope

Phase 1 includes:

- Create requests
- List requests
- Filter requests by status and priority
- View request details
- Update request status and priority
- Add comments to requests
- View summary counts by status
- Use a small frontend dashboard for the implemented API

Out of scope:

- Authentication
- Authorization
- Pagination
- Soft delete
- Audit logging
- Notifications
- Background jobs
- File uploads
- Analytics
- Charts
- Extra pages

## Business Rules

- Status values are only `open`, `in_progress`, and `closed`.
- Priority values are only `low`, `medium`, and `high`.
- New requests default to `status = open` and `priority = medium`.
- Request `title` and `description` are required.
- `requester_name` is optional and serializes as `null` when omitted.
- Comment `author_name` is optional and serializes as `null` when omitted.
- Comment `body` is required.
- Request lists are sorted newest first and are not paginated in v1.
- Request detail responses include nested comments in chronological order.

## User Stories

### Create Request

As an internal user, I want to create a request so that work or support needs can be tracked.

Acceptance criteria:

- `POST /api/requests/` creates a request.
- `title` and `description` are required and non-blank.
- `requester_name` may be omitted.
- Omitted `requester_name` is returned as `null`.
- Omitted `status` defaults to `open`.
- Omitted `priority` defaults to `medium`.
- Provided `status` must be `open`, `in_progress`, or `closed`.
- Provided `priority` must be `low`, `medium`, or `high`.
- Successful creation returns the created request.

### List Requests

As an internal user, I want to list requests so that I can see current request activity.

Acceptance criteria:

- `GET /api/requests/` returns all requests.
- Results are sorted newest first.
- The response is not paginated in v1.
- Each item includes the core request fields.

### Filter Requests

As an internal user, I want to filter requests by status and priority so that I can focus on relevant work.

Acceptance criteria:

- `GET /api/requests/?status={status}` filters by status.
- `GET /api/requests/?priority={priority}` filters by priority.
- `status` and `priority` filters can be combined.
- Invalid filter values return validation errors.
- Filtered results remain sorted newest first.

### View Request Details

As an internal user, I want to view a request in detail so that I can understand its current state and discussion.

Acceptance criteria:

- `GET /api/requests/{id}/` returns one request.
- The response includes request detail fields.
- The response includes nested comments in chronological order.
- A missing request returns a not found error.

### Update Request

As an internal user, I want to update request status and priority so that request tracking stays current.

Acceptance criteria:

- `PATCH /api/requests/{id}/` updates a request.
- Only `status` and `priority` are updateable in v1.
- Invalid `status` or `priority` values return validation errors.
- Fields outside the v1 update scope return validation errors.
- A missing request returns a not found error.
- Successful update returns the updated request.

### Add Comment

As an internal user, I want to add a comment to a request so that discussion and updates are captured.

Acceptance criteria:

- `POST /api/requests/{id}/comments/` adds a comment to an existing request.
- Comment `author_name` may be omitted.
- Omitted `author_name` is returned as `null`.
- Comment `body` is required and non-blank.
- A missing request returns a not found error.
- Successful creation returns the created comment.
- The comment appears in request detail responses in chronological order.

### View Summary Counts

As an internal user, I want to view summary counts by status so that I can quickly understand request workload.

Acceptance criteria:

- `GET /api/summary/` returns counts by status.
- The response includes `open`, `in_progress`, and `closed`.
- Statuses with zero requests are included with a count of `0`.
- Counts reflect all current requests.
