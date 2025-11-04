"""
Authentication middleware for Firebase token verification
"""

import time
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.firebase import verify_firebase_token, get_user_from_firestore
from app.core.redis import get_cache
from app.core.config import settings
from app.models.user import UserRole

class AuthMiddleware(BaseHTTPMiddleware):
    """Authentication middleware for Firebase token verification"""

    def __init__(self, app):
        super().__init__(app)
        self.security = HTTPBearer(auto_error=False)
        # Public paths that don't require authentication
        self.public_paths = {
            "/",
            "/health",
            "/api/v1/auth/verify-token",
            "/api/v1/auth/register",
            "/api/docs",
            "/api/redoc",
            "/api/openapi.json",
        }

    async def dispatch(self, request: Request, call_next):
        """Process request and verify authentication"""

        # Skip authentication for public paths
        if request.url.path in self.public_paths:
            return await call_next(request)

        # Skip authentication for OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        try:
            # Extract token from Authorization header
            credentials: Optional[HTTPAuthorizationCredentials] = await self.security(request)

            if not credentials or not credentials.credentials:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authorization token required",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            token = credentials.credentials

            # Check cache first
            cache = get_cache()
            cache_key = f"auth_token:{token}"

            if cache:
                cached_user = await cache.get(cache_key)
                if cached_user:
                    # Add user to request state
                    request.state.user = cached_user
                    request.state.user_id = cached_user.get("uid")
                    return await call_next(request)

            # Verify Firebase token
            token_data = await verify_firebase_token(token)

            # Get user from Firestore
            user_data = await get_user_from_firestore(token_data["uid"])

            if not user_data:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found in system",
                )

            # Check if user is active
            if user_data.get("status") == "inactive":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is inactive",
                )

            # Update last login time
            await self.update_last_login(user_data["uid"])

            # Cache user data
            if cache:
                await cache.set(
                    cache_key,
                    user_data,
                    ttl=settings.CACHE_TTL_USER
                )

            # Add user to request state
            request.state.user = user_data
            request.state.user_id = user_data.get("uid")
            request.state.user_role = user_data.get("role")

            return await call_next(request)

        except HTTPException:
            raise
        except Exception as e:
            # Log error for debugging
            print(f"Authentication error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def update_last_login(self, user_id: str):
        """Update user's last login timestamp"""
        try:
            from app.core.firebase import get_firestore
            from google.cloud.firestore import SERVER_TIMESTAMP

            db = get_firestore()
            user_ref = db.collection('users').document(user_id)
            user_ref.update({
                'lastLoginAt': SERVER_TIMESTAMP,
                'updatedAt': SERVER_TIMESTAMP,
            })
        except Exception as e:
            # Don't fail the request if we can't update last login
            print(f"Failed to update last login: {str(e)}")

class RoleBasedAccessControl:
    """Role-based access control utilities"""

    # Role hierarchy (higher number = more permissions)
    ROLE_HIERARCHY = {
        UserRole.BDE: 0,
        UserRole.AE: 1,
        UserRole.MANAGER: 2,
        UserRole.ADMIN: 3,
    }

    @classmethod
    def has_permission(cls, user_role: UserRole, required_role: UserRole) -> bool:
        """Check if user role has required permissions"""
        return cls.ROLE_HIERARCHY.get(user_role, 0) >= cls.ROLE_HIERARCHY.get(required_role, 0)

    @classmethod
    def can_access_all_leads(cls, user_role: UserRole) -> bool:
        """Check if user can access all leads"""
        return user_role in [UserRole.MANAGER, UserRole.ADMIN]

    @classmethod
    def can_manage_users(cls, user_role: UserRole) -> bool:
        """Check if user can manage other users"""
        return user_role == UserRole.ADMIN

    @classmethod
    def can_access_analytics(cls, user_role: UserRole) -> bool:
        """Check if user can access analytics"""
        return user_role in [UserRole.MANAGER, UserRole.ADMIN, UserRole.AE]

    @classmethod
    def can_assign_leads(cls, user_role: UserRole) -> bool:
        """Check if user can assign leads"""
        return user_role in [UserRole.MANAGER, UserRole.ADMIN]

    @classmethod
    def can_manage_territories(cls, user_role: UserRole) -> bool:
        """Check if user can manage territories"""
        return user_role == UserRole.ADMIN

    @classmethod
    def can_send_system_emails(cls, user_role: UserRole) -> bool:
        """Check if user can send system emails"""
        return user_role == UserRole.ADMIN

def require_role(required_role: UserRole):
    """Decorator to require specific role for endpoint"""
    def decorator(func):
        async def wrapper(request: Request, *args, **kwargs):
            if not hasattr(request.state, 'user'):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required",
                )

            user_role = request.state.user.get("role")
            if not RoleBasedAccessControl.has_permission(user_role, required_role):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Insufficient permissions. Required role: {required_role}",
                )

            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def get_current_user(request: Request):
    """Get current user from request state"""
    if not hasattr(request.state, 'user'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return request.state.user

def get_current_user_id(request: Request) -> str:
    """Get current user ID from request state"""
    if not hasattr(request.state, 'user_id'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return request.state.user_id

def get_current_user_role(request: Request) -> UserRole:
    """Get current user role from request state"""
    if not hasattr(request.state, 'user_role'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    return request.state.user_role