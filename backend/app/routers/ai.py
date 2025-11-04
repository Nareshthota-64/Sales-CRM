from fastapi import APIRouter, Depends
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/")
async def list_ai(current_user: User = Depends(get_current_user)):
    return {"message": "ai endpoints - To be implemented"}
