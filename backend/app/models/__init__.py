"""
Pydantic models for data validation and serialization
"""

from .base import (
    BaseResponse,
    PaginatedResponse,
    TimestampMixin,
    FirestoreTimestamp,
)
from .user import (
    User,
    UserCreate,
    UserUpdate,
    UserProfile,
    UserRole,
    UserStatus,
    UserPermissions,
    UserSettings,
    UserStats,
)
from .lead import (
    Lead,
    LeadCreate,
    LeadUpdate,
    LeadStatus,
    LeadScore,
    LeadSource,
    LeadContact,
    LeadActivity,
    LeadInsights,
)
from .company import (
    Company,
    CompanyCreate,
    CompanyUpdate,
    CompanyStatus,
    CompanyHealth,
    CompanySize,
    CompanyContact,
    CompanyActivity,
)
from .task import (
    Task,
    TaskCreate,
    TaskUpdate,
    TaskStatus,
    TaskPriority,
    TaskType,
    TaskComment,
    TaskAttachment,
    TaskSubtask,
)
from .project import (
    Project,
    ProjectCreate,
    ProjectUpdate,
    ProjectStatus,
    ProjectPriority,
    ProjectMember,
    ProjectMilestone,
    ProjectHistory,
)
from .communication import (
    Communication,
    CommunicationCreate,
    CommunicationUpdate,
    CommunicationType,
    CommunicationStatus,
    CommunicationPriority,
)
from .chat import (
    Chat,
    ChatCreate,
    Message,
    MessageCreate,
    ChatType,
    MessageType,
    MessageReaction,
)
from .notification import (
    Notification,
    NotificationCreate,
    NotificationType,
    NotificationPriority,
)
from .analytics import (
    AnalyticsData,
    UserPerformanceMetrics,
    LeadConversionMetrics,
    SalesPipelineMetrics,
    TeamProductivityMetrics,
)
from .territory import (
    Territory,
    TerritoryCreate,
    TerritoryUpdate,
    TerritoryStats,
)
from .ai import (
    AIScore,
    AIInsights,
    AIRecommendation,
    PredictiveAnalytics,
)

__all__ = [
    # Base models
    "BaseResponse",
    "PaginatedResponse",
    "TimestampMixin",
    "FirestoreTimestamp",

    # User models
    "User",
    "UserCreate",
    "UserUpdate",
    "UserProfile",
    "UserRole",
    "UserStatus",
    "UserPermissions",
    "UserSettings",
    "UserStats",

    # Lead models
    "Lead",
    "LeadCreate",
    "LeadUpdate",
    "LeadStatus",
    "LeadScore",
    "LeadSource",
    "LeadContact",
    "LeadActivity",
    "LeadInsights",

    # Company models
    "Company",
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyStatus",
    "CompanyHealth",
    "CompanySize",
    "CompanyContact",
    "CompanyActivity",

    # Task models
    "Task",
    "TaskCreate",
    "TaskUpdate",
    "TaskStatus",
    "TaskPriority",
    "TaskType",
    "TaskComment",
    "TaskAttachment",
    "TaskSubtask",

    # Project models
    "Project",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectStatus",
    "ProjectPriority",
    "ProjectMember",
    "ProjectMilestone",
    "ProjectHistory",

    # Communication models
    "Communication",
    "CommunicationCreate",
    "CommunicationUpdate",
    "CommunicationType",
    "CommunicationStatus",
    "CommunicationPriority",

    # Chat models
    "Chat",
    "ChatCreate",
    "Message",
    "MessageCreate",
    "ChatType",
    "MessageType",
    "MessageReaction",

    # Notification models
    "Notification",
    "NotificationCreate",
    "NotificationType",
    "NotificationPriority",

    # Analytics models
    "AnalyticsData",
    "UserPerformanceMetrics",
    "LeadConversionMetrics",
    "SalesPipelineMetrics",
    "TeamProductivityMetrics",

    # Territory models
    "Territory",
    "TerritoryCreate",
    "TerritoryUpdate",
    "TerritoryStats",

    # AI models
    "AIScore",
    "AIInsights",
    "AIRecommendation",
    "PredictiveAnalytics",
]