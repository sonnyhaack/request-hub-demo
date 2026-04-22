from django.urls import path

from .views import (
    CommentCreateView,
    RequestDetailView,
    RequestListCreateView,
    SummaryView,
)


app_name = "requests"

urlpatterns = [
    path("requests/", RequestListCreateView.as_view(), name="request-list"),
    path("requests/<int:pk>/", RequestDetailView.as_view(), name="request-detail"),
    path(
        "requests/<int:pk>/comments/",
        CommentCreateView.as_view(),
        name="comment-create",
    ),
    path("summary/", SummaryView.as_view(), name="summary"),
]
