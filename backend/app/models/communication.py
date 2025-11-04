"""
Communication-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field, EmailStr

from .base import TimestampMixin

class CommunicationType(str, Enum):
    """Communication type enumeration"""
    EMAIL = "email"
    MEETING = "meeting"
    CALL = "call"
    NOTE = "note"

class CommunicationStatus(str, Enum):
    """Communication status enumeration"""
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CommunicationPriority(str, Enum):
    """Communication priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class CommunicationCreate(BaseModel):
    """Communication creation model"""
    type: CommunicationType = Field(..., description="Communication type")
    leadId: Optional[str] = Field(None, description="Associated lead ID")
    companyId: Optional[str] = Field(None, description="Associated company ID")
    userIds: List[str] = Field(..., min_items=1, description="Participant user IDs")
    summary: str = Field(..., min_length=1, max_length=1000, description="Communication summary")
    status: CommunicationStatus = Field(CommunicationStatus.SCHEDULED, description="Communication status")
    priority: CommunicationPriority = Field(CommunicationPriority.MEDIUM, description="Communication priority")
    scheduledAt: Optional[datetime] = Field(None, description="Scheduled date/time")
    completedAt: Optional[datetime] = Field(None, description="Completion date/time")
    nextAction: Optional[str] = Field(None, description="Next action")
    nextActionDue: Optional[datetime] = Field(None, description="Next action due date")
    tags: List[str] = Field(default_factory=list, description="Communication tags")

    # Email specific fields
    subject: Optional[str] = Field(None, description="Email subject")
    content: Optional[str] = Field(None, max_length=5000, description="Email content")
    fromEmail: Optional[EmailStr] = Field(None, description="From email")
    toEmails: Optional[List[EmailStr]] = Field(None, description="To email addresses")
    ccEmails: Optional[List[EmailStr]] = Field(None, description="CC email addresses")
    bccEmails: Optional[List[EmailStr]] = Field(None, description="BCC email addresses")

    # Meeting specific fields
    title: Optional[str] = Field(None, description="Meeting title")
    agenda: Optional[str] = Field(None, max_length=2000, description="Meeting agenda")
    location: Optional[str] = Field(None, description="Meeting location")
    meetingLink: Optional[str] = Field(None, description="Meeting link")
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")

    # Call specific fields
    phoneNumber: Optional[str] = Field(None, description="Phone number")
    callType: Optional[str] = Field(None, description="Call type (inbound/outbound)")
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    recordingUrl: Optional[str] = Field(None, description="Call recording URL")

class CommunicationUpdate(BaseModel):
    """Communication update model"""
    type: Optional[CommunicationType] = Field(None, description="Communication type")
    status: Optional[CommunicationStatus] = Field(None, description="Communication status")
    priority: Optional[CommunicationPriority] = Field(None, description="Communication priority")
    summary: Optional[str] = Field(None, min_length=1, max_length=1000, description="Communication summary")
    scheduledAt: Optional[datetime] = Field(None, description="Scheduled date/time")
    completedAt: Optional[datetime] = Field(None, description="Completion date/time")
    nextAction: Optional[str] = Field(None, description="Next action")
    nextActionDue: Optional[datetime] = Field(None, description="Next action due date")
    tags: Optional[List[str]] = Field(None, description="Communication tags")

class Communication(BaseModel, TimestampMixin):
    """Complete communication model"""
    id: str = Field(..., description="Communication ID")
    type: CommunicationType = Field(..., description="Communication type")

    # Association
    leadId: Optional[str] = Field(None, description="Associated lead ID")
    companyId: Optional[str] = Field(None, description="Associated company ID")
    userIds: List[str] = Field(..., description="Participant user IDs")

    # Email Specific
    subject: Optional[str] = Field(None, description="Email subject")
    content: Optional[str] = Field(None, description="Email content")
    fromEmail: Optional[str] = Field(None, description="From email")
    toEmails: Optional[List[str]] = Field(None, description="To email addresses")
    ccEmails: Optional[List[str]] = Field(None, description="CC email addresses")
    bccEmails: Optional[List[str]] = Field(None, description="BCC email addresses")

    # Meeting Specific
    title: Optional[str] = Field(None, description="Meeting title")
    agenda: Optional[str] = Field(None, description="Meeting agenda")
    location: Optional[str] = Field(None, description="Meeting location")
    meetingLink: Optional[str] = Field(None, description="Meeting link")
    duration: Optional[int] = Field(None, description="Duration in minutes")

    # Call Specific
    phoneNumber: Optional[str] = Field(None, description="Phone number")
    callType: Optional[str] = Field(None, description="Call type")
    recordingUrl: Optional[str] = Field(None, description="Call recording URL")

    # Common Fields
    summary: str = Field(..., description="Communication summary")
    status: CommunicationStatus = Field(..., description="Communication status")
    priority: CommunicationPriority = Field(..., description="Communication priority")

    # Timing
    scheduledAt: Optional[datetime] = Field(None, description="Scheduled date/time")
    completedAt: Optional[datetime] = Field(None, description="Completion date/time")

    # Follow-up
    nextAction: Optional[str] = Field(None, description="Next action")
    nextActionDue: Optional[datetime] = Field(None, description="Next action due date")

    # Metadata
    attachments: List[Dict] = Field(default_factory=list, description="Attachments")
    tags: List[str] = Field(default_factory=list, description="Communication tags")
    createdBy: str = Field(..., description="Creator user ID")

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

    def to_firestore_dict(self) -> Dict:
        """Convert to Firestore-compatible dictionary"""
        data = self.dict(exclude={"id", "createdAt", "updatedAt"})
        return data