"""
Notification Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class NotificationType(str, Enum):
    """Notification type enumeration"""
    TASK_ASSIGNED = "task_assigned"
    LEAD_ASSIGNED = "lead_assigned"
    COMMENT_ADDED = "comment_added"
    MEETING_REMINDER = "meeting_reminder"
    SYSTEM_UPDATE = "system_update"
    MESSAGE_RECEIVED = "message_received"
    PROJECT_UPDATED = "project_updated"
    DEADLINE_APPROACHING = "deadline_approaching"

class NotificationPriority(str, Enum):
    """Notification priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class NotificationCreate(BaseModel):
    """Notification creation model"""
    userId: str = Field(..., description="Recipient user ID")
    title: str = Field(..., min_length=1, max_length=200, description="Notification title")
    body: str = Field(..., min_length=1, max_length=1000, description="Notification body")
    type: NotificationType = Field(..., description="Notification type")
    actionUrl: Optional[str] = Field(None, description="Action deep link URL")
    actionText: Optional[str] = Field(None, description="Action button text")
    priority: NotificationPriority = Field(NotificationPriority.MEDIUM, description="Notification priority")
    data: Dict[str, any] = Field(default_factory=dict, description="Additional notification data")
    expiresAt: Optional[datetime] = Field(None, description="Expiration timestamp")

class Notification(BaseModel):
    """Complete notification model"""
    id: str = Field(..., description="Notification ID")
    userId: str = Field(..., description="Recipient user ID")

    # Content
    title: str = Field(..., description="Notification title")
    body: str = Field(..., description="Notification body")
    type: NotificationType = Field(..., description="Notification type")

    # Action
    actionUrl: Optional[str] = Field(None, description="Action deep link URL")
    actionText: Optional[str] = Field(None, description="Action button text")

    # Status
    isRead: bool = Field(False, description="Is notification read")
    readAt: Optional[datetime] = Field(None, description="Read timestamp")

    # Delivery
    pushSent: bool = Field(False, description="Push notification sent")
    emailSent: bool = Field(False, description="Email notification sent")

    # Metadata
    data: Dict[str, any] = Field(default_factory=dict, description="Additional notification data")
    priority: NotificationPriority = Field(..., description="Notification priority")
    expiresAt: Optional[datetime] = Field(None, description="Expiration timestamp")
    createdAt: datetime = Field(..., description="Creation timestamp")

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }