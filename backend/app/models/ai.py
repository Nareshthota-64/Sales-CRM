"""
AI-related Pydantic models
"""

from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field

class AIScoreCategory(str, Enum):
    """AI score category enumeration"""
    HOT = "Hot"
    WARM = "Warm"
    COLD = "Cold"

class AIInsights(BaseModel):
    """AI-generated insights"""
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
    confidence: float = Field(..., ge=0, le=100, description="AI confidence percentage")

class AIScore(BaseModel):
    """AI scoring model"""
    leadId: str = Field(..., description="Lead ID")
    score: int = Field(..., ge=0, le=100, description="AI score (0-100)")
    category: AIScoreCategory = Field(..., description="Score category")
    confidence: float = Field(..., ge=0, le=100, description="Confidence percentage")
    reasoning: List[str] = Field(default_factory=list, description="Scoring reasoning")
    factors: Dict[str, float] = Field(default_factory=dict, description="Scoring factors")
    timestamp: datetime = Field(..., description="Scoring timestamp")
    modelVersion: str = Field(..., description="AI model version")

class AIRecommendation(BaseModel):
    """AI recommendation model"""
    id: str = Field(..., description="Recommendation ID")
    userId: str = Field(..., description="Target user ID")
    type: str = Field(..., description="Recommendation type")
    title: str = Field(..., description="Recommendation title")
    description: str = Field(..., description="Recommendation description")
    priority: str = Field(..., description="Recommendation priority")
    actionUrl: Optional[str] = Field(None, description="Action URL")
    metadata: Dict[str, any] = Field(default_factory=dict, description="Additional metadata")
    expiresAt: Optional[datetime] = Field(None, description="Expiration timestamp")
    isAccepted: Optional[bool] = Field(None, description="Is recommendation accepted")
    acceptedAt: Optional[datetime] = Field(None, description="Acceptance timestamp")
    createdAt: datetime = Field(..., description="Creation timestamp")

class PredictiveAnalytics(BaseModel):
    """Predictive analytics model"""
    type: str = Field(..., description="Prediction type")
    targetId: Optional[str] = Field(None, description="Target ID (user, lead, company)")
    prediction: Dict[str, any] = Field(..., description="Prediction data")
    confidence: float = Field(..., ge=0, le=100, description="Prediction confidence")
    timeframe: str = Field(..., description="Prediction timeframe")
    factors: Dict[str, float] = Field(default_factory=dict, description="Influencing factors")
    timestamp: datetime = Field(..., description="Prediction timestamp")
    modelVersion: str = Field(..., description="Model version")