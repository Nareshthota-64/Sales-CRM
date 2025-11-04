#!/usr/bin/env python3
"""
Test script to verify the backend setup is working correctly
"""

import sys
import os
import asyncio
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test if all modules can be imported"""
    print("🔍 Testing imports...")

    try:
        from app.core.config import settings
        print("✅ Config loaded")
    except Exception as e:
        print(f"❌ Config import failed: {e}")
        return False

    try:
        from app.core.firebase import initialize_firebase, get_firestore, get_auth
        print("✅ Firebase modules loaded")
    except Exception as e:
        print(f"❌ Firebase import failed: {e}")
        return False

    try:
        from app.core.redis import get_redis_client
        print("✅ Redis modules loaded")
    except Exception as e:
        print(f"❌ Redis import failed: {e}")
        return False

    try:
        from app.models import User, Lead, Company, Task
        print("✅ Pydantic models loaded")
    except Exception as e:
        print(f"❌ Models import failed: {e}")
        return False

    try:
        from app.routers import auth, users, leads
        print("✅ Routers loaded")
    except Exception as e:
        print(f"❌ Routers import failed: {e}")
        return False

    return True

def test_firebase_connection():
    """Test Firebase connection"""
    print("\n🔥 Testing Firebase connection...")

    try:
        from app.core.firebase import initialize_firebase, get_firestore

        # Initialize Firebase
        initialize_firebase()
        print("✅ Firebase initialized successfully")

        # Test Firestore connection
        db = get_firestore()
        print("✅ Firestore connection established")

        return True

    except Exception as e:
        print(f"❌ Firebase connection failed: {e}")
        return False

def test_redis_connection():
    """Test Redis connection"""
    print("\n📦 Testing Redis connection...")

    try:
        import redis
        from app.core.config import settings

        # Connect to Redis
        r = redis.from_url(settings.REDIS_URL)
        r.ping()
        print("✅ Redis connection established")

        return True

    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("💡 Make sure Redis is running: redis-server")
        return False

def test_fastapi_app():
    """Test FastAPI app creation"""
    print("\n🚀 Testing FastAPI application...")

    try:
        from main import app

        # Test app creation
        assert app.title == "AI-Driven BDE System API"
        print("✅ FastAPI app created successfully")

        # Test routes
        routes = [route.path for route in app.routes]
        expected_routes = ["/", "/health", "/api/docs"]

        for route in expected_routes:
            if route in routes:
                print(f"✅ Route {route} found")
            else:
                print(f"❌ Route {route} missing")
                return False

        return True

    except Exception as e:
        print(f"❌ FastAPI app creation failed: {e}")
        return False

def test_environment():
    """Test environment configuration"""
    print("\n⚙️  Testing environment configuration...")

    # Check if .env file exists
    if os.path.exists('.env'):
        print("✅ .env file exists")
    else:
        print("⚠️  .env file not found, using defaults")

    # Check if credentials file exists
    if os.path.exists('credentials.json'):
        print("✅ Firebase credentials file exists")
    else:
        print("❌ Firebase credentials file missing")
        return False

    return True

async def main():
    """Run all tests"""
    print("🧪 Running Backend Setup Tests\n")
    print("=" * 50)

    tests = [
        test_environment,
        test_imports,
        test_firebase_connection,
        test_redis_connection,
        test_fastapi_app,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if asyncio.iscoroutinefunction(test):
            result = await test()
        else:
            result = test()

        if result:
            passed += 1

        print("-" * 30)

    print(f"\n📊 Test Results: {passed}/{total} passed")

    if passed == total:
        print("🎉 All tests passed! Your backend is ready to run!")
        print("\n🚀 Start the server with:")
        print("   ./start.sh")
        print("   or")
        print("   uvicorn main:app --reload")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())