"""
Chat and messaging Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

from .base import TimestampMixin

class ChatType(str, Enum):
    """Chat type enumeration"""
    DIRECT = "direct"
    GROUP = "group"

class MessageType(str, Enum):
    """Message type enumeration"""
    TEXT = "text"
    FILE = "file"
    IMAGE = "image"
    SYSTEM = "system"

class MessageReaction(BaseModel):
    """Message reaction model"""
    emoji: str = Field(..., description="Emoji reaction")
    userIds: List[str] = Field(default_factory=list, description="User IDs who reacted")

class MessageCreate(BaseModel):
    """Message creation model"""
    text: str = Field(..., min_length=1, max_length=4000, description="Message text")
    type: MessageType = Field(MessageType.TEXT, description="Message type")
    replyTo: Optional[str] = Field(None, description="Reply to message ID")
    attachments: Optional[List[Dict]] = Field(None, description="Message attachments")

class Message(BaseModel):
    """Complete message model"""
    id: str = Field(..., description="Message ID")
    senderId: str = Field(..., description="Sender user ID")
    text: str = Field(..., description="Message text")
    type: MessageType = Field(..., description="Message type")

    # File Attachments
    attachments: Optional[List[Dict]] = Field(None, description="File attachments")

    # Message Status
    isEdited: bool = Field(False, description="Is message edited")
    editedAt: Optional[datetime] = Field(None, description="Edit timestamp")
    isDeleted: bool = Field(False, description="Is message deleted")
    deletedAt: Optional[datetime] = Field(None, description="Deletion timestamp")

    # Reactions
    reactions: List[MessageReaction] = Field(default_factory=list, description="Message reactions")

    # Replies
    replyTo: Optional[str] = Field(None, description="Reply to message ID")

    timestamp: datetime = Field(..., description="Message timestamp")

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ChatCreate(BaseModel):
    """Chat creation model"""
    type: ChatType = Field(..., description="Chat type")
    participants: List[str] = Field(..., min_items=1, description="Participant user IDs")
    name: Optional[str] = Field(None, description="Chat name (for group chats)")
    description: Optional[str] = Field(None, max_length=500, description="Chat description")
    avatar: Optional[str] = Field(None, description="Chat avatar URL")

class Chat(BaseModel, TimestampMixin):
    """Complete chat model"""
    id: str = Field(..., description="Chat ID")
    type: ChatType = Field(..., description="Chat type")

    # Participants
    participants: List[str] = Field(..., description="Participant user IDs")
    participantNames: Dict[str, str] = Field(default_factory=dict, description="Participant display names")

    # Group Chat Specific
    name: Optional[str] = Field(None, description="Chat name")
    description: Optional[str] = Field(None, description="Chat description")
    avatar: Optional[str] = Field(None, description="Chat avatar URL")

    # Message Management
    lastMessage: Optional[Dict] = Field(None, description="Last message info")
    unreadCounts: Dict[str, int] = Field(default_factory=dict, description="Unread count per user")

    # Metadata
    isArchived: bool = Field(False, description="Is chat archived")
    archivedBy: List[str] = Field(default_factory=list, description="Users who archived chat")
    pinnedBy: List[str] = Field(default_factory=list, description="Users who pinned chat")
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