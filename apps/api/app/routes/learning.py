from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from ..models import User, Lesson, LearningProgress, Notification
from ..schemas import LessonListResponse, LessonDetailResponse, QuizSubmitRequest, QuizSubmitResponse
from ..security import get_current_user

router = APIRouter(prefix="/api/learning", tags=["Learning Academy"])

@router.get("/lessons", response_model=List[LessonListResponse])
def list_lessons(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lessons = db.scalars(select(Lesson).order_by(Lesson.order_index.asc())).all()
    user_progress = {
        lp.lesson_id: lp
        for lp in db.scalars(select(LearningProgress).where(LearningProgress.user_id == current_user.id)).all()
    }

    results = []
    for l in lessons:
        prog = user_progress.get(l.id)
        results.append({
            "id": l.id,
            "order_index": l.order_index,
            "title": l.title,
            "category": l.category,
            "difficulty": l.difficulty,
            "estimated_minutes": l.estimated_minutes,
            "completed": prog.completed if prog else False,
            "quiz_score": prog.quiz_score if prog else None
        })
    return results

@router.get("/lessons/{id}", response_model=LessonDetailResponse)
def get_lesson_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.scalar(select(Lesson).where(Lesson.id == id))
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    prog = db.scalar(select(LearningProgress).where(
        LearningProgress.user_id == current_user.id,
        LearningProgress.lesson_id == id
    ))

    return {
        "id": lesson.id,
        "order_index": lesson.order_index,
        "title": lesson.title,
        "category": lesson.category,
        "difficulty": lesson.difficulty,
        "estimated_minutes": lesson.estimated_minutes,
        "definition": lesson.definition,
        "analogy": lesson.analogy,
        "visual_diagram": lesson.visual_diagram or "",
        "syntax_explanation": lesson.syntax_explanation or "",
        "example_codes": lesson.example_codes or {},
        "line_by_line": lesson.line_by_line or {},
        "common_mistakes": lesson.common_mistakes or [],
        "quiz": lesson.quiz or {},
        "completed": prog.completed if prog else False,
        "quiz_score": prog.quiz_score if prog else None
    }

@router.post("/lessons/{id}/quiz", response_model=QuizSubmitResponse)
def submit_quiz(
    id: int,
    req: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lesson = db.scalar(select(Lesson).where(Lesson.id == id))
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

    quiz = lesson.quiz or {}
    correct_idx = quiz.get("correct_index", 0)
    is_correct = (req.selected_index == correct_idx)
    explanation = quiz.get("explanation", "Review the lesson materials to understand why this option is correct.")

    prog = db.scalar(select(LearningProgress).where(
        LearningProgress.user_id == current_user.id,
        LearningProgress.lesson_id == id
    ))
    if not prog:
        prog = LearningProgress(
            user_id=current_user.id,
            lesson_id=id,
            completed=is_correct,
            quiz_score=100 if is_correct else 0,
            completed_at=datetime.utcnow() if is_correct else None
        )
        db.add(prog)
    else:
        if is_correct:
            prog.completed = True
            prog.quiz_score = 100
            prog.completed_at = datetime.utcnow()
        elif prog.quiz_score is None:
            prog.quiz_score = 0

    if is_correct:
        # Add achievement notification
        noti = Notification(
            user_id=current_user.id,
            title="Lesson Completed! 🎉",
            message=f"You successfully completed Lesson {lesson.order_index}: '{lesson.title}'.",
            type="achievement"
        )
        db.add(noti)

    db.commit()

    return {
        "correct": is_correct,
        "correct_index": correct_idx,
        "explanation": explanation,
        "score": 100 if is_correct else 0,
        "lesson_completed": prog.completed
    }

