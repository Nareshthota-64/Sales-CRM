# AI-Driven BDE System Backend

FastAPI-based backend for the AI-Driven Business Development Executive management system.

## Features

- **Firebase Authentication**: Secure user authentication with Firebase
- **Role-Based Access Control**: Admin, Manager, AE, and BDE roles
- **Lead Management**: AI-powered lead scoring and management
- **Company Management**: Account management and health tracking
- **Task Management**: Kanban-style task organization
- **Real-time Chat**: WebSocket-based messaging
- **AI Integration**: Google Gemini API for insights and scoring
- **Analytics**: Comprehensive performance analytics
- **File Upload**: Firebase Storage integration
- **Rate Limiting**: Redis-based rate limiting
- **Caching**: Redis caching for performance

## Technology Stack

- **FastAPI**: Modern Python web framework
- **Firebase Admin SDK**: Authentication and Firestore database
- **Redis**: Caching and rate limiting
- **Google Gemini API**: AI-powered features
- **Docker**: Containerization
- **Pydantic**: Data validation and serialization

## Quick Start

### Prerequisites

- Python 3.11+
- Redis server
- Firebase project
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Driven-BDE-System/backend
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Download service account credentials
   - Place credentials file as `credentials.json`

4. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

   **Or run locally:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

5. **Access API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/api/docs
   - ReDoc: http://localhost:8000/api/redoc

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_CREDENTIALS_PATH` | Path to credentials file | Yes |
| `REDIS_URL` | Redis connection URL | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SECRET_KEY` | Application secret key | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | Yes |

### Firebase Setup

1. **Enable Services**
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

2. **Configure Security Rules**
   ```javascript
   // Firestore security rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // User can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Admin can access all data
       match /{document=**} {
         allow read, write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/verify-token` - Verify Firebase token
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/refresh` - Refresh user data
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - List users (Admin/Manager)
- `GET /api/v1/users/{user_id}` - Get user details
- `PUT /api/v1/users/{user_id}` - Update user profile
- `POST /api/v1/users/{user_id}/assign-role` - Change user role (Admin)

### Leads
- `GET /api/v1/leads` - List leads
- `POST /api/v1/leads` - Create lead
- `GET /api/v1/leads/{lead_id}` - Get lead details
- `PUT /api/v1/leads/{lead_id}` - Update lead

### Companies
- `GET /api/v1/companies` - List companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies/{company_id}` - Get company details

### Tasks
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/kanban/{user_id}` - Get kanban board

### AI Features
- `POST /api/v1/ai/score-lead` - Score lead with AI
- `POST /api/v1/ai/insights/{lead_id}` - Get AI insights
- `GET /api/v1/ai/recommendations` - Get recommendations

## Development

### Project Structure
```
backend/
├── app/
│   ├── core/           # Core functionality (Firebase, Redis, Config)
│   ├── models/         # Pydantic models
│   ├── routers/        # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── ai/             # AI services
│   └── utils/          # Utilities
├── tests/              # Test files
├── main.py             # FastAPI application
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker configuration
└── docker-compose.yml  # Docker Compose setup
```

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Code Style
This project uses:
- Black for code formatting
- isort for import sorting
- mypy for type checking

## Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Set production environment
export FASTAPI_ENV=production

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Security

- **Authentication**: Firebase ID tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: Redis-based rate limiting
- **CORS**: Configured for specific origins
- **Input Validation**: Pydantic models for all inputs
- **Security Headers**: XSS protection, content type options

## Monitoring

### Health Check
- `GET /health` - Application health status

### Logging
- Structured logging with JSON format
- Sentry integration for error tracking
- Configurable log levels

### Metrics
- Prometheus metrics available
- Request/response tracking
- Error rate monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the logs for troubleshooting