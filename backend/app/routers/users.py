"""
User management router
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from pydantic import BaseModel

from app.core.firebase import get_user_from_firestore, update_user_in_firestore
from app.core.redis import get_cache
from app.core.config import settings
from app.models.user import (
    User, UserCreate, UserUpdate, UserRole, UserStatus,
    UserSearchFilters, UserRoleUpdate, UserStatsUpdate
)
from app.models.base import PaginatedResponse, PaginationParams
from app.middleware.auth import (
    get_current_user, get_current_user_id,
    RoleBasedAccessControl, require_role
)

router = APIRouter()

class UserListResponse(PaginatedResponse[User]):
    """User list response"""
    pass

class UserUpdateResponse(BaseModel):
    """User update response"""
    success: bool
    user: User = None
    message: str = None

class UserRoleChangeResponse(BaseModel):
    """User role change response"""
    success: bool
    user: User = None
    message: str = None

@router.get("", response_model=UserListResponse)
async def list_users(
    pagination: PaginationParams = Depends(),
    role: Optional[UserRole] = Query(None, description="Filter by role"),
    status_filter: Optional[UserStatus] = Query(None, alias="status", description="Filter by status"),
    department: Optional[str] = Query(None, description="Filter by department"),
    location: Optional[str] = Query(None, description="Filter by location"),
    manager_id: Optional[str] = Query(None, description="Filter by manager"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    current_user: User = Depends(get_current_user)
):
    """
    List users with filtering and pagination
    Requires admin or manager role
    """
    # Check permissions
    if not RoleBasedAccessControl.can_manage_users(current_user.role) and \
       not RoleBasedAccessControl.has_permission(current_user.role, UserRole.MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to list users"
        )

    try:
        from app.core.firebase import get_firestore
        from google.cloud.firestore import Query as FSQuery

        db = get_firestore()
        users_ref = db.collection('users')

        # Apply filters
        if role:
            users_ref = users_ref.where('role', '==', role)
        if status_filter:
            users_ref = users_ref.where('status', '==', status_filter)
        if department:
            users_ref = users_ref.where('profile.department', '==', department)
        if location:
            users_ref = users_ref.where('profile.location', '==', location)
        if manager_id:
            users_ref = users_ref.where('profile.managerId', '==', manager_id)

        # Get total count
        count_query = users_ref
        total_docs = len(list(count_query.stream()))

        # Apply pagination
        users_ref = users_ref.order_by('createdAt', direction=FSQuery.DESCENDING)
        users_ref = users_ref.limit(pagination.limit)
        users_ref = users_ref.offset((pagination.page - 1) * pagination.limit)

        # Execute query
        docs = users_ref.stream()
        users = []

        for doc in docs:
            user_data = doc.to_dict()
            user_data['uid'] = doc.id
            users.append(User(**user_data))

        # Filter by search term (done in memory for simplicity)
        if search:
            search_lower = search.lower()
            users = [
                user for user in users
                if search_lower in user.displayName.lower() or
                search_lower in user.email.lower()
            ]
            total_docs = len(users)  # Update count after search filter

        has_next = pagination.page * pagination.limit < total_docs
        has_prev = pagination.page > 1

        return UserListResponse.create(
            data=users,
            page=pagination.page,
            limit=pagination.limit,
            total=total_docs,
            has_next=has_next,
            has_prev=has_prev
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list users: {str(e)}"
        )

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get user by ID
    Users can only view their own profile unless they have admin/manager permissions
    """
    # Check permissions
    if user_id != current_user.uid and \
       not RoleBasedAccessControl.can_manage_users(current_user.role) and \
       not RoleBasedAccessControl.has_permission(current_user.role, UserRole.MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view user"
        )

    try:
        user_data = await get_user_from_firestore(user_id)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return User(**user_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )

@router.put("/{user_id}", response_model=UserUpdateResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update user profile
    Users can only update their own profile unless they have admin permissions
    """
    # Check permissions
    if user_id != current_user.uid and not RoleBasedAccessControl.can_manage_users(current_user.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to update user"
        )

    # Non-admin users cannot change their role
    if user_update.role is not None and not RoleBasedAccessControl.can_manage_users(current_user.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to change role"
        )

    try:
        # Get existing user
        existing_user = await get_user_from_firestore(user_id)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Prepare update data
        update_data = user_update.dict(exclude_unset=True)
        update_data['updatedAt'] = datetime.utcnow()

        # Update user in Firestore
        success = await update_user_in_firestore(user_id, update_data)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user"
            )

        # Get updated user
        updated_user_data = await get_user_from_firestore(user_id)
        updated_user = User(**updated_user_data)

        # Clear cache
        cache = get_cache()
        if cache:
            from app.core.redis import user_cache_key
            await cache.delete(user_cache_key(user_id))

        return UserUpdateResponse(
            success=True,
            user=updated_user,
            message="User updated successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@router.post("/{user_id}/assign-role", response_model=UserRoleChangeResponse)
async def assign_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Change user role
    Requires admin permissions
    """
    # Check permissions
    if not RoleBasedAccessControl.can_manage_users(current_user.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to assign roles"
        )

    try:
        # Get existing user
        existing_user = await get_user_from_firestore(user_id)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Prepare update data
        update_data = {
            'role': role_update.role,
            'updatedAt': datetime.utcnow(),
        }

        # Update permissions based on new role
        from app.models.user import get_default_permissions
        update_data['permissions'] = get_default_permissions(role_update.role).__dict__

        # Update user in Firestore
        success = await update_user_in_firestore(user_id, update_data)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user role"
            )

        # Get updated user
        updated_user_data = await get_user_from_firestore(user_id)
        updated_user = User(**updated_user_data)

        # Clear cache
        cache = get_cache()
        if cache:
            from app.core.redis import user_cache_key
            await cache.delete(user_cache_key(user_id))

        return UserRoleChangeResponse(
            success=True,
            user=updated_user,
            message=f"User role changed to {role_update.role}"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user role: {str(e)}"
        )

@router.get("/{user_id}/stats")
async def get_user_stats(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get user statistics
    """
    # Check permissions (users can view their own stats, managers can view team stats)
    if user_id != current_user.uid and \
       not RoleBasedAccessControl.has_permission(current_user.role, UserRole.MANAGER):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view user stats"
        )

    try:
        user_data = await get_user_from_firestore(user_id)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {
            "success": True,
            "stats": user_data.get('stats', {})
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user stats: {str(e)}"
        )