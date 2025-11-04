"""
Lead-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field, EmailStr

from .base import TimestampMixin

class LeadStatus(str, Enum):
    """Lead status enumeration"""
    NEW = "New"
    CONTACTED = "Contacted"
    QUALIFIED = "Qualified"
    UNQUALIFIED = "Unqualified"
    CONVERTED = "Converted"
    LOST = "Lost"

class LeadScore(str, Enum):
    """AI lead score categories"""
    HOT = "Hot"
    WARM = "Warm"
    COLD = "Cold"

class LeadSource(str, Enum):
    """Lead source enumeration"""
    WEBINAR = "Webinar"
    COLD_CALL = "Cold Call"
    REFERRAL = "Referral"
    WEBSITE = "Website"
    ADVERTISEMENT = "Advertisement"
    LINKEDIN = "LinkedIn"
    TRADE_SHOW = "Trade Show"
    OTHER = "Other"

class LeadContact(BaseModel):
    """Lead contact information"""
    type: str = Field(..., description="Contact type (email, phone, linkedin)")
    value: str = Field(..., description="Contact value")
    isPrimary: bool = Field(False, description="Is primary contact")

class LeadActivity(BaseModel):
    """Lead activity log entry"""
    type: str = Field(..., description="Activity type (call, email, meeting, note)")
    summary: str = Field(..., description="Activity summary")
    userId: str = Field(..., description="User who performed the activity")
    timestamp: datetime = Field(..., description="Activity timestamp")
    duration: Optional[int] = Field(None, description="Duration in minutes for calls/meetings")
    outcome: Optional[str] = Field(None, description="Activity outcome")
    nextAction: Optional[str] = Field(None, description="Next planned action")

class LeadInsights(BaseModel):
    """AI-generated insights for lead"""
    conversionProbability: float = Field(..., ge=0, le=100, description="Conversion probability percentage")
    recommendedActions: List[str] = Field(default_factory=list, description="Recommended actions")
    similarLeads: List[str] = Field(default_factory=list, description="Similar lead IDs")
    riskFactors: List[str] = Field(default_factory=list, description="Risk factors")
    suggestedFollowUp: Optional[str] = Field(None, description="Suggested follow-up timing")
    optimalContactMethod: Optional[str] = Field(None, description="Optimal contact method")
    estimatedValue: Optional[float] = Field(None, ge=0, description="Estimated deal value")
    competitionLevel: Optional[str] = Field(None, description="Competition level")
    decisionTimeline: Optional[str] = Field(None, description="Decision timeline")
    budgetAwareness: Optional[str] = Field(None, description="Budget awareness level")

class LeadCreate(BaseModel):
    """Lead creation model"""
    name: str = Field(..., min_length=1, max_length=100, description="Lead name")
    email: Optional[EmailStr] = Field(None, description="Lead email")
    phone: Optional[str] = Field(None, description="Lead phone")
    company: str = Field(..., min_length=1, max_length=100, description="Lead company")
    companyLogo: Optional[str] = Field(None, description="Company logo URL")
    jobTitle: Optional[str] = Field(None, description="Job title")
    description: Optional[str] = Field(None, max_length=2000, description="Lead description")
    source: LeadSource = Field(..., description="Lead source")
    status: LeadStatus = Field(LeadStatus.NEW, description="Lead status")
    assignedTo: Optional[str] = Field(None, description="Assigned user ID")
    territory: Optional[str] = Field(None, description="Territory")
    contacts: List[LeadContact] = Field(default_factory=list, description="Contact information")
    tags: List[str] = Field(default_factory=list, description="Lead tags")
    customFields: Dict[str, any] = Field(default_factory=dict, description="Custom fields")

class LeadUpdate(BaseModel):
    """Lead update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="Lead name")
    email: Optional[EmailStr] = Field(None, description="Lead email")
    phone: Optional[str] = Field(None, description="Lead phone")
    company: Optional[str] = Field(None, min_length=1, max_length=100, description="Lead company")
    companyLogo: Optional[str] = Field(None, description="Company logo URL")
    jobTitle: Optional[str] = Field(None, description="Job title")
    description: Optional[str] = Field(None, max_length=2000, description="Lead description")
    status: Optional[LeadStatus] = Field(None, description="Lead status")
    source: Optional[LeadSource] = Field(None, description="Lead source")
    assignedTo: Optional[str] = Field(None, description="Assigned user ID")
    territory: Optional[str] = Field(None, description="Territory")
    contacts: Optional[List[LeadContact]] = Field(None, description="Contact information")
    tags: Optional[List[str]] = Field(None, description="Lead tags")
    customFields: Optional[Dict[str, any]] = Field(None, description="Custom fields")
    nextFollowUp: Optional[datetime] = Field(None, description="Next follow-up date")

class Lead(BaseModel, TimestampMixin):
    """Complete lead model"""
    id: str = Field(..., description="Lead ID")
    name: str = Field(..., description="Lead name")
    email: Optional[EmailStr] = Field(None, description="Lead email")
    phone: Optional[str] = Field(None, description="Lead phone")
    company: str = Field(..., description="Lead company")
    companyLogo: Optional[str] = Field(None, description="Company logo URL")
    jobTitle: Optional[str] = Field(None, description="Job title")
    description: Optional[str] = Field(None, description="Lead description")

    # Lead Status & Scoring
    status: LeadStatus = Field(..., description="Lead status")
    aiScore: LeadScore = Field(..., description="AI score category")
    aiScoreValue: int = Field(..., ge=0, le=100, description="AI score value (0-100)")
    source: LeadSource = Field(..., description="Lead source")

    # Assignment & Ownership
    assignedTo: str = Field(..., description="Assigned user ID")
    assignedBy: str = Field(..., description="User who assigned the lead")
    territory: Optional[str] = Field(None, description="Territory")

    # Contact Information
    contacts: List[LeadContact] = Field(default_factory=list, description="Contact information")

    # Activity Tracking
    lastContact: Optional[datetime] = Field(None, description="Last contact date")
    nextFollowUp: Optional[datetime] = Field(None, description="Next follow-up date")
    contactHistory: List[LeadActivity] = Field(default_factory=list, description="Contact history")

    # AI & Analytics
    aiInsights: Optional[LeadInsights] = Field(None, description="AI-generated insights")

    # Conversion Data
    convertedToCompanyId: Optional[str] = Field(None, description="Converted company ID")
    conversionDate: Optional[datetime] = Field(None, description="Conversion date")
    conversionValue: Optional[float] = Field(None, ge=0, description="Conversion value")

    # Metadata
    tags: List[str] = Field(default_factory=list, description="Lead tags")
    customFields: Dict[str, any] = Field(default_factory=dict, description="Custom fields")
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

class LeadSearchFilters(BaseModel):
    """Lead search filters"""
    status: Optional[LeadStatus] = Field(None, description="Filter by status")
    assignedTo: Optional[str] = Field(None, description="Filter by assigned user")
    source: Optional[LeadSource] = Field(None, description="Filter by source")
    aiScore: Optional[LeadScore] = Field(None, description="Filter by AI score")
    territory: Optional[str] = Field(None, description="Filter by territory")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    dateRange: Optional[Dict[str, datetime]] = Field(None, description="Date range filter")
    hasFollowUp: Optional[bool] = Field(None, description="Filter by follow-up scheduled")
    isConverted: Optional[bool] = Field(None, description="Filter by conversion status")

class LeadActivityCreate(BaseModel):
    """Lead activity creation model"""
    type: str = Field(..., description="Activity type")
    summary: str = Field(..., min_length=1, max_length=1000, description="Activity summary")
    duration: Optional[int] = Field(None, ge=0, description="Duration in minutes")
    outcome: Optional[str] = Field(None, max_length=500, description="Activity outcome")
    nextAction: Optional[str] = Field(None, max_length=500, description="Next planned action")
    nextActionDue: Optional[datetime] = Field(None, description="Next action due date")

class LeadAssignment(BaseModel):
    """Lead assignment model"""
    assignedTo: str = Field(..., description="User ID to assign lead to")
    reason: str = Field(..., min_length=1, max_length=500, description="Assignment reason")
    assignedBy: str = Field(..., description="User ID making assignment")

class LeadConversion(BaseModel):
    """Lead conversion model"""
    companyName: str = Field(..., min_length=1, max_length=100, description="Company name")
    description: str = Field(..., min_length=1, max_length=2000, description="Company description")
    website: Optional[str] = Field(None, description="Company website")
    industry: Optional[str] = Field(None, description="Company industry")
    size: Optional[str] = Field(None, description="Company size")
    estimatedValue: Optional[float] = Field(None, ge=0, description="Estimated deal value")
    conversionDate: datetime = Field(..., description="Conversion date")
    notes: Optional[str] = Field(None, max_length=2000, description="Conversion notes")

class BulkLeadUpdate(BaseModel):
    """Bulk lead update model"""
    leadIds: List[str] = Field(..., min_items=1, description="Lead IDs to update")
    updateData: LeadUpdate = Field(..., description="Update data to apply")
    reason: Optional[str] = Field(None, max_length=500, description="Reason for bulk update")