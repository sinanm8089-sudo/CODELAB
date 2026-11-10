from datetime import datetime, date
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from ..db import get_db
from ..models import User, StudySession
from ..schemas import LogStudySessionRequest
from ..security import get_current_user

router = APIRouter(prefix="/api/focus", tags=["Focus & Productivity"])

@router.post("/sessions")
def log_session(
    req: LogStudySessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = StudySession(
        user_id=current_user.id,
        duration_seconds=req.duration_seconds,
        session_type=req.session_type
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {
        "success": True,
        "session_id": session.id,
        "duration_minutes": req.duration_seconds // 60,
        "session_type": req.session_type
    }

@router.get("/summary")
def get_focus_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today_start = datetime.combine(date.today(), datetime.min.time())
    
    total_seconds = db.scalar(
        select(func.coalesce(func.sum(StudySession.duration_seconds), 0))
        .where(StudySession.user_id == current_user.id)
    ) or 0

    today_seconds = db.scalar(
        select(func.coalesce(func.sum(StudySession.duration_seconds), 0))
        .where(
            StudySession.user_id == current_user.id,
            StudySession.created_at >= today_start
        )
    ) or 0

    total_sessions = db.scalar(
        select(func.count(StudySession.id))
        .where(StudySession.user_id == current_user.id)
    ) or 0

    recent_sessions = db.scalars(
        select(StudySession)
        .where(StudySession.user_id == current_user.id)
        .order_by(StudySession.created_at.desc())
        .limit(10)
    ).all()

    return {
        "total_study_minutes": round(total_seconds / 60, 1),
        "today_study_minutes": round(today_seconds / 60, 1),
        "total_sessions_count": total_sessions,
        "recent_sessions": [
            {
                "id": s.id,
                "duration_minutes": s.duration_seconds // 60,
                "session_type": s.session_type,
                "created_at": s.created_at
            }
            for s in recent_sessions
        ]
    }

