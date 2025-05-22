from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Evento
from .serializers import EventoSerializer
from .permissions import IsAdminOrReadOnly

# Create your views here.

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
