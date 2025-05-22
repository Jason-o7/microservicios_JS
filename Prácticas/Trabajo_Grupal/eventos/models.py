from django.db import models

# Create your models here.

class Evento(models.Model):
    nombre = models.CharField(max_length=200)
    fecha = models.DateTimeField()
    lugar = models.CharField(max_length=200)
    capacidad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

