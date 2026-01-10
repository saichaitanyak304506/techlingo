"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    total_xp: int
    current_streak: int
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ==================== TERM SCHEMAS ====================

class TermCreate(BaseModel):
    name: str = Field(..., max_length=100)
    definition: str
    category: str = Field(..., max_length=50)
    difficulty: str = Field(default="beginner")
    code_example: Optional[str] = None
    real_world_example: str


class TermResponse(BaseModel):
    id: int
    name: str
    definition: str
    category: str
    difficulty: str
    code_example: Optional[str]
    real_world_example: str
    created_at: datetime

    class Config:
        from_attributes = True


class TermListResponse(BaseModel):
    terms: List[TermResponse]
    total: int


# ==================== GAME SCHEMAS ====================

class GameStartRequest(BaseModel):
    category: Optional[str] = None
    difficulty: Optional[str] = None


class GameQuestionResponse(BaseModel):
    id: int
    term_id: int
    definition: str
    code_example: Optional[str]
    real_world_example: str
    options: List[str]
    correct_answer: str
    category: str
    difficulty: str


class AnswerSubmit(BaseModel):
    question_id: int
    answer: str


class AnswerResult(BaseModel):
    correct: bool
    correct_answer: str
    xp_earned: int
    explanation: str


class GameSessionResponse(BaseModel):
    id: int
    user_id: int
    total_questions: int
    correct_answers: int
    xp_earned: int
    completed: bool
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ==================== PROGRESS SCHEMAS ====================

class ProgressResponse(BaseModel):
    user_id: int
    terms_learned: int
    total_terms: int
    accuracy_rate: float
    categories_completed: List[str]
    recent_terms: List[TermResponse]


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_xp: int
    current_streak: int
