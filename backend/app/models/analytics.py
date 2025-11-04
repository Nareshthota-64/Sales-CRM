"""
Analytics Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class AnalyticsType(str, Enum):
    """Analytics type enumeration"""
    USER_PERFORMANCE = "user_performance"
    LEAD_CONVERSION = "lead_conversion"
    SALES_PIPELINE = "sales_pipeline"
    TEAM_PRODUCTIVITY = "team_productivity"

class AnalyticsPeriod(str, Enum):
    """Analytics period enumeration"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

class UserPerformanceMetrics(BaseModel):
    """User performance metrics"""
    leadsAssigned: int = Field(0, ge=0, description="Leads assigned")
    leadsConverted: int = Field(0, ge=0, description="Leads converted")
    conversionRate: float = Field(0.0, ge=0, le=100, description="Conversion rate percentage")
    avgResponseTime: float = Field(0.0, ge=0, description="Average response time in hours")
    tasksCompleted: int = Field(0, ge=0, description="Tasks completed")
    meetingsHeld: int = Field(0, ge=0, description="Meetings held")
    callsMade: int = Field(0, ge=0, description="Calls made")
    closedARR: float = Field(0.0, ge=0, description="Closed Annual Recurring Revenue")

class LeadConversionMetrics(BaseModel):
    """Lead conversion metrics"""
    totalLeads: int = Field(0, ge=0, description="Total leads")
    qualifiedLeads: int = Field(0, ge=0, description="Qualified leads")
    convertedLeads: int = Field(0, ge=0, description="Converted leads")
    conversionRate: float = Field(0.0, ge=0, le=100, description="Conversion rate percentage")
    conversionValue: float = Field(0.0, ge=0, description="Total conversion value")
    avgConversionTime: float = Field(0.0, ge=0, description="Average conversion time in days")

class SalesPipelineMetrics(BaseModel):
    """Sales pipeline metrics"""
    pipelineValue: float = Field(0.0, ge=0, description="Total pipeline value")
    dealsInPipeline: int = Field(0, ge=0, description="Number of deals in pipeline")
    avgDealSize: float = Field(0.0, ge=0, description="Average deal size")
    salesCycleLength: float = Field(0.0, ge=0, description="Average sales cycle length in days")
    forecastedRevenue: float = Field(0.0, ge=0, description="Forecasted revenue")

class TeamProductivityMetrics(BaseModel):
    """Team productivity metrics"""
    activeUsers: int = Field(0, ge=0, description="Active users")
    tasksCreated: int = Field(0, ge=0, description="Tasks created")
    tasksCompleted: int = Field(0, ge=0, description="Tasks completed")
    meetingsHeld: int = Field(0, ge=0, description="Meetings held")
    callsMade: int = Field(0, ge=0, description="Calls made")
    emailsSent: int = Field(0, ge=0, description="Emails sent")

class AnalyticsData(BaseModel):
    """Complete analytics data model"""
    id: str = Field(..., description="Analytics ID")
    type: AnalyticsType = Field(..., description="Analytics type")

    # Time Period
    period: AnalyticsPeriod = Field(..., description="Time period")
    date: datetime = Field(..., description="Start of period")

    # Scope
    scope: str = Field(..., description="Scope (user, team, company)")
    scopeId: Optional[str] = Field(None, description="Scope ID")

    # Metrics (structured based on type)
    metrics: Dict[str, any] = Field(..., description="Metrics data")

    # Additional Data
    breakdown: Optional[Dict[str, any]] = Field(None, description="Detailed breakdowns")
    comparisons: Optional[Dict[str, any]] = Field(None, description="Comparisons to previous periods")

    createdAt: datetime = Field(..., description="Creation timestamp")
    updatedAt: datetime = Field(..., description="Last update timestamp")

    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }