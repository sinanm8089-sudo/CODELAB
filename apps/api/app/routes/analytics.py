from datetime import datetime, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func, distinct
from ..db import get_db
from ..models import (
    User, Submission, LearningProgress, Lesson,
    StudySession, PracticeProblem, Notification
)
from ..schemas import AnalyticsOverviewResponse
from ..security import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Total study minutes from real study session records
    total_seconds = db.scalar(
        select(func.coalesce(func.sum(StudySession.duration_seconds), 0))
        .where(StudySession.user_id == current_user.id)
    ) or 0
    total_study_minutes = total_seconds // 60

    # Total programs executed
    executions_count = db.scalar(
        select(func.count(Submission.id))
        .where(Submission.user_id == current_user.id)
    ) or 0

    # Lessons completed
    completed_lessons_count = db.scalar(
        select(func.count(LearningProgress.id))
        .where(
            LearningProgress.user_id == current_user.id,
            LearningProgress.completed == True
        )
    ) or 0
    total_lessons_count = db.scalar(select(func.count(Lesson.id))) or 25
    completion_pct = round((completed_lessons_count / max(total_lessons_count, 1)) * 100, 1)

    # Problems solved
    solved_problems_count = db.scalar(
        select(func.count(distinct(Submission.problem_id)))
        .where(
            Submission.user_id == current_user.id,
            Submission.status == "passed",
            Submission.problem_id != None
        )
    ) or 0
    total_problems_count = db.scalar(select(func.count(PracticeProblem.id))) or 4

    # Language breakdown from actual runs
    subs = db.scalars(
        select(Submission.language)
        .where(Submission.user_id == current_user.id)
    ).all()
    lang_counts: Dict[str, int] = {}
    for l in subs:
        normalized = l.lower()
        lang_counts[normalized] = lang_counts.get(normalized, 0) + 1
    if not lang_counts:
        lang_counts = {"python": 1}

    # Weak concepts detection from failed submissions
    failed_subs = db.scalars(
        select(Submission)
        .where(
            Submission.user_id == current_user.id,
            Submission.status.in_(["error", "wrong_answer", "runtime_error", "time_limit_exceeded"])
        )
        .order_by(Submission.submitted_at.desc())
        .limit(10)
    ).all()

    weak_concepts_set = set()
    for s in failed_subs:
        if s.status == "time_limit_exceeded":
            weak_concepts_set.add("Loop Termination & Time Complexity")
        elif s.status == "wrong_answer":
            weak_concepts_set.add("Boundary Conditions & Edge Cases")
        elif s.execution_result and isinstance(s.execution_result, dict):
            diag = s.execution_result.get("error_details")
            if diag and isinstance(diag, dict):
                weak_concepts_set.add(diag.get("error_type", "Runtime Exceptions"))
    if not weak_concepts_set:
        weak_concepts_set.add("Continue with Lesson 1 to build foundational strength")

    # Learning streak calculation
    session_dates = db.scalars(
        select(func.date(StudySession.created_at))
        .where(StudySession.user_id == current_user.id)
        .distinct()
        .order_by(func.date(StudySession.created_at).desc())
    ).all()

    streak = 0
    today = datetime.utcnow().date()
    current_check = today
    for s_date in session_dates:
        # If user studied today or yesterday
        if isinstance(s_date, str):
            s_date = datetime.strptime(s_date, "%Y-%m-%d").date()
        if s_date == current_check:
            streak += 1
            current_check = current_check - timedelta(days=1)
        elif s_date == (current_check - timedelta(days=1)):
            streak += 1
            current_check = s_date - timedelta(days=1)
        else:
            break
    if streak == 0 and (total_study_minutes > 0 or executions_count > 0):
        streak = 1

    # Recommendations
    recommendations = []
    if completed_lessons_count < total_lessons_count:
        next_lesson = db.scalar(
            select(Lesson)
            .where(
                Lesson.id.not_in(
                    select(LearningProgress.lesson_id).where(
                        LearningProgress.user_id == current_user.id,
                        LearningProgress.completed == True
                    )
                )
            )
            .order_by(Lesson.order_index.asc())
            .limit(1)
        )
        if next_lesson:
            recommendations.append({
                "type": "lesson",
                "title": f"Continue Academy: {next_lesson.title}",
                "description": f"Master {next_lesson.category} with interactive analogies and runnable examples.",
                "action_url": f"/academy?lesson={next_lesson.id}"
            })

    if solved_problems_count < total_problems_count:
        unsolved_prob = db.scalar(
            select(PracticeProblem)
            .where(
                PracticeProblem.id.not_in(
                    select(Submission.problem_id).where(
                        Submission.user_id == current_user.id,
                        Submission.status == "passed",
                        Submission.problem_id != None
                    )
                )
            )
            .order_by(PracticeProblem.id.asc())
            .limit(1)
        )
        if unsolved_prob:
            recommendations.append({
                "type": "practice",
                "title": f"Practice Challenge: {unsolved_prob.title}",
                "description": f"Solve this {unsolved_prob.difficulty} level problem in the Examination Lab.",
                "action_url": f"/practice?problem={unsolved_prob.id}"
            })

    recommendations.append({
        "type": "algorithm",
        "title": "Visualize Bubble Sort & Binary Search",
        "description": "Watch comparisons, swaps, and divide-and-conquer steps animated in real time.",
        "action_url": "/algorithms?algo=bubble-sort"
    })

    # Recent activity
    recent_activity = []
    recent_subs = db.scalars(
        select(Submission)
        .where(Submission.user_id == current_user.id)
        .order_by(Submission.submitted_at.desc())
        .limit(5)
    ).all()
    for s in recent_subs:
        recent_activity.append({
            "type": "execution",
            "title": f"Ran {s.language.capitalize()} code",
            "status": s.status,
            "timestamp": s.submitted_at.isoformat()
        })

    return AnalyticsOverviewResponse(
        student_id=current_user.student_id,
        student_name=current_user.name,
        current_streak_days=streak,
        total_study_minutes=total_study_minutes,
        programs_executed_count=executions_count,
        lessons_completed_count=completed_lessons_count,
        total_lessons_count=total_lessons_count,
        completion_percentage=completion_pct,
        problems_solved_count=solved_problems_count,
        total_problems_count=total_problems_count,
        language_breakdown=lang_counts,
        weak_concepts=list(weak_concepts_set),
        recent_activity=recent_activity,
        recommendations=recommendations
    )

@router.get("/notifications")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notis = db.scalars(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(20)
    ).all()

    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "read": n.read,
            "created_at": n.created_at
        }
        for n in notis
    ]

@router.post("/notifications/{id}/read")
def mark_notification_read(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    noti = db.scalar(select(Notification).where(Notification.id == id, Notification.user_id == current_user.id))
    if noti:
        noti.read = True
        db.commit()
    return {"success": True}

