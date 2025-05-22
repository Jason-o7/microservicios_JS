from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from datetime import datetime

class JWTAuthenticatedUser:
    def __init__(self, payload):
        self.payload = payload
        self.is_authenticated = True
        self.role = payload.get('role')
        self.user_id = payload.get('userId')

    def __str__(self):
        return f"User(role={self.role}, id={self.user_id})"

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Forzar una nueva autenticación en cada petición
        request._cached_user = None
        request._cached_auth = None

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            role = payload.get('role')
            if not role:
                raise AuthenticationFailed('Token does not contain role')
            
            user = JWTAuthenticatedUser(payload)
            return (user, None)
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed('Invalid token')
        except Exception as e:
            raise AuthenticationFailed(str(e))

    def authenticate_header(self, request):
        return 'Bearer' 