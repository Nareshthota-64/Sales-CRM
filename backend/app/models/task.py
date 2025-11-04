"""
Task-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

from .base import TimestampMixin

class TaskStatus(str, Enum):
    """Task status enumeration"""
    TODO = "todo"
    INPROGRESS = "inprogress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TaskPriority(str, Enum):
    """Task priority enumeration"""
    NOT_IMPORTANT = "Not that important"
    MEH = "Meh"
    OK = "OK"
    IMPORTANT = "Important"
    HIGH_PRIORITY = "High Priority"

class TaskType(str, Enum):
    """Task type enumeration"""
    CALL = "call"
    EMAIL = "email"
    MEETING = "meeting"
    FOLLOWUP = "followup"
    ADMIN = "admin"
    OTHER = "other"

class TaskComment(BaseModel):
    """Task comment model"""
    id: str = Field(..., description="Comment ID")
    userId: str = Field(..., description="Comment author user ID")
    text: str = Field(..., min_length=1, max_length=2000, description="Comment text")
    timestamp: datetime = Field(..., description="Comment timestamp")
    isEdited: bool = Field(False, description="Is comment edited")
    editedAt: Optional[datetime] = Field(None, description="Edit timestamp")

class TaskAttachment(BaseModel):
    """Task attachment model"""
    id: str = Field(..., description="Attachment ID")
    filename: str = Field(..., description="Original filename")
    url: str = Field(..., description="File URL")
    uploadedBy: str = Field(..., description="Uploader user ID")
    uploadedAt: datetime = Field(..., description="Upload timestamp")
    size: int = Field(..., ge=0, description="File size in bytes")
    mimeType: str = Field(..., description="File MIME type")

class TaskSubtask(BaseModel):
    """Task subtask model"""
    id: str = Field(..., description="Subtask ID")
    title: str = Field(..., min_length=1, max_length=200, description="Subtask title")
    completed: bool = Field(False, description="Is subtask completed")
    completedBy: Optional[str] = Field(None, description="User who completed subtask")
    completedAt: Optional[datetime] = Field(None, description="Completion timestamp")

class TaskCreate(BaseModel):
    """Task creation model"""
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=2000, description="Task description")
    priority: TaskPriority = Field(TaskPriority.OK, description="Task priority")
    status: TaskStatus = Field(TaskStatus.TODO, description="Task status")
    type: TaskType = Field(TaskType.OTHER, description="Task type")
    assignees: List[str] = Field(..., min_items=1, description="Assigned user IDs")
    dueDate: Optional[datetime] = Field(None, description="Due date")
    estimatedTime: Optional[int] = Field(None, ge=0, description="Estimated time in minutes")
    leadId: Optional[str] = Field(None, description="Associated lead ID")
    companyId: Optional[str] = Field(None, description="Associated company ID")
    projectId: Optional[str] = Field(None, description="Associated project ID")
    tags: List[str] = Field(default_factory=list, description="Task tags")
    isRecurring: bool = Field(False, description="Is recurring task")
    recurringPattern: Optional[str] = Field(None, description="Recurring pattern (daily, weekly, monthly)")
    subtasks: List[TaskSubtask] = Field(default_factory=list, description="Initial subtasks")

class TaskUpdate(BaseModel):
    """Task update model"""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=2000, description="Task description")
    priority: Optional[TaskPriority] = Field(None, description="Task priority")
    status: Optional[TaskStatus] = Field(None, description="Task status")
    type: Optional[TaskType] = Field(None, description="Task type")
    assignees: Optional[List[str]] = Field(None, min_items=1, description="Assigned user IDs")
    dueDate: Optional[datetime] = Field(None, description="Due date")
    estimatedTime: Optional[int] = Field(None, ge=0, description="Estimated time in minutes")
    actualTime: Optional[int] = Field(None, ge=0, description="Actual time spent in minutes")
    leadId: Optional[str] = Field(None, description="Associated lead ID")
    companyId: Optional[str] = Field(None, description="Associated company ID")
    projectId: Optional[str] = Field(None, description="Associated project ID")
    tags: Optional[List[str]] = Field(None, description="Task tags")
    progress: Optional[int] = Field(None, ge=0, le=100, description="Task progress percentage")
    isRecurring: Optional[bool] = Field(None, description="Is recurring task")
    recurringPattern: Optional[str] = Field(None, description="Recurring pattern")

class Task(BaseModel, TimestampMixin):
    """Complete task model"""
    id: str = Field(..., description="Task ID")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")

    # Task Classification
    priority: TaskPriority = Field(..., description="Task priority")
    status: TaskStatus = Field(..., description="Task status")
    type: TaskType = Field(..., description="Task type")

    # Assignment
    assignees: List[str] = Field(..., description="Assigned user IDs")
    assigner: str = Field(..., description="User who created task")

    # Timing
    dueDate: Optional[datetime] = Field(None, description="Due date")
    estimatedTime: Optional[int] = Field(None, description="Estimated time in minutes")
    actualTime: Optional[int] = Field(None, description="Actual time spent in minutes")

    # Relationships
    leadId: Optional[str] = Field(None, description="Associated lead ID")
    companyId: Optional[str] = Field(None, description="Associated company ID")
    projectId: Optional[str] = Field(None, description="Associated project ID")

    # Collaboration
    comments: List[TaskComment] = Field(default_factory=list, description="Task comments")
    attachments: List[TaskAttachment] = Field(default_factory=list, description="Task attachments")

    # Progress Tracking
    progress: int = Field(0, ge=0, le=100, description="Task progress percentage")
    subtasks: List[TaskSubtask] = Field(default_factory=list, description="Task subtasks")

    # Metadata
    tags: List[str] = Field(default_factory=list, description="Task tags")
    isRecurring: bool = Field(False, description="Is recurring task")
    recurringPattern: Optional[str] = Field(None, description="Recurring pattern")
    completedAt: Optional[datetime] = Field(None, description="Completion timestamp")
    completedBy: Optional[str] = Field(None, description="User who completed task")
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

class TaskSearchFilters(BaseModel):
    """Task search filters"""
    status: Optional[TaskStatus] = Field(None, description="Filter by status")
    assignee: Optional[str] = Field(None, description="Filter by assignee")
    priority: Optional[TaskPriority] = Field(None, description="Filter by priority")
    type: Optional[TaskType] = Field(None, description="Filter by type")
    projectId: Optional[str] = Field(None, description="Filter by project")
    leadId: Optional[str] = Field(None, description="Filter by lead")
    companyId: Optional[str] = Field(None, description="Filter by company")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    dateRange: Optional[Dict[str, datetime]] = Field(None, description="Date range filter")
    isOverdue: Optional[bool] = Field(None, description="Filter by overdue tasks")
    hasAttachments: Optional[bool] = Field(None, description="Filter by attachments")
    hasComments: Optional[bool] = Field(None, description="Filter by comments")

class TaskCommentCreate(BaseModel):
    """Task comment creation model"""
    text: str = Field(..., min_length=1, max_length=2000, description="Comment text")
    attachments: Optional[List[TaskAttachment]] = Field(None, description="Comment attachments")

class TaskStatusUpdate(BaseModel):
    """Task status update model"""
    status: TaskStatus = Field(..., description="New task status")
    completedBy: Optional[str] = Field(None, description="User who completed task")
    actualTime: Optional[int] = Field(None, ge=0, description="Actual time spent in minutes")
    notes: Optional[str] = Field(None, max_length=1000, description="Status change notes")

class TaskSubtaskCreate(BaseModel):
    """Task subtask creation model"""
    title: str = Field(..., min_length=1, max_length=200, description="Subtask title")

class TaskSubtaskUpdate(BaseModel):
    """Task subtask update model"""
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Subtask title")
    completed: Optional[bool] = Field(None, description="Is subtask completed")

class BulkTaskUpdate(BaseModel):
    """Bulk task update model"""
    taskIds: List[str] = Field(..., min_items=1, description="Task IDs to update")
    updateData: TaskUpdate = Field(..., description="Update data to apply")
    reason: Optional[str] = Field(None, max_length=500, description="Reason for bulk update")

class KanbanBoard(BaseModel):
    """Kanban board model"""
    userId: str = Field(..., description="User ID")
    todo: List[Task] = Field(default_factory=list, description="To-do tasks")
    inprogress: List[Task] = Field(default_factory=list, description="In-progress tasks")
    completed: List[Task] = Field(default_factory=list, description="Completed tasks")
    cancelled: List[Task] = Field(default_factory=list, description="Cancelled tasks")

class TaskMetrics(BaseModel):
    """Task performance metrics"""
    totalTasks: int = Field(0, ge=0, description="Total tasks")
    completedTasks: int = Field(0, ge=0, description="Completed tasks")
    overdueTasks: int = Field(0, ge=0, description="Overdue tasks")
    completionRate: float = Field(0.0, ge=0, le=100, description="Completion rate percentage")
    avgCompletionTime: float = Field(0.0, ge=0, description="Average completion time in hours")
    tasksByPriority: Dict[str, int] = Field(default_factory=dict, description="Tasks by priority count")
    tasksByType: Dict[str, int] = Field(default_factory=dict, description="Tasks by type count")