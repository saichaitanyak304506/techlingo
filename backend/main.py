"""
TechLingo Backend - FastAPI Application
A Code Vocabulary Builder API

To run:
1. Install dependencies: pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib
2. Run: uvicorn main:app --reload
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
import logging

from database import engine, get_db, Base
from models import User, Term, GameSession, UserProgress
from schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    TermCreate, TermResponse, TermListResponse,
    GameStartRequest, GameQuestionResponse, AnswerSubmit, AnswerResult,
    GameSessionResponse, ProgressResponse, LeaderboardEntry
)
from auth import (
    create_access_token, verify_token, get_password_hash, verify_password
)
from seed_data import seed_terms

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="TechLingo API",
    description="Code Vocabulary Builder Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Dependency to get current user
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user


# ==================== AUTH ENDPOINTS ====================

@app.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@app.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse.model_validate(current_user)


@app.post("/auth/logout")
async def logout():
    """Logout user (client should discard token)"""
    return {"message": "Logged out successfully"}


# ==================== TERMS ENDPOINTS ====================

@app.get("/terms", response_model=list[TermResponse])
async def get_terms(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all terms, optionally filtered by category or difficulty"""
    query = db.query(Term)
    
    if category:
        query = query.filter(Term.category == category)
    if difficulty:
        query = query.filter(Term.difficulty == difficulty)
    
    terms = query.all()
    return [TermResponse.model_validate(t) for t in terms]


@app.get("/terms/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Get list of all unique categories"""
    categories = db.query(Term.category).distinct().all()
    return [c[0] for c in categories]


@app.get("/terms/search", response_model=list[TermResponse])
async def search_terms(q: str, db: Session = Depends(get_db)):
    """Search terms by name or definition"""
    terms = db.query(Term).filter(
        (Term.name.ilike(f"%{q}%")) | (Term.definition.ilike(f"%{q}%"))
    ).all()
    return [TermResponse.model_validate(t) for t in terms]


@app.get("/terms/{term_id}", response_model=TermResponse)
async def get_term(term_id: int, db: Session = Depends(get_db)):
    """Get a specific term by ID"""
    term = db.query(Term).filter(Term.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    return TermResponse.model_validate(term)


# ==================== GAME ENDPOINTS ====================

@app.post("/game/start", response_model=GameSessionResponse)
async def start_game(
    request: GameStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a new game session"""
    session = GameSession(
        user_id=current_user.id,
        category=request.category,
        difficulty=request.difficulty,
        total_questions=5
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return GameSessionResponse.model_validate(session)


@app.get("/game/{session_id}/question", response_model=GameQuestionResponse)
async def get_question(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the next question for a game session"""
    import random
    
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    if session.completed:
        raise HTTPException(status_code=400, detail="Game session already completed")
    
    # Get terms for question
    query = db.query(Term)
    if session.category:
        query = query.filter(Term.category == session.category)
    if session.difficulty:
        query = query.filter(Term.difficulty == session.difficulty)
    
    terms = query.all()
    if len(terms) < 4:
        raise HTTPException(status_code=400, detail="Not enough terms for quiz")
    
    # Pick a random term as the correct answer
    correct_term = random.choice(terms)
    
    # Get 3 wrong options
    wrong_terms = [t for t in terms if t.id != correct_term.id]
    random.shuffle(wrong_terms)
    wrong_options = [t.name for t in wrong_terms[:3]]
    
    # Combine and shuffle options
    options = wrong_options + [correct_term.name]
    random.shuffle(options)
    
    return GameQuestionResponse(
        id=session.correct_answers + session.total_questions,  # Simple question ID
        term_id=correct_term.id,
        definition=correct_term.definition,
        code_example=correct_term.code_example,
        real_world_example=correct_term.real_world_example,
        options=options,
        correct_answer=correct_term.name,
        category=correct_term.category,
        difficulty=correct_term.difficulty
    )


@app.post("/game/{session_id}/answer", response_model=AnswerResult)
async def submit_answer(
    session_id: int,
    answer: AnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit an answer for a question"""
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    # Get the term
    term = db.query(Term).filter(Term.id == answer.question_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    is_correct = answer.answer == term.name
    xp_earned = 0
    
    if is_correct:
        session.correct_answers += 1
        xp_earned = 10  # Base XP
        
        # Update user XP
        current_user.total_xp += xp_earned
        db.commit()
    
    return AnswerResult(
        correct=is_correct,
        correct_answer=term.name,
        xp_earned=xp_earned,
        explanation=term.real_world_example
    )


@app.post("/game/{session_id}/end", response_model=GameSessionResponse)
async def end_game(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """End a game session"""
    from datetime import datetime
    
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session.completed = True
    session.completed_at = datetime.utcnow()
    
    # Calculate final XP
    accuracy = session.correct_answers / session.total_questions if session.total_questions > 0 else 0
    bonus_xp = int(accuracy * 20)  # Bonus based on accuracy
    session.xp_earned = (session.correct_answers * 10) + bonus_xp
    
    # Update user total XP
    current_user.total_xp += bonus_xp
    
    db.commit()
    db.refresh(session)
    
    return GameSessionResponse.model_validate(session)


@app.get("/game/history", response_model=list[GameSessionResponse])
async def get_game_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's game session history"""
    sessions = db.query(GameSession).filter(
        GameSession.user_id == current_user.id
    ).order_by(GameSession.started_at.desc()).limit(20).all()
    
    return [GameSessionResponse.model_validate(s) for s in sessions]


# ==================== PROGRESS ENDPOINTS ====================

@app.get("/progress", response_model=ProgressResponse)
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's learning progress"""
    total_terms = db.query(Term).count()
    
    # Calculate stats from game sessions
    sessions = db.query(GameSession).filter(
        GameSession.user_id == current_user.id,
        GameSession.completed == True
    ).all()
    
    total_correct = sum(s.correct_answers for s in sessions)
    total_questions = sum(s.total_questions for s in sessions)
    accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    # Get completed categories
    completed_categories = []
    categories = db.query(Term.category).distinct().all()
    for (cat,) in categories:
        cat_terms = db.query(Term).filter(Term.category == cat).count()
        # Consider category complete if user has answered 80% correctly
        if total_correct >= cat_terms * 0.8:
            completed_categories.append(cat)
    
    return ProgressResponse(
        user_id=current_user.id,
        terms_learned=min(total_correct, total_terms),
        total_terms=total_terms,
        accuracy_rate=round(accuracy, 1),
        categories_completed=completed_categories,
        recent_terms=[]
    )


@app.get("/progress/leaderboard", response_model=list[LeaderboardEntry])
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get top users by XP"""
    users = db.query(User).order_by(User.total_xp.desc()).limit(limit).all()
    
    return [
        LeaderboardEntry(
            rank=i + 1,
            username=user.username,
            total_xp=user.total_xp,
            current_streak=user.current_streak
        )
        for i, user in enumerate(users)
    ]


# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Seed database with initial terms on startup"""
    db = next(get_db())
    try:
        # Check if terms exist
        if db.query(Term).count() == 0:
            logger.info("Seeding database with initial terms...")
            seed_terms(db)
            logger.info("Database seeded successfully!")
    finally:
        db.close()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "TechLingo API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
