"""
Project-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

from .base import TimestampMixin

class ProjectStatus(str, Enum):
    """Project status enumeration"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"
    ON_HOLD = "on_hold"

class ProjectPriority(str, Enum):
    """Project priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ProjectMember(BaseModel):
    """Project member model"""
    userId: str = Field(..., description="User ID")
    role: str = Field(..., description="Member role (owner, lead, contributor, viewer)")
    joinedAt: datetime = Field(..., description="Join timestamp")

class ProjectMilestone(BaseModel):
    """Project milestone model"""
    id: str = Field(..., description="Milestone ID")
    title: str = Field(..., min_length=1, max_length=200, description="Milestone title")
    dueDate: datetime = Field(..., description="Due date")
    completed: bool = Field(False, description="Is milestone completed")
    completedAt: Optional[datetime] = Field(None, description="Completion timestamp")

class ProjectHistory(BaseModel):
    """Project history entry model"""
    userId: str = Field(..., description="User ID")
    action: str = Field(..., description="Action performed")
    details: str = Field(..., description="Action details")
    timestamp: datetime = Field(..., description="Action timestamp")

class ProjectCreate(BaseModel):
    """Project creation model"""
    name: str = Field(..., min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, max_length=2000, description="Project description")
    label: str = Field(..., min_length=1, max_length=100, description="Project label")
    status: ProjectStatus = Field(ProjectStatus.ACTIVE, description="Project status")
    priority: ProjectPriority = Field(ProjectPriority.MEDIUM, description="Project priority")
    members: List[ProjectMember] = Field(..., min_items=1, description="Initial project members")
    startDate: Optional[datetime] = Field(None, description="Start date")
    endDate: Optional[datetime] = Field(None, description="End date")
    estimatedBudget: Optional[float] = Field(None, ge=0, description="Estimated budget")
    tags: List[str] = Field(default_factory=list, description="Project tags")
    isPublic: bool = Field(True, description="Is project public")

class ProjectUpdate(BaseModel):
    """Project update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, max_length=2000, description="Project description")
    label: Optional[str] = Field(None, min_length=1, max_length=100, description="Project label")
    status: Optional[ProjectStatus] = Field(None, description="Project status")
    priority: Optional[ProjectPriority] = Field(None, description="Project priority")
    startDate: Optional[datetime] = Field(None, description="Start date")
    endDate: Optional[datetime] = Field(None, description="End date")
    estimatedBudget: Optional[float] = Field(None, ge=0, description="Estimated budget")
    actualCost: Optional[float] = Field(None, ge=0, description="Actual cost")
    progress: Optional[int] = Field(None, ge=0, le=100, description="Project progress")
    tags: Optional[List[str]] = Field(None, description="Project tags")
    isPublic: Optional[bool] = Field(None, description="Is project public")

class Project(BaseModel, TimestampMixin):
    """Complete project model"""
    id: str = Field(..., description="Project ID")
    name: str = Field(..., description="Project name")
    description: Optional[str] = Field(None, description="Project description")
    label: str = Field(..., description="Project label")

    # Project Management
    status: ProjectStatus = Field(..., description="Project status")
    priority: ProjectPriority = Field(..., description="Project priority")

    # Team & Permissions
    members: List[ProjectMember] = Field(..., description="Project members")

    # Progress Tracking
    progress: int = Field(0, ge=0, le=100, description="Project progress percentage")
    startDate: Optional[datetime] = Field(None, description="Start date")
    endDate: Optional[datetime] = Field(None, description="End date")
    estimatedBudget: Optional[float] = Field(None, ge=0, description="Estimated budget")
    actualCost: Optional[float] = Field(None, ge=0, description="Actual cost")

    # Tasks & Milestones
    tasks: List[str] = Field(default_factory=list, description="Associated task IDs")
    milestones: List[ProjectMilestone] = Field(default_factory=list, description="Project milestones")

    # Activity History
    history: List[ProjectHistory] = Field(default_factory=list, description="Project history")

    # Metadata
    tags: List[str] = Field(default_factory=list, description="Project tags")
    isPublic: bool = Field(True, description="Is project public")
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