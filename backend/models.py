"""
SQLAlchemy ORM Models
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """User model for authentication and progress tracking"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    total_xp = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    game_sessions = relationship("GameSession", back_populates="user")


class Term(Base):
    """Technical term model"""
    __tablename__ = "terms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    definition = Column(Text, nullable=False)
    category = Column(String(50), index=True, nullable=False)
    difficulty = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    code_example = Column(Text, nullable=True)
    real_world_example = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GameSession(Base):
    """Game session for tracking quiz progress"""
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(50), nullable=True)  # Optional filter
    difficulty = Column(String(20), nullable=True)  # Optional filter
    total_questions = Column(Integer, default=5)
    correct_answers = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="game_sessions")


class UserProgress(Base):
    """Track which terms a user has learned"""
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    term_id = Column(Integer, ForeignKey("terms.id"), nullable=False)
    times_seen = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    last_seen_at = Column(DateTime(timezone=True), server_default=func.now())
    mastered = Column(Boolean, default=False)
