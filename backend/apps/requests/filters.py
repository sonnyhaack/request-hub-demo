from rest_framework.exceptions import ValidationError

from .models import Request


def filter_requests(queryset, query_params):
    status = query_params.get("status")
    priority = query_params.get("priority")

    errors = {}

    if "status" in query_params and status not in dict(Request.STATUS_CHOICES):
        errors["status"] = ["Select a valid choice."]

    if "priority" in query_params and priority not in dict(Request.PRIORITY_CHOICES):
        errors["priority"] = ["Select a valid choice."]

    if errors:
        raise ValidationError(errors)

    if status:
        queryset = queryset.filter(status=status)

    if priority:
        queryset = queryset.filter(priority=priority)

    return queryset
