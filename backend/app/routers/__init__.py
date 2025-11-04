"""
API routers for the FastAPI application
"""

from . import auth, users, leads, companies, tasks, projects, communications, chat, notifications, analytics, ai, upload

__all__ = [
    "auth",
    "users",
    "leads",
    "companies",
    "tasks",
    "projects",
    "communications",
    "chat",
    "notifications",
    "analytics",
    "ai",
    "upload"
]