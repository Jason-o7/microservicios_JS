from rest_framework import serializers
from .models import Evento
 
class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id', 'nombre', 'fecha', 'lugar', 'capacidad', 'precio', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] 