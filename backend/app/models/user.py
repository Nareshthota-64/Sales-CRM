"""
User-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field, EmailStr

from .base import TimestampMixin

class UserRole(str, Enum):
    """User role enumeration"""
    BDE = "bde"
    MANAGER = "manager"
    ADMIN = "admin"
    AE = "ae"

class UserStatus(str, Enum):
    """User status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    ONLEAVE = "onleave"

class UserPermissions(BaseModel):
    """User permissions configuration"""
    canViewAllLeads: bool = Field(False, description="Can view all leads")
    canManageUsers: bool = Field(False, description="Can manage users")
    canAccessAnalytics: bool = Field(False, description="Can access analytics")
    canManageTeams: bool = Field(False, description="Can manage teams")
    canAssignLeads: bool = Field(False, description="Can assign leads")
    canViewAllCompanies: bool = Field(False, description="Can view all companies")
    canManageTerritories: bool = Field(False, description="Can manage territories")
    canSendSystemEmails: bool = Field(False, description="Can send system emails")

class UserProfile(BaseModel):
    """User profile information"""
    phone: Optional[str] = Field(None, description="Phone number")
    department: Optional[str] = Field(None, description="Department")
    location: Optional[str] = Field(None, description="Location")
    joinDate: Optional[datetime] = Field(None, description="Join date")
    managerId: Optional[str] = Field(None, description="Manager's user ID")
    bio: Optional[str] = Field(None, description="Professional bio")
    linkedin: Optional[str] = Field(None, description="LinkedIn profile")
    timezone: str = Field("UTC", description="User timezone")

class UserSettings(BaseModel):
    """User settings preferences"""
    emailNotifications: bool = Field(True, description="Email notifications enabled")
    pushNotifications: bool = Field(True, description="Push notifications enabled")
    weeklyDigest: bool = Field(True, description="Weekly digest emails")
    mentionAlerts: bool = Field(True, description="Mention alerts enabled")
    timezone: str = Field("UTC", description="User timezone")
    language: str = Field("en", description="User language")
    theme: str = Field("light", description="UI theme preference")
    dateFormat: str = Field("MM/DD/YYYY", description="Date format preference")

class UserStats(BaseModel):
    """User performance statistics"""
    leadsAssigned: int = Field(0, description="Total leads assigned")
    leadsConverted: int = Field(0, description="Total leads converted")
    conversionRate: float = Field(0.0, description="Conversion rate percentage")
    closedARR: float = Field(0.0, description="Total closed Annual Recurring Revenue")
    tasksCompleted: int = Field(0, description="Total tasks completed")
    meetingsHeld: int = Field(0, description="Total meetings held")
    callsMade: int = Field(0, description="Total calls made")
    responseTime: float = Field(0.0, description="Average response time in hours")

class UserCreate(BaseModel):
    """User creation model"""
    email: EmailStr = Field(..., description="User email")
    displayName: str = Field(..., min_length=1, max_length=100, description="Display name")
    role: UserRole = Field(..., description="User role")
    profile: Optional[UserProfile] = Field(None, description="User profile")
    settings: Optional[UserSettings] = Field(None, description="User settings")
    invitationCode: Optional[str] = Field(None, description="Invitation code for registration")

class UserUpdate(BaseModel):
    """User update model"""
    displayName: Optional[str] = Field(None, min_length=1, max_length=100, description="Display name")
    avatar: Optional[str] = Field(None, description="Avatar URL")
    status: Optional[UserStatus] = Field(None, description="User status")
    profile: Optional[UserProfile] = Field(None, description="User profile")
    settings: Optional[UserSettings] = Field(None, description="User settings")
    role: Optional[UserRole] = Field(None, description="User role")
    managerId: Optional[str] = Field(None, description="Manager's user ID")

class User(BaseModel, TimestampMixin):
    """Complete user model"""
    uid: str = Field(..., description="Firebase Auth UID")
    email: EmailStr = Field(..., description="User email")
    displayName: str = Field(..., description="Display name")
    avatar: Optional[str] = Field(None, description="Avatar URL")
    role: UserRole = Field(..., description="User role")
    status: UserStatus = Field(UserStatus.ACTIVE, description="User status")
    profile: UserProfile = Field(default_factory=UserProfile, description="User profile")
    permissions: UserPermissions = Field(default_factory=UserPermissions, description="User permissions")
    settings: UserSettings = Field(default_factory=UserSettings, description="User settings")
    stats: UserStats = Field(default_factory=UserStats, description="User statistics")

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

    def to_firestore_dict(self) -> Dict:
        """Convert to Firestore-compatible dictionary"""
        data = self.dict(exclude={"uid", "createdAt", "updatedAt", "lastLoginAt"})
        return data

class UserSearchFilters(BaseModel):
    """User search filters"""
    role: Optional[UserRole] = Field(None, description="Filter by role")
    status: Optional[UserStatus] = Field(None, description="Filter by status")
    department: Optional[str] = Field(None, description="Filter by department")
    location: Optional[str] = Field(None, description="Filter by location")
    managerId: Optional[str] = Field(None, description="Filter by manager")
    active: Optional[bool] = Field(None, description="Filter by active status")

class UserRoleUpdate(BaseModel):
    """User role update model"""
    role: UserRole = Field(..., description="New user role")
    reason: str = Field(..., min_length=1, max_length=500, description="Reason for role change")
    updatedBy: str = Field(..., description="User ID making the change")

class UserStatsUpdate(BaseModel):
    """User statistics update model"""
    leadsAssigned: Optional[int] = Field(None, ge=0, description="Leads assigned count")
    leadsConverted: Optional[int] = Field(None, ge=0, description="Leads converted count")
    conversionRate: Optional[float] = Field(None, ge=0, le=100, description="Conversion rate")
    closedARR: Optional[float] = Field(None, ge=0, description="Closed ARR amount")
    tasksCompleted: Optional[int] = Field(None, ge=0, description="Tasks completed count")
    meetingsHeld: Optional[int] = Field(None, ge=0, description="Meetings held count")
    callsMade: Optional[int] = Field(None, ge=0, description="Calls made count")
    responseTime: Optional[float] = Field(None, ge=0, description="Response time in hours")

class UserActivity(BaseModel):
    """User activity log entry"""
    id: str = Field(..., description="Activity ID")
    userId: str = Field(..., description="User ID")
    action: str = Field(..., description="Action performed")
    resource: str = Field(..., description="Resource type")
    resourceId: Optional[str] = Field(None, description="Resource ID")
    details: Optional[Dict] = Field(None, description="Activity details")
    ipAddress: Optional[str] = Field(None, description="IP address")
    userAgent: Optional[str] = Field(None, description="User agent")
    timestamp: datetime = Field(..., description="Activity timestamp")

# Set default permissions based on role
def get_default_permissions(role: UserRole) -> UserPermissions:
    """Get default permissions for a given role"""
    if role == UserRole.ADMIN:
        return UserPermissions(
            canViewAllLeads=True,
            canManageUsers=True,
            canAccessAnalytics=True,
            canManageTeams=True,
            canAssignLeads=True,
            canViewAllCompanies=True,
            canManageTerritories=True,
            canSendSystemEmails=True,
        )
    elif role == UserRole.MANAGER:
        return UserPermissions(
            canViewAllLeads=True,
            canManageUsers=False,
            canAccessAnalytics=True,
            canManageTeams=True,
            canAssignLeads=True,
            canViewAllCompanies=True,
            canManageTerritories=False,
            canSendSystemEmails=False,
        )
    elif role == UserRole.AE:
        return UserPermissions(
            canViewAllLeads=False,
            canManageUsers=False,
            canAccessAnalytics=True,
            canManageTeams=False,
            canAssignLeads=False,
            canViewAllCompanies=False,
            canManageTerritories=False,
            canSendSystemEmails=False,
        )
    else:  # BDE
        return UserPermissions(
            canViewAllLeads=False,
            canManageUsers=False,
            canAccessAnalytics=False,
            canManageTeams=False,
            canAssignLeads=False,
            canViewAllCompanies=False,
            canManageTerritories=False,
            canSendSystemEmails=False,
        )