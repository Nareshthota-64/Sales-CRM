from fastapi import APIRouter, Depends
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_communications(current_user: User = Depends(get_current_user)):
    return {"message": "communications endpoints - To be implemented"}
