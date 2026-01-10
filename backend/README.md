# TechLingo Backend

FastAPI backend for the Code Vocabulary Builder application.

## Quick Start

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Terms
- `GET /terms` - Get all terms (with optional category/difficulty filters)
- `GET /terms/categories` - Get list of categories
- `GET /terms/search?q=query` - Search terms
- `GET /terms/{id}` - Get term by ID

### Game
- `POST /game/start` - Start new game session
- `GET /game/{session_id}/question` - Get next question
- `POST /game/{session_id}/answer` - Submit answer
- `POST /game/{session_id}/end` - End game session
- `GET /game/history` - Get user's game history

### Progress
- `GET /progress` - Get user progress
- `GET /progress/leaderboard` - Get leaderboard

## Database

Uses SQLite (`techlingo.db`) for simplicity. The database is auto-created on first run and seeded with initial terms.

## Environment Variables

For production, set:
- `SECRET_KEY` - JWT secret key (change from default!)

## Project Structure

```
backend/
├── main.py          # FastAPI application & routes
├── database.py      # Database configuration
├── models.py        # SQLAlchemy ORM models
├── schemas.py       # Pydantic schemas
├── auth.py          # Authentication utilities
├── seed_data.py     # Initial data seeding
├── requirements.txt # Python dependencies
└── README.md        # This file
```
