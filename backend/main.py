"""
TechLingo Backend - FastAPI Application
A Code Vocabulary Builder API
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional, List
import logging
from datetime import datetime
import random

from database import engine, get_db, Base
from models import User, Term, GameSession, UserProgress
from schemas import (
    UserCreate, UserLogin, UserResponse, TokenResponse,
    TermResponse,
    GameStartRequest, GameQuestionResponse, AnswerSubmit, AnswerResult,
    GameSessionResponse, ProgressResponse, LeaderboardEntry
)
from auth import (
    create_access_token, verify_token, get_password_hash, verify_password
)
from seed_data import seed_terms

# -------------------- LOGGING --------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------- DB INIT --------------------
Base.metadata.create_all(bind=engine)

# -------------------- APP INIT --------------------
app = FastAPI(
    title="TechLingo API",
    description="Code Vocabulary Builder Backend",
    version="1.0.0"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# =================================================
# AUTH HELPERS
# =================================================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# =================================================
# AUTH ENDPOINTS
# =================================================

@app.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@app.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

# =================================================
# TERMS
# =================================================

@app.get("/terms", response_model=List[TermResponse])
async def get_terms(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Term)

    if category:
        query = query.filter(Term.category == category)

    if difficulty:
        query = query.filter(Term.difficulty == difficulty)

    terms = query.all()
    return [TermResponse.model_validate(t) for t in terms]

# =================================================
# GAME
# =================================================

@app.post("/game/start", response_model=GameSessionResponse)
async def start_game(
    request: GameStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = GameSession(
        user_id=current_user.id,
        category=request.category,
        difficulty=request.difficulty,
        total_questions=5,
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
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()

    if session is None:
        raise HTTPException(status_code=404, detail="Game session not found")

    completed = session.completed
    if completed:
        raise HTTPException(status_code=400, detail="Game already completed")

    query = db.query(Term)

    category = session.category
    difficulty = session.difficulty

    if category:
        query = query.filter(Term.category == category)
    if difficulty:
        query = query.filter(Term.difficulty == difficulty)

    terms = query.all()
    if len(terms) < 4:
        raise HTTPException(status_code=400, detail="Not enough terms")

    correct_term = random.choice(terms)
    correct_id = correct_term.id

    wrong_terms = [t for t in terms if t.id != correct_id]
    random.shuffle(wrong_terms)

    options = [t.name for t in wrong_terms[:3]] + [correct_term.name]
    random.shuffle(options)

    return GameQuestionResponse(
        id=int(session.correct_answers + session.total_questions),
        term_id=int(correct_id),
        definition=str(correct_term.definition),
        code_example=correct_term.code_example,
        real_world_example=str(correct_term.real_world_example),
        options=list(options),
        correct_answer=str(correct_term.name),
        category=str(correct_term.category),
        difficulty=str(correct_term.difficulty),
    )

@app.post("/game/{session_id}/answer", response_model=AnswerResult)
async def submit_answer(
    session_id: int,
    answer: AnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()

    if session is None:
        raise HTTPException(status_code=404, detail="Game session not found")

    term = db.query(Term).filter(Term.id == int(answer.term_id)).first()
    if term is None:
        raise HTTPException(status_code=404, detail="Term not found")

    is_correct = answer.answer == term.name
    xp_earned = 0

    # --- USER PROGRESS ---
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.term_id == term.id
    ).first()

    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            term_id=term.id,
            times_seen=0,
            times_correct=0,
        )
        db.add(progress)

    progress.times_seen += 1

    if is_correct:
        progress.times_correct += 1
        session.correct_answers += 1
        xp_earned = 10
        current_user.total_xp += xp_earned
        current_user.current_streak += 1

        if progress.times_correct >= 3:
            progress.mastered = True
    else:
        current_user.current_streak = 0

    db.commit()
    db.refresh(progress)
    db.refresh(current_user)
    db.refresh(session)


    return AnswerResult(
        correct=is_correct,
        correct_answer=term.name,
        xp_earned=xp_earned,
        explanation=term.real_world_example,
    )

@app.post("/game/{session_id}/end", response_model=GameSessionResponse)
async def end_game(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(GameSession).filter(
        GameSession.id == session_id,
        GameSession.user_id == current_user.id
    ).first()

    if session is None:
        raise HTTPException(status_code=404, detail="Game session not found")

    session.completed = True
    session.completed_at = datetime.utcnow()

    correct = int(session.correct_answers)
    total = int(session.total_questions)

    accuracy = (correct / total) if total > 0 else 0.0
    bonus_xp = int(accuracy * 20)

    session.xp_earned = (correct * 10) + bonus_xp
    current_user.total_xp = int(current_user.total_xp) + bonus_xp

    db.commit()
    db.refresh(session)

    return GameSessionResponse.model_validate(session)

# =================================================
# PROGRESS
# =================================================

@app.get("/progress", response_model=ProgressResponse)
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_terms = db.query(Term).count()

    progress_rows = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()

    terms_learned = sum(1 for p in progress_rows if p.mastered)

    accuracy = (
        sum(p.times_correct for p in progress_rows) /
        max(sum(p.times_seen for p in progress_rows), 1)
    ) * 100

    categories_completed = []

    return ProgressResponse(
        user_id=current_user.id,
        terms_learned=terms_learned,
        total_terms=total_terms,
        accuracy_rate=round(accuracy, 1),
        categories_completed=categories_completed,
        recent_terms=[],
    )

# =================================================
# LEADERBOARD
# =================================================

@app.get("/progress/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.total_xp.desc()).limit(limit).all()

    return [
        LeaderboardEntry(
            rank=i + 1,
            username=str(user.username),
            total_xp=int(user.total_xp),
            current_streak=int(user.current_streak),
        )
        for i, user in enumerate(users)
    ]

# =================================================
# STARTUP
# =================================================

@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    try:
        if db.query(Term).count() == 0:
            seed_terms(db)
    finally:
        db.close()

@app.get("/health")
async def health():
    return {"status": "ok"}
