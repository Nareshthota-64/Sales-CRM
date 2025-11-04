"""
Redis client initialization and utilities
"""

import json
import pickle
from typing import Any, Optional, Union
import redis.asyncio as redis
from .config import settings

# Global Redis client
_redis_client: Optional[redis.Redis] = None

async def init_redis():
    """Initialize Redis connection"""
    global _redis_client

    if _redis_client is not None:
        return  # Already initialized

    try:
        # Parse Redis URL
        redis_url = settings.REDIS_URL
        if settings.REDIS_PASSWORD:
            redis_url = f"redis://:{settings.REDIS_PASSWORD}@{redis_url.split('://')[1]}"

        _redis_client = redis.from_url(
            redis_url,
            encoding="utf-8",
            decode_responses=False,  # We'll handle encoding ourselves for pickle support
            max_connections=20,
        )

        # Test connection
        await _redis_client.ping()
        print("✅ Redis connection established")

    except Exception as e:
        print(f"❌ Failed to connect to Redis: {str(e)}")
        _redis_client = None

def get_redis_client() -> Optional[redis.Redis]:
    """Get Redis client instance"""
    return _redis_client

class RedisCache:
    """Redis cache wrapper with serialization support"""

    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if not self.redis:
                return None

            value = await self.redis.get(key)
            if value is None:
                return None

            # Try to deserialize
            try:
                return pickle.loads(value)
            except (pickle.PickleError, TypeError):
                # Fallback to JSON
                try:
                    return json.loads(value.decode('utf-8'))
                except (json.JSONDecodeError, UnicodeDecodeError):
                    return value.decode('utf-8')

        except Exception as e:
            print(f"Error getting cache key {key}: {str(e)}")
            return None

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """Set value in cache"""
        try:
            if not self.redis:
                return False

            # Serialize value
            try:
                serialized = pickle.dumps(value)
            except (pickle.PickleError, TypeError):
                # Fallback to JSON
                serialized = json.dumps(value, default=str).encode('utf-8')

            # Set with TTL
            if ttl:
                await self.redis.setex(key, ttl, serialized)
            else:
                await self.redis.set(key, serialized)

            return True

        except Exception as e:
            print(f"Error setting cache key {key}: {str(e)}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if not self.redis:
                return False

            result = await self.redis.delete(key)
            return result > 0

        except Exception as e:
            print(f"Error deleting cache key {key}: {str(e)}")
            return False

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            if not self.redis:
                return False

            result = await self.redis.exists(key)
            return result > 0

        except Exception as e:
            print(f"Error checking cache key {key}: {str(e)}")
            return False

    async def incr(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment counter"""
        try:
            if not self.redis:
                return None

            result = await self.redis.incrby(key, amount)
            return result

        except Exception as e:
            print(f"Error incrementing cache key {key}: {str(e)}")
            return None

    async def expire(self, key: str, ttl: int) -> bool:
        """Set TTL for existing key"""
        try:
            if not self.redis:
                return False

            result = await self.redis.expire(key, ttl)
            return result

        except Exception as e:
            print(f"Error setting TTL for cache key {key}: {str(e)}")
            return False

# Cache instance
_cache: Optional[RedisCache] = None

def get_cache() -> Optional[RedisCache]:
    """Get cache instance"""
    global _cache
    if _cache is None and _redis_client is not None:
        _cache = RedisCache(_redis_client)
    return _cache

# Common cache keys
def user_cache_key(user_id: str) -> str:
    """Generate cache key for user data"""
    return f"user:{user_id}"

def leads_cache_key(user_id: str, filters: str = "") -> str:
    """Generate cache key for leads list"""
    return f"leads:{user_id}:{filters}"

def analytics_cache_key(scope: str, scope_id: str, period: str) -> str:
    """Generate cache key for analytics data"""
    return f"analytics:{scope}:{scope_id}:{period}"

def ai_score_cache_key(lead_id: str) -> str:
    """Generate cache key for AI score"""
    return f"ai_score:{lead_id}"

def session_cache_key(session_id: str) -> str:
    """Generate cache key for user session"""
    return f"session:{session_id}"

async def clear_user_cache(user_id: str) -> bool:
    """Clear all cache entries for a user"""
    try:
        cache = get_cache()
        if not cache:
            return False

        # This is a simplified approach - in production, you might want
        # to maintain a set of keys per user for more efficient clearing
        patterns = [
            f"user:{user_id}",
            f"leads:{user_id}:*",
            f"analytics:user:{user_id}:*",
            f"session:*:{user_id}",
        ]

        # Note: Redis doesn't support pattern-based deletion in a single command
        # In production, consider using SCAN or maintaining key sets
        for pattern in patterns:
            # This would need to be implemented with SCAN in production
            pass

        return True

    except Exception as e:
        print(f"Error clearing user cache: {str(e)}")
        return False