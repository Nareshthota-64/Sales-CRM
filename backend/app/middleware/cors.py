"""
CORS middleware configuration
"""

from typing import List
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

class CORSMiddleware(BaseHTTPMiddleware):
    """Custom CORS middleware with additional security headers"""

    def __init__(self, app):
        super().__init__(app)
        self.allowed_origins = settings.ALLOWED_ORIGINS
        self.allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
        self.allowed_headers = [
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "User-Agent",
            "DNT",
            "Cache-Control",
            "X-Mx-ReqToken",
            "Keep-Alive",
            "X-Requested-With",
            "If-Modified-Since",
            "X-CSRF-Token",
        ]

    async def dispatch(self, request: Request, call_next):
        """Process request and add CORS headers"""

        origin = request.headers.get("Origin")
        response = await call_next(request)

        # Add CORS headers
        if self.is_allowed_origin(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
        else if "*" in self.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = "*"

        response.headers["Access-Control-Allow-Methods"] = ", ".join(self.allowed_methods)
        response.headers["Access-Control-Allow-Headers"] = ", ".join(self.allowed_headers)
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Max-Age"] = "86400"  # 24 hours

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Handle preflight requests
        if request.method == "OPTIONS":
            response.headers["Access-Control-Allow-Origin"] = origin if self.is_allowed_origin(origin) else "*"
            return Response(
                content="",
                status_code=200,
                headers=dict(response.headers),
            )

        return response

    def is_allowed_origin(self, origin: str) -> bool:
        """Check if origin is allowed"""
        if not origin:
            return False

        return (
            "*" in self.allowed_origins or
            origin in self.allowed_origins or
            any(origin.endswith(allowed) for allowed in self.allowed_origins if allowed.startswith("*"))
        )