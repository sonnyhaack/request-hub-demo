from django.test import TestCase

from apps.requests.models import Comment, Request


class RequestModelTests(TestCase):
    def test_request_defaults(self):
        request = Request.objects.create(
            title="Fix printer",
            description="Printer is jammed.",
        )

        self.assertEqual(request.status, Request.STATUS_OPEN)
        self.assertEqual(request.priority, Request.PRIORITY_MEDIUM)
        self.assertIsNone(request.requester_name)

    def test_requests_order_newest_first(self):
        first = Request.objects.create(title="First", description="First")
        second = Request.objects.create(title="Second", description="Second")

        self.assertEqual(list(Request.objects.all()), [second, first])

    def test_comments_order_chronological(self):
        request = Request.objects.create(title="Request", description="Body")
        first = Comment.objects.create(request=request, body="First")
        second = Comment.objects.create(request=request, body="Second")

        self.assertEqual(list(request.comments.all()), [first, second])
