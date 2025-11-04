"""
Company management router
"""

from fastapi import APIRouter, Depends
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_companies(current_user: User = Depends(get_current_user)):
    return {"message": "Company management endpoints - To be implemented"}