from django.test import TestCase
from rest_framework.test import APIClient

from apps.requests.models import Comment, Request


class CommentApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.request = Request.objects.create(
            title="Replace monitor",
            description="The monitor flickers.",
        )

    def test_create_comment_success(self):
        response = self.client.post(
            f"/api/requests/{self.request.id}/comments/",
            {"body": "Replacement ordered."},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["request"], self.request.id)
        self.assertEqual(response.data["body"], "Replacement ordered.")
        self.assertIsNone(response.data["author_name"])
        self.assertEqual(Comment.objects.count(), 1)

    def test_create_comment_validation_errors(self):
        response = self.client.post(
            f"/api/requests/{self.request.id}/comments/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("body", response.data)

    def test_create_comment_rejects_blank_body(self):
        response = self.client.post(
            f"/api/requests/{self.request.id}/comments/",
            {"body": ""},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("body", response.data)

    def test_create_comment_rejects_unknown_fields(self):
        response = self.client.post(
            f"/api/requests/{self.request.id}/comments/",
            {
                "body": "Replacement ordered.",
                "unexpected": "value",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("unexpected", response.data)
