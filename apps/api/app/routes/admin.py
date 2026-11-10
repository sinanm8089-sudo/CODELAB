from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from ..db import get_db
from ..models import User, Submission, LearningProgress, Lesson, PracticeProblem
from ..security import require_role

router = APIRouter(prefix="/api/admin", tags=["Admin & Educator"])

@router.get("/students")
def list_students(
    admin_user: User = Depends(require_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    users = db.scalars(select(User).order_by(User.created_at.desc())).all()
    results = []
    for u in users:
        completed_lessons = db.scalar(
            select(func.count(LearningProgress.id))
            .where(LearningProgress.user_id == u.id, LearningProgress.completed == True)
        ) or 0
        total_runs = db.scalar(
            select(func.count(Submission.id))
            .where(Submission.user_id == u.id)
        ) or 0
        results.append({
            "id": u.id,
            "student_id": u.student_id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "completed_lessons": completed_lessons,
            "total_runs": total_runs,
            "created_at": u.created_at
        })
    return results

@router.get("/metrics")
def get_system_metrics(
    admin_user: User = Depends(require_role(["admin", "teacher"])),
    db: Session = Depends(get_db)
):
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_runs = db.scalar(select(func.count(Submission.id))) or 0
    total_lessons = db.scalar(select(func.count(Lesson.id))) or 0
    total_problems = db.scalar(select(func.count(PracticeProblem.id))) or 0

    return {
        "total_registered_students": total_users,
        "total_code_executions": total_runs,
        "total_active_lessons": total_lessons,
        "total_practice_problems": total_problems,
        "system_status": "operational",
        "developer": "Sinan Mohammed"
    }

