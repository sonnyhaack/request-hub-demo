from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import filter_requests
from .models import Request
from .serializers import (
    CommentCreateSerializer,
    RequestCreateSerializer,
    RequestDetailSerializer,
    RequestListSerializer,
    RequestPatchSerializer,
)


class RequestListCreateView(APIView):
    def get(self, request):
        requests = filter_requests(Request.objects.all(), request.query_params)
        serializer = RequestListSerializer(requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request_obj = serializer.save()
        response_serializer = RequestListSerializer(request_obj)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class RequestDetailView(APIView):
    def get(self, request, pk):
        request_obj = get_object_or_404(Request, pk=pk)
        serializer = RequestDetailSerializer(request_obj)
        return Response(serializer.data)

    def patch(self, request, pk):
        request_obj = get_object_or_404(Request, pk=pk)
        serializer = RequestPatchSerializer(
            request_obj,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        request_obj = serializer.save()
        response_serializer = RequestListSerializer(request_obj)
        return Response(response_serializer.data)


class CommentCreateView(APIView):
    def post(self, request, pk):
        request_obj = get_object_or_404(Request, pk=pk)
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(request=request_obj)
        return Response(
            CommentCreateSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )


class SummaryView(APIView):
    def get(self, request):
        counts = dict(
            Request.objects.values_list("status")
            .annotate(total=Count("id"))
            .values_list("status", "total")
        )
        return Response(
            {
                Request.STATUS_OPEN: counts.get(Request.STATUS_OPEN, 0),
                Request.STATUS_IN_PROGRESS: counts.get(
                    Request.STATUS_IN_PROGRESS,
                    0,
                ),
                Request.STATUS_CLOSED: counts.get(Request.STATUS_CLOSED, 0),
            }
        )
