from django.contrib import admin

from .models import Comment, Request


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "status",
        "priority",
        "requester_name",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "priority", "created_at")
    search_fields = ("title", "description", "requester_name")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "request", "author_name", "created_at")
    list_filter = ("created_at",)
    search_fields = ("body", "author_name", "request__title")
    readonly_fields = ("created_at",)
