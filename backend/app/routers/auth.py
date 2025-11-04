"""
Authentication router
"""

from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr

from app.core.firebase import verify_firebase_token, create_user_in_firestore, update_user_in_firestore
from app.core.redis import get_cache
from app.core.config import settings
from app.models.user import User, UserCreate, UserRole, get_default_permissions
from app.middleware.auth import get_current_user, get_current_user_id

router = APIRouter()

class TokenVerificationRequest(BaseModel):
    """Token verification request"""
    token: str

class TokenVerificationResponse(BaseModel):
    """Token verification response"""
    success: bool
    user: User = None
    message: str = None

class UserRegistrationRequest(BaseModel):
    """User registration request"""
    email: EmailStr
    displayName: str
    role: UserRole = UserRole.BDE
    invitationCode: str = None

class UserRegistrationResponse(BaseModel):
    """User registration response"""
    success: bool
    user: User = None
    message: str = None

@router.post("/verify-token", response_model=TokenVerificationResponse)
async def verify_token(
    request: TokenVerificationRequest,
    http_request: Request
):
    """
    Verify Firebase ID token and return user profile
    """
    try:
        # Verify the Firebase token
        token_data = await verify_firebase_token(request.token)

        # Get user from Firestore
        from app.core.firebase import get_user_from_firestore
        user_data = await get_user_from_firestore(token_data["uid"])

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in system"
            )

        # Update last login
        await update_user_in_firestore(token_data["uid"], {
            "lastLoginAt": datetime.utcnow(),
        })

        # Cache user data
        cache = get_cache()
        if cache:
            from app.core.redis import user_cache_key
            await cache.set(
                user_cache_key(token_data["uid"]),
                user_data,
                ttl=settings.CACHE_TTL_USER
            )

        # Convert to User model
        user = User(**user_data)

        return TokenVerificationResponse(
            success=True,
            user=user,
            message="Token verified successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        return TokenVerificationResponse(
            success=False,
            message=f"Token verification failed: {str(e)}"
        )

@router.post("/register", response_model=UserRegistrationResponse)
async def register_user(
    request: UserRegistrationRequest,
    http_request: Request
):
    """
    Register a new user in the system (after Firebase authentication)
    """
    try:
        # TODO: Verify invitation code if provided
        # TODO: Check if this is the first user (make them admin)

        # Get user ID from the authenticated request
        if not hasattr(http_request.state, 'user_id'):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )

        user_id = http_request.state.user_id

        # Check if user already exists
        existing_user = await get_user_from_firestore(user_id)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already registered"
            )

        # Create user data
        user_data = {
            "uid": user_id,
            "email": request.email,
            "displayName": request.displayName,
            "role": request.role,
            "status": "active",
            "profile": {
                "joinDate": datetime.utcnow(),
                "timezone": "UTC",
            },
            "permissions": get_default_permissions(request.role).__dict__,
            "settings": {
                "emailNotifications": True,
                "pushNotifications": True,
                "weeklyDigest": True,
                "mentionAlerts": True,
                "timezone": "UTC",
                "language": "en",
                "theme": "light",
            },
            "stats": {
                "leadsAssigned": 0,
                "leadsConverted": 0,
                "conversionRate": 0.0,
                "closedARR": 0.0,
                "tasksCompleted": 0,
                "meetingsHeld": 0,
                "callsMade": 0,
                "responseTime": 0.0,
            },
            "createdBy": user_id,
        }

        # Create user in Firestore
        success = await create_user_in_firestore(user_id, user_data)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )

        # Get created user
        created_user = await get_user_from_firestore(user_id)
        user = User(**created_user)

        return UserRegistrationResponse(
            success=True,
            user=user,
            message="User registered successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(
    current_user: User = Depends(get_current_user)
):
    """
    Refresh user data and permissions
    """
    try:
        # Get fresh user data from Firestore
        from app.core.firebase import get_user_from_firestore
        user_data = await get_user_from_firestore(current_user.uid)

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update cache
        cache = get_cache()
        if cache:
            from app.core.redis import user_cache_key
            await cache.set(
                user_cache_key(current_user.uid),
                user_data,
                ttl=settings.CACHE_TTL_USER
            )

        user = User(**user_data)

        return {
            "success": True,
            "user": user,
            "message": "Token refreshed successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@router.post("/logout")
async def logout(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Logout user and clear cached data
    """
    try:
        # Clear user cache
        cache = get_cache()
        if cache:
            from app.core.redis import user_cache_key, clear_user_cache
            await clear_user_cache(current_user.uid)

        return {
            "success": True,
            "message": "Logged out successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile
    """
    return {
        "success": True,
        "user": current_user
    }