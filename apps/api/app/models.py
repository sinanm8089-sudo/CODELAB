from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    profile_image = Column(Text, nullable=True)
    role = Column(String(20), default="student", nullable=False)  # student, teacher, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="user", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme = Column(String(20), default="dark")  # dark, light, system
    accent_color = Column(String(20), default="#8B7BFF")
    wallpaper = Column(String(255), default="charcoal")
    wallpaper_blur = Column(Integer, default=0)
    wallpaper_opacity = Column(Float, default=1.0)
    audio_preferences = Column(JSON, default=lambda: {
        "enabled": False,
        "volume": 0.5,
        "preset": "rain",
        "custom_url": ""
    })
    editor_preferences = Column(JSON, default=lambda: {
        "fontSize": 14,
        "tabSize": 4,
        "minimap": True,
        "wordWrap": "on",
        "fontFamily": "JetBrains Mono"
    })
    learning_preferences = Column(JSON, default=lambda: {
        "learning_language": "python",
        "explanation_language": "english",
        "difficulty": "beginner",
        "style": "hands-on",
        "daily_target_minutes": 30
    })
    dashboard_layout = Column(JSON, default=lambda: {
        "enabled_widgets": ["streak", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"],
        "widget_order": ["streak", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"]
    })
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="preferences")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(150), nullable=False)
    language = Column(String(50), default="python")
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="projects")
    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")


class ProjectFile(Base):
    __tablename__ = "project_files"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    filename = Column(String(150), nullable=False)
    content = Column(Text, default="")
    language = Column(String(50), default="python")

    project = relationship("Project", back_populates="files")


class PracticeProblem(Base):
    __tablename__ = "practice_problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="Fundamentals")
    difficulty = Column(String(20), default="Easy")  # Easy, Medium, Hard
    description = Column(Text, nullable=False)
    input_format = Column(Text, default="")
    output_format = Column(Text, default="")
    constraints = Column(Text, default="")
    sample_input = Column(Text, default="")
    sample_output = Column(Text, default="")
    sample_explanation = Column(Text, default="")
    time_limit_sec = Column(Float, default=2.0)
    starter_codes = Column(JSON, default=dict)

    test_cases = relationship("TestCase", back_populates="problem", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="problem")


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("practice_problems.id", ondelete="CASCADE"), index=True, nullable=False)
    input_data = Column(Text, default="")
    expected_output = Column(Text, default="")
    is_hidden = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)

    problem = relationship("PracticeProblem", back_populates="test_cases")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    problem_id = Column(Integer, ForeignKey("practice_problems.id", ondelete="SET NULL"), nullable=True)
    language = Column(String(50), nullable=False)
    source_code = Column(Text, nullable=False)
    status = Column(String(50), default="pending")  # passed, wrong_answer, runtime_error, compilation_error, time_limit_exceeded
    score = Column(Float, default=0.0)
    passed_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    execution_time_ms = Column(Float, default=0.0)
    execution_result = Column(JSON, default=dict)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="submissions")
    problem = relationship("PracticeProblem", back_populates="submissions")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    order_index = Column(Integer, unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="Basics")
    difficulty = Column(String(20), default="Beginner")
    estimated_minutes = Column(Integer, default=15)
    definition = Column(Text, nullable=False)
    analogy = Column(Text, nullable=False)
    visual_diagram = Column(Text, default="")
    syntax_explanation = Column(Text, default="")
    example_codes = Column(JSON, default=dict)  # {"python": "...", "c": "...", "javascript": "..."}
    line_by_line = Column(JSON, default=dict)
    common_mistakes = Column(JSON, default=list)
    quiz = Column(JSON, default=dict)  # {"question": "...", "options": [...], "correct_index": 0, "explanation": "..."}

    progress = relationship("LearningProgress", back_populates="lesson", cascade="all, delete-orphan")


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), index=True, nullable=False)
    completed = Column(Boolean, default=False)
    quiz_score = Column(Integer, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="learning_progress")
    lesson = relationship("Lesson", back_populates="progress")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    duration_seconds = Column(Integer, default=0)
    session_type = Column(String(50), default="pomodoro")  # pomodoro, custom, break
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="study_sessions")


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    mode = Column(String(50), default="tutor")
    language = Column(String(50), default="python")
    messages = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # info, achievement, reminder
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

