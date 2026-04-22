# API Specification

## Overview

Request Hub Demo exposes a small JSON API for internal request management. v1 is intentionally small: no authentication, authorization, pagination, soft delete, audit logging, notifications, background jobs, file uploads, analytics, charts, or extra pages.

Base path: `/api/`

Endpoints:

- `POST /api/requests/`
- `GET /api/requests/`
- `GET /api/requests/{id}/`
- `PATCH /api/requests/{id}/`
- `POST /api/requests/{id}/comments/`
- `GET /api/summary/`

## Domain Model

Request fields:

- `id`: integer, server-generated
- `title`: string, required, non-blank
- `description`: string, required, non-blank
- `requester_name`: string or null, optional
- `status`: string, one of `open`, `in_progress`, `closed`
- `priority`: string, one of `low`, `medium`, `high`
- `created_at`: datetime, server-generated
- `updated_at`: datetime, server-generated

Comment fields:

- `id`: integer, server-generated
- `request`: integer, parent request id
- `author_name`: string or null, optional
- `body`: string, required, non-blank
- `created_at`: datetime, server-generated

Defaults for new requests:

- `status = open`
- `priority = medium`
- omitted `requester_name = null`

## Endpoints

### Create Request

```http
POST /api/requests/
Content-Type: application/json
```

Request body:

```json
{
  "title": "Replace office monitor",
  "description": "The monitor in meeting room 2 flickers during calls.",
  "requester_name": "Alex",
  "priority": "high"
}
```

Response `201 Created`:

```json
{
  "id": 1,
  "title": "Replace office monitor",
  "description": "The monitor in meeting room 2 flickers during calls.",
  "requester_name": "Alex",
  "status": "open",
  "priority": "high",
  "created_at": "2026-04-22T10:15:00Z",
  "updated_at": "2026-04-22T10:15:00Z"
}
```

Validation:

- `title` and `description` are required and non-blank.
- `requester_name`, `status`, and `priority` may be omitted.
- If omitted, `status` is `open` and `priority` is `medium`.
- If omitted, `requester_name` is returned as `null`.
- Provided `status` and `priority` must use allowed values.
- Fields outside the documented request create contract return `400 Bad Request`.

### List Requests

```http
GET /api/requests/
GET /api/requests/?status=open
GET /api/requests/?priority=high
GET /api/requests/?status=in_progress&priority=medium
```

Response `200 OK`:

```json
[
  {
    "id": 2,
    "title": "Create onboarding checklist",
    "description": "HR needs a reusable checklist for new employees.",
    "requester_name": null,
    "status": "in_progress",
    "priority": "medium",
    "created_at": "2026-04-22T11:30:00Z",
    "updated_at": "2026-04-22T11:45:00Z"
  },
  {
    "id": 1,
    "title": "Replace office monitor",
    "description": "The monitor in meeting room 2 flickers during calls.",
    "requester_name": "Alex",
    "status": "open",
    "priority": "high",
    "created_at": "2026-04-22T10:15:00Z",
    "updated_at": "2026-04-22T10:15:00Z"
  }
]
```

Rules:

- Results are sorted newest first by `created_at`.
- v1 list responses are not paginated.
- Optional filters are `status` and `priority`.
- `status` and `priority` filters can be combined.
- Invalid or blank filter values return `400 Bad Request`.

### View Request Details

```http
GET /api/requests/{id}/
```

Response `200 OK`:

```json
{
  "id": 1,
  "title": "Replace office monitor",
  "description": "The monitor in meeting room 2 flickers during calls.",
  "requester_name": "Alex",
  "status": "open",
  "priority": "high",
  "created_at": "2026-04-22T10:15:00Z",
  "updated_at": "2026-04-22T10:15:00Z",
  "comments": [
    {
      "id": 1,
      "request": 1,
      "author_name": "Morgan",
      "body": "Confirmed the issue during the morning standup.",
      "created_at": "2026-04-22T10:30:00Z"
    },
    {
      "id": 2,
      "request": 1,
      "author_name": null,
      "body": "Replacement has been ordered.",
      "created_at": "2026-04-22T11:00:00Z"
    }
  ]
}
```

Rules:

- Detail responses include nested comments.
- Nested comments are sorted chronologically by `created_at`.
- Missing requests return `404 Not Found`.

### Update Request

```http
PATCH /api/requests/{id}/
Content-Type: application/json
```

Request body:

```json
{
  "status": "in_progress",
  "priority": "high"
}
```

Response `200 OK`:

```json
{
  "id": 1,
  "title": "Replace office monitor",
  "description": "The monitor in meeting room 2 flickers during calls.",
  "requester_name": "Alex",
  "status": "in_progress",
  "priority": "high",
  "created_at": "2026-04-22T10:15:00Z",
  "updated_at": "2026-04-22T11:05:00Z"
}
```

Validation:

- Only `status` and `priority` are updateable in v1.
- Empty PATCH payloads return `400 Bad Request`.
- Unknown fields or fields outside the v1 update scope return `400 Bad Request`.
- Invalid `status` or `priority` values return `400 Bad Request`.
- Missing requests return `404 Not Found`.

### Add Comment

```http
POST /api/requests/{id}/comments/
Content-Type: application/json
```

Request body:

```json
{
  "author_name": "Morgan",
  "body": "Replacement has been ordered."
}
```

Response `201 Created`:

```json
{
  "id": 2,
  "request": 1,
  "author_name": "Morgan",
  "body": "Replacement has been ordered.",
  "created_at": "2026-04-22T11:00:00Z"
}
```

Validation:

- `body` is required and non-blank.
- `author_name` may be omitted.
- If omitted, `author_name` is returned as `null`.
- Fields outside the documented comment create contract return `400 Bad Request`.
- Missing requests return `404 Not Found`.

### View Summary Counts

```http
GET /api/summary/
```

Response `200 OK`:

```json
{
  "open": 4,
  "in_progress": 2,
  "closed": 7
}
```

Rules:

- The response includes `open`, `in_progress`, and `closed`.
- Statuses with zero requests are included with a count of `0`.
- Counts reflect all current requests.

## Error Handling

Use DRF's standard error response shape unless a documented project requirement changes this.

Validation error example `400 Bad Request`:

```json
{
  "title": ["This field is required."],
  "description": ["This field is required."]
}
```

Invalid choice example `400 Bad Request`:

```json
{
  "status": ["\"waiting\" is not a valid choice."]
}
```

Not found example `404 Not Found`:

```json
{
  "detail": "Not found."
}
```
