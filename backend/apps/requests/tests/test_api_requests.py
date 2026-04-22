from django.test import TestCase
from rest_framework.test import APIClient

from apps.requests.models import Comment, Request


class RequestApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_request_success(self):
        response = self.client.post(
            "/api/requests/",
            {
                "title": "Replace monitor",
                "description": "The monitor flickers.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], Request.STATUS_OPEN)
        self.assertEqual(response.data["priority"], Request.PRIORITY_MEDIUM)
        self.assertIsNone(response.data["requester_name"])
        self.assertEqual(Request.objects.count(), 1)

    def test_create_request_validation_errors(self):
        response = self.client.post("/api/requests/", {}, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)
        self.assertIn("description", response.data)

    def test_create_request_rejects_blank_title(self):
        response = self.client.post(
            "/api/requests/",
            {
                "title": "",
                "description": "The monitor flickers.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)

    def test_create_request_rejects_blank_description(self):
        response = self.client.post(
            "/api/requests/",
            {
                "title": "Replace monitor",
                "description": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("description", response.data)

    def test_create_request_rejects_unknown_fields(self):
        response = self.client.post(
            "/api/requests/",
            {
                "title": "Replace monitor",
                "description": "The monitor flickers.",
                "unexpected": "value",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("unexpected", response.data)

    def test_list_requests_newest_first(self):
        older = Request.objects.create(title="Older", description="Older")
        newer = Request.objects.create(title="Newer", description="Newer")

        response = self.client.get("/api/requests/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [newer.id, older.id])

    def test_filter_requests_by_status(self):
        open_request = Request.objects.create(title="Open", description="Open")
        Request.objects.create(
            title="Closed",
            description="Closed",
            status=Request.STATUS_CLOSED,
        )

        response = self.client.get("/api/requests/?status=open")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [open_request.id])

    def test_filter_requests_by_priority(self):
        high_request = Request.objects.create(
            title="High",
            description="High",
            priority=Request.PRIORITY_HIGH,
        )
        Request.objects.create(title="Medium", description="Medium")

        response = self.client.get("/api/requests/?priority=high")

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [high_request.id])

    def test_filter_requests_by_status_and_priority(self):
        match = Request.objects.create(
            title="Match",
            description="Match",
            status=Request.STATUS_IN_PROGRESS,
            priority=Request.PRIORITY_HIGH,
        )
        Request.objects.create(
            title="Wrong priority",
            description="Wrong priority",
            status=Request.STATUS_IN_PROGRESS,
            priority=Request.PRIORITY_LOW,
        )
        Request.objects.create(
            title="Wrong status",
            description="Wrong status",
            status=Request.STATUS_OPEN,
            priority=Request.PRIORITY_HIGH,
        )

        response = self.client.get(
            "/api/requests/?status=in_progress&priority=high"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [match.id])

    def test_filter_requests_rejects_invalid_values(self):
        response = self.client.get("/api/requests/?status=waiting&priority=urgent")

        self.assertEqual(response.status_code, 400)
        self.assertIn("status", response.data)
        self.assertIn("priority", response.data)

    def test_filter_requests_rejects_blank_status(self):
        response = self.client.get("/api/requests/?status=")

        self.assertEqual(response.status_code, 400)
        self.assertIn("status", response.data)

    def test_filter_requests_rejects_blank_priority(self):
        response = self.client.get("/api/requests/?priority=")

        self.assertEqual(response.status_code, 400)
        self.assertIn("priority", response.data)

    def test_request_detail_includes_comments_chronological(self):
        request = Request.objects.create(title="Request", description="Request")
        first = Comment.objects.create(request=request, body="First")
        second = Comment.objects.create(request=request, body="Second")

        response = self.client.get(f"/api/requests/{request.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [comment["id"] for comment in response.data["comments"]],
            [first.id, second.id],
        )

    def test_patch_request_success(self):
        request = Request.objects.create(title="Request", description="Request")

        response = self.client.patch(
            f"/api/requests/{request.id}/",
            {
                "status": Request.STATUS_IN_PROGRESS,
                "priority": Request.PRIORITY_HIGH,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], Request.STATUS_IN_PROGRESS)
        self.assertEqual(response.data["priority"], Request.PRIORITY_HIGH)

    def test_patch_request_rejects_unsupported_fields(self):
        request = Request.objects.create(title="Request", description="Request")

        response = self.client.patch(
            f"/api/requests/{request.id}/",
            {"title": "New title"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("title", response.data)

    def test_patch_request_rejects_empty_payload(self):
        request = Request.objects.create(title="Request", description="Request")

        response = self.client.patch(
            f"/api/requests/{request.id}/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)

    def test_patch_request_rejects_invalid_values(self):
        request = Request.objects.create(title="Request", description="Request")

        response = self.client.patch(
            f"/api/requests/{request.id}/",
            {"status": "waiting", "priority": "urgent"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("status", response.data)
        self.assertIn("priority", response.data)

    def test_summary_includes_zero_values(self):
        Request.objects.create(title="Open", description="Open")

        response = self.client.get("/api/summary/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {
                "open": 1,
                "in_progress": 0,
                "closed": 0,
            },
        )
