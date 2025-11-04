"""
Base Pydantic models
"""

from datetime import datetime
from typing import Any, Dict, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar('T')

class FirestoreTimestamp(BaseModel):
    """Firestore timestamp representation"""
    _seconds: int
    _nanoseconds: int

    @classmethod
    def from_datetime(cls, dt: datetime) -> 'FirestoreTimestamp':
        """Create FirestoreTimestamp from datetime"""
        timestamp = dt.timestamp()
        return cls(_seconds=int(timestamp), _nanoseconds=int((timestamp % 1) * 1e9))

    def to_datetime(self) -> datetime:
        """Convert to datetime"""
        return datetime.fromtimestamp(self._seconds + self._nanoseconds / 1e9)

class TimestampMixin(BaseModel):
    """Mixin for models with timestamps"""
    createdAt: Optional[datetime] = Field(None, description="Creation timestamp")
    updatedAt: Optional[datetime] = Field(None, description="Last update timestamp")
    lastLoginAt: Optional[datetime] = Field(None, description="Last login timestamp")

class BaseResponse(GenericModel, Generic[T]):
    """Base API response model"""
    success: bool = Field(True, description="Request success status")
    data: Optional[T] = Field(None, description="Response data")
    message: Optional[str] = Field(None, description="Response message")
    error: Optional[str] = Field(None, description="Error message if any")

class PaginatedResponse(BaseResponse[List[T]], Generic[T]):
    """Paginated API response model"""
    pagination: Dict[str, Any] = Field(
        default_factory=dict,
        description="Pagination metadata"
    )

    @classmethod
    def create(
        cls,
        data: List[T],
        page: int,
        limit: int,
        total: int,
        has_next: bool = False,
        has_prev: bool = False
    ) -> 'PaginatedResponse[T]':
        """Create paginated response"""
        return cls(
            data=data,
            pagination={
                "page": page,
                "limit": limit,
                "total": total,
                "hasNext": has_next,
                "hasPrev": has_prev,
                "totalPages": (total + limit - 1) // limit,
            }
        )

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool = Field(False, description="Request success status")
    error: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Error details")
    code: Optional[str] = Field(None, description="Error code")

class SuccessResponse(BaseResponse[T], Generic[T]):
    """Success response model"""
    success: bool = Field(True, description="Request success status")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field("healthy", description="Service health status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")
    dependencies: Optional[Dict[str, str]] = Field(None, description="Dependency status")

class FileUploadResponse(BaseModel):
    """File upload response"""
    success: bool = Field(True, description="Upload success status")
    filename: str = Field(..., description="Uploaded filename")
    url: str = Field(..., description="File URL")
    size: int = Field(..., description="File size in bytes")
    mimeType: str = Field(..., description="File MIME type")

class SearchParams(BaseModel):
    """Search parameters model"""
    query: Optional[str] = Field(None, description="Search query")
    filters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Search filters")
    sort: Optional[str] = Field(None, description="Sort field")
    order: Optional[str] = Field("asc", description="Sort order (asc/desc)")

class PaginationParams(BaseModel):
    """Pagination parameters model"""
    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(20, ge=1, le=100, description="Items per page")

class DateRange(BaseModel):
    """Date range model"""
    startDate: Optional[datetime] = Field(None, description="Start date (inclusive)")
    endDate: Optional[datetime] = Field(None, description="End date (inclusive)")

class Coordinates(BaseModel):
    """Geographic coordinates model"""
    latitude: float = Field(..., ge=-90, le=90, description="Latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude")