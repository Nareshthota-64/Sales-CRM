"""
Company-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field, EmailStr, HttpUrl

from .base import TimestampMixin

class CompanyStatus(str, Enum):
    """Company status enumeration"""
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    CHURNED = "Churned"
    TRIAL = "Trial"
    PROSPECT = "Prospect"

class CompanyHealth(str, Enum):
    """Account health enumeration"""
    HEALTHY = "Healthy"
    NEEDS_ATTENTION = "Needs Attention"
    AT_RISK = "At Risk"

class CompanySize(str, Enum):
    """Company size enumeration"""
    STARTUP = "Startup"
    SMB = "SMB"
    MID_MARKET = "Mid-Market"
    ENTERPRISE = "Enterprise"

class CompanyAddress(BaseModel):
    """Company address information"""
    street: Optional[str] = Field(None, description="Street address")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State/Province")
    country: Optional[str] = Field(None, description="Country")
    zipCode: Optional[str] = Field(None, description="Postal code")

class CompanyContact(BaseModel):
    """Company contact person"""
    name: str = Field(..., min_length=1, max_length=100, description="Contact name")
    role: str = Field(..., min_length=1, max_length=100, description="Contact role")
    email: Optional[EmailStr] = Field(None, description="Contact email")
    phone: Optional[str] = Field(None, description="Contact phone")
    isPrimary: bool = Field(False, description="Is primary contact")
    isDecisionMaker: bool = Field(False, description="Is decision maker")

class CompanyActivity(BaseModel):
    """Company activity log entry"""
    type: str = Field(..., description="Activity type (meeting, call, email, support)")
    summary: str = Field(..., description="Activity summary")
    userId: str = Field(..., description="User who performed the activity")
    timestamp: datetime = Field(..., description="Activity timestamp")
    outcome: Optional[str] = Field(None, description="Activity outcome")

class CompanyCreate(BaseModel):
    """Company creation model"""
    name: str = Field(..., min_length=1, max_length=100, description="Company name")
    description: str = Field(..., min_length=1, max_length=2000, description="Company description")
    website: Optional[HttpUrl] = Field(None, description="Company website")
    industry: Optional[str] = Field(None, description="Industry")
    size: Optional[CompanySize] = Field(None, description="Company size")
    address: Optional[CompanyAddress] = Field(None, description="Company address")
    accountManager: str = Field(..., description="Account manager user ID")
    status: CompanyStatus = Field(CompanyStatus.ACTIVE, description="Company status")
    logo: Optional[str] = Field(None, description="Company logo URL")
    contacts: List[CompanyContact] = Field(default_factory=list, description="Company contacts")
    tags: List[str] = Field(default_factory=list, description="Company tags")
    notes: Optional[str] = Field(None, max_length=2000, description="Company notes")
    sourceLeadId: Optional[str] = Field(None, description="Original lead ID if converted")

class CompanyUpdate(BaseModel):
    """Company update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Company name")
    description: Optional[str] = Field(None, min_length=1, max_length=2000, description="Company description")
    website: Optional[HttpUrl] = Field(None, description="Company website")
    industry: Optional[str] = Field(None, description="Industry")
    size: Optional[CompanySize] = Field(None, description="Company size")
    address: Optional[CompanyAddress] = Field(None, description="Company address")
    accountManager: Optional[str] = Field(None, description="Account manager user ID")
    status: Optional[CompanyStatus] = Field(None, description="Company status")
    logo: Optional[str] = Field(None, description="Company logo URL")
    contacts: Optional[List[CompanyContact]] = Field(None, description="Company contacts")
    tags: Optional[List[str]] = Field(None, description="Company tags")
    notes: Optional[str] = Field(None, max_length=2000, description="Company notes")

class Company(BaseModel, TimestampMixin):
    """Complete company model"""
    id: str = Field(..., description="Company ID")
    name: str = Field(..., description="Company name")
    logo: Optional[str] = Field(None, description="Company logo URL")
    description: str = Field(..., description="Company description")
    website: Optional[str] = Field(None, description="Company website")
    industry: Optional[str] = Field(None, description="Industry")
    size: Optional[CompanySize] = Field(None, description="Company size")

    # Address & Location
    address: CompanyAddress = Field(default_factory=CompanyAddress, description="Company address")

    # Account Management
    accountHealth: CompanyHealth = Field(CompanyHealth.HEALTHY, description="Account health")
    accountManager: str = Field(..., description="Account manager user ID")
    status: CompanyStatus = Field(..., description="Company status")

    # Financial Information
    arr: float = Field(0.0, ge=0, description="Annual Recurring Revenue")
    totalValue: Optional[float] = Field(None, ge=0, description="Total contract value")
    contractStart: Optional[datetime] = Field(None, description="Contract start date")
    contractEnd: Optional[datetime] = Field(None, description="Contract end date")

    # Relationships
    associatedLeads: List[str] = Field(default_factory=list, description="Associated lead IDs")
    contacts: List[CompanyContact] = Field(default_factory=list, description="Company contacts")

    # Activity & Engagement
    lastActivity: Optional[datetime] = Field(None, description="Last activity date")
    activityHistory: List[CompanyActivity] = Field(default_factory=list, description="Activity history")

    # Support & Risk
    supportTickets: int = Field(0, ge=0, description="Open support tickets")
    openDeals: int = Field(0, ge=0, description="Open deals")
    riskFactors: List[str] = Field(default_factory=list, description="Risk factors")

    # Metadata
    tags: List[str] = Field(default_factory=list, description="Company tags")
    notes: Optional[str] = Field(None, description="Company notes")
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

class CompanySearchFilters(BaseModel):
    """Company search filters"""
    status: Optional[CompanyStatus] = Field(None, description="Filter by status")
    accountManager: Optional[str] = Field(None, description="Filter by account manager")
    industry: Optional[str] = Field(None, description="Filter by industry")
    size: Optional[CompanySize] = Field(None, description="Filter by size")
    accountHealth: Optional[CompanyHealth] = Field(None, description="Filter by account health")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    dateRange: Optional[Dict[str, datetime]] = Field(None, description="Date range filter")
    hasOpenDeals: Optional[bool] = Field(None, description="Filter by open deals")
    hasSupportTickets: Optional[bool] = Field(None, description="Filter by support tickets")

class CompanyActivityCreate(BaseModel):
    """Company activity creation model"""
    type: str = Field(..., description="Activity type")
    summary: str = Field(..., min_length=1, max_length=1000, description="Activity summary")
    outcome: Optional[str] = Field(None, max_length=500, description="Activity outcome")

class CompanyMetrics(BaseModel):
    """Company performance metrics"""
    monthlyRevenue: float = Field(0.0, ge=0, description="Monthly revenue")
    customerSatisfaction: float = Field(0.0, ge=0, le=5, description="Customer satisfaction score")
    productUsage: float = Field(0.0, ge=0, le=100, description="Product usage percentage")
    supportResponseTime: float = Field(0.0, ge=0, description="Average support response time (hours)")
    lastPaymentDate: Optional[datetime] = Field(None, description="Last payment date")
    churnRisk: float = Field(0.0, ge=0, le=100, description="Churn risk percentage")

class CompanyUpdateRequest(BaseModel):
    """Company update request model"""
    companyManager: str = Field(..., description="User ID requesting update")
    reason: str = Field(..., min_length=1, max_length=500, description="Reason for update")
    updateData: CompanyUpdate = Field(..., description="Update data to apply")

class BulkCompanyUpdate(BaseModel):
    """Bulk company update model"""
    companyIds: List[str] = Field(..., min_items=1, description="Company IDs to update")
    updateData: CompanyUpdate = Field(..., description="Update data to apply")
    reason: Optional[str] = Field(None, max_length=500, description="Reason for bulk update")