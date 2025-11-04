"""
Rate limiting middleware
"""

import time
from typing import Dict, Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.redis import get_cache
from app.core.config import settings

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using Redis"""

    def __init__(self, app):
        super().__init__(app)
        self.requests_per_window = settings.RATE_LIMIT_REQUESTS
        self.window_size = settings.RATE_LIMIT_WINDOW  # seconds

        # Different limits for different endpoints
        self.endpoint_limits = {
            "/api/v1/auth/login": (5, 300),  # 5 requests per 5 minutes
            "/api/v1/auth/register": (3, 300),  # 3 requests per 5 minutes
            "/api/v1/upload": (10, 60),  # 10 uploads per minute
            "/api/v1/ai/score-lead": (50, 60),  # 50 AI requests per minute
        }

    async def dispatch(self, request: Request, call_next):
        """Process request and apply rate limiting"""

        # Get client identifier (IP address or user ID if authenticated)
        client_id = await self.get_client_id(request)

        # Get rate limit for this endpoint
        requests_limit, window_size = self.get_limit_for_endpoint(request.url.path)

        # Check rate limit
        if not await self.check_rate_limit(client_id, requests_limit, window_size):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={
                    "X-RateLimit-Limit": str(requests_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time()) + window_size),
                },
            )

        response = await call_next(request)

        # Add rate limit headers
        remaining = await self.get_remaining_requests(client_id, requests_limit, window_size)
        response.headers["X-RateLimit-Limit"] = str(requests_limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time()) + window_size)

        return response

    async def get_client_id(self, request: Request) -> str:
        """Get client identifier for rate limiting"""
        # Use user ID if authenticated, otherwise use IP address
        if hasattr(request.state, 'user_id'):
            return f"user:{request.state.user_id}"

        # Get client IP
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            ip = forwarded_for.split(",")[0].strip()
        else:
            ip = request.client.host

        return f"ip:{ip}"

    def get_limit_for_endpoint(self, path: str) -> tuple:
        """Get rate limit for specific endpoint"""
        # Check exact match first
        if path in self.endpoint_limits:
            return self.endpoint_limits[path]

        # Check prefix match
        for endpoint_path, limit in self.endpoint_limits.items():
            if path.startswith(endpoint_path):
                return limit

        # Default limit
        return self.requests_per_window, self.window_size

    async def check_rate_limit(
        self,
        client_id: str,
        requests_limit: int,
        window_size: int
    ) -> bool:
        """Check if client has exceeded rate limit"""
        cache = get_cache()
        if not cache:
            # If Redis is not available, allow the request
            return True

        current_time = int(time.time())
        window_start = current_time - (current_time % window_size)
        cache_key = f"rate_limit:{client_id}:{window_start}"

        # Get current request count
        current_requests = await cache.get(cache_key) or 0

        if current_requests >= requests_limit:
            return False

        # Increment request count
        await cache.incr(cache_key)
        if current_requests == 0:
            # Set expiration for the first request in window
            await cache.expire(cache_key, window_size)

        return True

    async def get_remaining_requests(
        self,
        client_id: str,
        requests_limit: int,
        window_size: int
    ) -> int:
        """Get remaining requests for client"""
        cache = get_cache()
        if not cache:
            return requests_limit

        current_time = int(time.time())
        window_start = current_time - (current_time % window_size)
        cache_key = f"rate_limit:{client_id}:{window_start}"

        current_requests = await cache.get(cache_key) or 0
        remaining = max(0, requests_limit - current_requests)

        return remaining

class CustomRateLimiter:
    """Custom rate limiter for specific use cases"""

    @staticmethod
    async def limit_by_user(
        user_id: str,
        action: str,
        limit: int,
        window: int
    ) -> bool:
        """Rate limit by user and action"""
        cache = get_cache()
        if not cache:
            return True

        current_time = int(time.time())
        window_start = current_time - (current_time % window)
        cache_key = f"user_limit:{user_id}:{action}:{window_start}"

        current_count = await cache.get(cache_key) or 0
        if current_count >= limit:
            return False

        await cache.incr(cache_key)
        if current_count == 0:
            await cache.expire(cache_key, window)

        return True

    @staticmethod
    async def limit_by_ip(
        ip: str,
        action: str,
        limit: int,
        window: int
    ) -> bool:
        """Rate limit by IP and action"""
        cache = get_cache()
        if not cache:
            return True

        current_time = int(time.time())
        window_start = current_time - (current_time % window)
        cache_key = f"ip_limit:{ip}:{action}:{window_start}"

        current_count = await cache.get(cache_key) or 0
        if current_count >= limit:
            return False

        await cache.incr(cache_key)
        if current_count == 0:
            await cache.expire(cache_key, window)

        return True

    @staticmethod
    async def limit_by_endpoint(
        endpoint: str,
        limit: int,
        window: int
    ) -> bool:
        """Rate limit by endpoint globally"""
        cache = get_cache()
        if not cache:
            return True

        current_time = int(time.time())
        window_start = current_time - (current_time % window)
        cache_key = f"endpoint_limit:{endpoint}:{window_start}"

        current_count = await cache.get(cache_key) or 0
        if current_count >= limit:
            return False

        await cache.incr(cache_key)
        if current_count == 0:
            await cache.expire(cache_key, window)

        return True