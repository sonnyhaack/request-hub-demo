from rest_framework import serializers

from .models import Comment, Request


class StrictFieldsMixin:
    def validate(self, attrs):
        unknown_fields = set(self.initial_data) - set(self.fields)
        if unknown_fields:
            errors = {
                field: ["This field is not allowed."]
                for field in sorted(unknown_fields)
            }
            raise serializers.ValidationError(errors)
        return super().validate(attrs)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "request", "author_name", "body", "created_at")
        read_only_fields = ("id", "request", "created_at")


class RequestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = (
            "id",
            "title",
            "description",
            "requester_name",
            "status",
            "priority",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class RequestCreateSerializer(StrictFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = (
            "id",
            "title",
            "description",
            "requester_name",
            "status",
            "priority",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class RequestDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Request
        fields = (
            "id",
            "title",
            "description",
            "requester_name",
            "status",
            "priority",
            "created_at",
            "updated_at",
            "comments",
        )
        read_only_fields = fields


class RequestPatchSerializer(StrictFieldsMixin, serializers.ModelSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        if not attrs:
            raise serializers.ValidationError(
                {"detail": ["At least one of status or priority is required."]}
            )
        return attrs

    class Meta:
        model = Request
        fields = ("status", "priority")


class CommentCreateSerializer(StrictFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "request", "author_name", "body", "created_at")
        read_only_fields = ("id", "request", "created_at")
