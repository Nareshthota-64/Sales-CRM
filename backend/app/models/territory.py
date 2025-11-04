"""
Territory management Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from .base import TimestampMixin

class TerritoryCreate(BaseModel):
    """Territory creation model"""
    name: str = Field(..., min_length=1, max_length=100, description="Territory name")
    description: Optional[str] = Field(None, max_length=1000, description="Territory description")
    regions: List[str] = Field(default_factory=list, description="Geographic regions")
    postalCodes: List[str] = Field(default_factory=list, description="Postal codes")
    industries: List[str] = Field(default_factory=list, description="Target industries")
    companySizes: List[str] = Field(default_factory=list, description="Target company sizes")
    assignedTo: List[str] = Field(..., min_items=1, description="Assigned user IDs")
    managerId: Optional[str] = Field(None, description="Territory manager ID")
    maxLeads: Optional[int] = Field(None, gt=0, description="Maximum leads")
    maxCompanies: Optional[int] = Field(None, gt=0, description="Maximum companies")
    color: Optional[str] = Field(None, description="Display color")
    tags: List[str] = Field(default_factory=list, description="Territory tags")

class TerritoryUpdate(BaseModel):
    """Territory update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Territory name")
    description: Optional[str] = Field(None, max_length=1000, description="Territory description")
    regions: Optional[List[str]] = Field(None, description="Geographic regions")
    postalCodes: Optional[List[str]] = Field(None, description="Postal codes")
    industries: Optional[List[str]] = Field(None, description="Target industries")
    companySizes: Optional[List[str]] = Field(None, description="Target company sizes")
    assignedTo: Optional[List[str]] = Field(None, min_items=1, description="Assigned user IDs")
    managerId: Optional[str] = Field(None, description="Territory manager ID")
    maxLeads: Optional[int] = Field(None, gt=0, description="Maximum leads")
    maxCompanies: Optional[int] = Field(None, gt=0, description="Maximum companies")
    isActive: Optional[bool] = Field(None, description="Is territory active")
    color: Optional[str] = Field(None, description="Display color")
    tags: Optional[List[str]] = Field(None, description="Territory tags")

class TerritoryStats(BaseModel):
    """Territory statistics"""
    totalLeads: int = Field(0, ge=0, description="Total leads")
    totalCompanies: int = Field(0, ge=0, description="Total companies")
    conversionRate: float = Field(0.0, ge=0, le=100, description="Conversion rate percentage")
    totalARR: float = Field(0.0, ge=0, description="Total Annual Recurring Revenue")
    activeLeads: int = Field(0, ge=0, description="Active leads")
    qualifiedLeads: int = Field(0, ge=0, description="Qualified leads")
    convertedLeads: int = Field(0, ge=0, description="Converted leads")

class Territory(BaseModel, TimestampMixin):
    """Complete territory model"""
    id: str = Field(..., description="Territory ID")
    name: str = Field(..., description="Territory name")
    description: Optional[str] = Field(None, description="Territory description")

    # Geographic
    regions: List[str] = Field(default_factory=list, description="Geographic regions")
    postalCodes: List[str] = Field(default_factory=list, description="Postal codes")

    # Industry/Segment
    industries: List[str] = Field(default_factory=list, description="Target industries")
    companySizes: List[str] = Field(default_factory=list, description="Target company sizes")

    # Assignment
    assignedTo: List[str] = Field(..., description="Assigned user IDs")
    managerId: Optional[str] = Field(None, description="Territory manager ID")

    # Rules & Limits
    maxLeads: Optional[int] = Field(None, description="Maximum leads")
    maxCompanies: Optional[int] = Field(None, description="Maximum companies")

    # Performance
    stats: TerritoryStats = Field(default_factory=TerritoryStats, description="Territory statistics")

    # Status
    isActive: bool = Field(True, description="Is territory active")

    # Metadata
    color: Optional[str] = Field(None, description="Display color")
    tags: List[str] = Field(default_factory=list, description="Territory tags")
    createdBy: str = Field(..., description="Creator user ID")

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

    def to_firestore_dict(self) -> Dict:
        """Convert to Firestore-compatible dictionary"""
        data = self.dict(exclude={"id", "createdAt", "updatedAt"})
        return data