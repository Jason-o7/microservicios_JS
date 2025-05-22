1. python -m venv venv
2. .\venv\Scripts\activate
3. pip install django djangorestframework python-dotenv
4. django-admin startproject API_Rest_con_Django
5. cd .\API_Rest_con_Django\
6. python manage.py startapp api
7. Añadir en settings.py
    
    'rest_framework',
    'api',

   Dentro de installed apps

8. En models.py
    # Create your models here.
    class Libro(models.Model):
    id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200)
    fecha_publicacion = models.DateField()

    def __str__(self):
        return self.titulo

9. python manage.py makemigrations

10. python manage.py migrate

11. Creamos el serializer

12. En views definimos los endpoints

13. Después creamos urls.py

14. por ultimo en la carpeta del proyecto "API_Rest_con_Django" en urls incluimos el path de app

15. python manage.py runserver
http://127.0.0.1:8000/api/libros/
http://127.0.0.1:8000/api/libros/crear/
http://127.0.0.1:8000/api/libros/1

16. 

---

1. pip install djangorestframework-simplejwt
2. 'rest_framework_simplejwt', en settings.py
3. 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

