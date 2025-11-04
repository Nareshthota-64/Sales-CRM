# 🚀 Quick Start Guide

Your Firebase backend is pre-configured and ready to run! Here's how to get started immediately.

## ✅ What's Already Configured

- **Firebase Project**: `bde-ai-system`
- **Service Account**: Integrated with proper credentials
- **Database Schema**: Complete Firestore structure
- **Authentication**: Firebase Auth integration
- **API Endpoints**: User management, authentication, and more
- **Environment**: Development configuration ready

## 🏃‍♂️ Run in 3 Simple Steps

### Step 1: Install Redis (Required for Caching)

**MacOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Windows:**
```bash
# Download and install Redis from https://redis.io/download
# Or use WSL2 on Windows
```

**Docker (Alternative):**
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### Step 2: Start the Backend

```bash
cd /workspace/cmhkra330017ttmikblctyr21/AI-Driven-BDE-System/backend

# Make the start script executable
chmod +x start.sh

# Run the backend
./start.sh
```

**Or run manually:**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Verify It's Working

Open your browser and go to:
- **API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/api/docs

You should see:
```json
{
  "message": "AI-Driven BDE System API",
  "version": "1.0.0",
  "docs": "/api/docs",
  "health": "/health"
}
```

## 🔧 Optional: Add Gemini API Key

For AI features, add your Gemini API key to `.env`:

```bash
# Edit the .env file
nano .env

# Replace this line:
GEMINI_API_KEY=your-gemini-api-key-here

# With your actual API key:
GEMINI_API_KEY=your-actual-gemini-api-key
```

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:8000/health
```

### API Documentation
Visit http://localhost:8000/api/docs to explore all endpoints

### Example: User Registration
```bash
# First, create a user in Firebase Auth
# Then register them in your system:

curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "email": "test@example.com",
    "displayName": "Test User",
    "role": "bde"
  }'
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/           # Firebase, Redis, Config
│   ├── models/         # Pydantic data models
│   ├── routers/        # API endpoints
│   ├── middleware/     # Auth, rate limiting
│   └── services/       # Business logic
├── credentials.json    # Firebase service account
├── .env               # Environment variables
├── requirements.txt   # Python dependencies
└── main.py           # FastAPI application
```

## 🔥 Firebase Integration

The backend is fully integrated with your Firebase project:

- **Authentication**: Firebase Auth token verification
- **Firestore**: User profiles, leads, companies, tasks, etc.
- **Storage**: File uploads for avatars and documents
- **Real-time**: Ready for real-time features

## 🎯 Next Steps

1. **Frontend Integration**: Connect your React frontend to these API endpoints
2. **User Management**: Create users via Firebase Auth, then register them in your system
3. **Add AI Features**: Get a Gemini API key for AI-powered insights
4. **Deploy**: Use Docker Compose for production deployment

## 🐛 Troubleshooting

### Firebase Connection Issues
```bash
# Check Firebase credentials
ls -la credentials.json

# Test Firebase connection
python3 -c "from app.core.firebase import initialize_firebase; initialize_firebase()"
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Dependencies Issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📞 Support

If you encounter any issues:

1. Check the console output for error messages
2. Verify Redis is running: `redis-cli ping`
3. Check Firebase credentials in `credentials.json`
4. Review environment variables in `.env`

The backend is now ready to serve your AI-Driven BDE System! 🎉