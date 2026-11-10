from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from ..models import User, PracticeProblem, TestCase, Submission, Notification
from ..schemas import (
    ProblemListResponse, ProblemDetailResponse,
    SubmitSolutionRequest, SubmitSolutionResponse, SubmissionResponse,
    TestCaseResult
)
from ..runner import execute_code
from ..security import get_current_user

router = APIRouter(prefix="/api/practice", tags=["Practice & Exams"])

@router.get("/problems", response_model=List[ProblemListResponse])
def list_problems(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problems = db.scalars(select(PracticeProblem).order_by(PracticeProblem.id.asc())).all()
    solved_problem_ids = set(
        db.scalars(
            select(Submission.problem_id).where(
                Submission.user_id == current_user.id,
                Submission.status == "passed"
            )
        ).all()
    )

    results = []
    for p in problems:
        results.append({
            "id": p.id,
            "title": p.title,
            "category": p.category,
            "difficulty": p.difficulty,
            "time_limit_sec": p.time_limit_sec,
            "solved": p.id in solved_problem_ids
        })
    return results

@router.get("/problems/{id}", response_model=ProblemDetailResponse)
def get_problem(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem = db.scalar(select(PracticeProblem).where(PracticeProblem.id == id))
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    solved = db.scalar(
        select(Submission.id).where(
            Submission.user_id == current_user.id,
            Submission.problem_id == id,
            Submission.status == "passed"
        ).limit(1)
    ) is not None

    sample_cases = [
        {
            "id": tc.id,
            "input_data": tc.input_data,
            "expected_output": tc.expected_output,
            "is_hidden": False,
            "explanation": tc.explanation
        }
        for tc in problem.test_cases if not tc.is_hidden
    ]

    return {
        "id": problem.id,
        "title": problem.title,
        "category": problem.category,
        "difficulty": problem.difficulty,
        "time_limit_sec": problem.time_limit_sec,
        "solved": solved,
        "description": problem.description,
        "input_format": problem.input_format,
        "output_format": problem.output_format,
        "constraints": problem.constraints,
        "sample_input": problem.sample_input,
        "sample_output": problem.sample_output,
        "sample_explanation": problem.sample_explanation,
        "starter_codes": problem.starter_codes or {},
        "sample_test_cases": sample_cases
    }

@router.post("/problems/{id}/submit", response_model=SubmitSolutionResponse)
def submit_solution(
    id: int,
    req: SubmitSolutionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem = db.scalar(select(PracticeProblem).where(PracticeProblem.id == id))
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    test_cases = problem.test_cases
    if not test_cases:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No test cases configured for this problem")

    results: List[TestCaseResult] = []
    passed_count = 0
    total_time_ms = 0.0
    overall_status = "passed"

    for idx, tc in enumerate(test_cases, 1):
        run_res = execute_code(req.language, req.source_code, tc.input_data)
        total_time_ms += run_res["execution_time_ms"]

        if run_res["status"] == "timeout":
            passed = False
            overall_status = "time_limit_exceeded"
            err = "Time limit exceeded"
        elif run_res["status"] == "error":
            passed = False
            if overall_status == "passed":
                overall_status = "runtime_error"
            err = run_res["stderr"]
        else:
            actual = run_res["stdout"].strip()
            expected = tc.expected_output.strip()
            passed = (actual == expected)
            err = None
            if not passed and overall_status == "passed":
                overall_status = "wrong_answer"

        if passed:
            passed_count += 1

        # Hide sensitive input/output for hidden tests
        results.append(TestCaseResult(
            test_case_number=idx,
            passed=passed,
            is_hidden=tc.is_hidden,
            input_data="[Hidden Test Case Data]" if tc.is_hidden else tc.input_data,
            expected_output="[Hidden Expected Output]" if tc.is_hidden else tc.expected_output,
            actual_output="[Hidden Actual Output]" if tc.is_hidden else run_res["stdout"].strip(),
            error=None if tc.is_hidden and passed else err,
            execution_time_ms=run_res["execution_time_ms"]
        ))

    score_pct = round((passed_count / len(test_cases)) * 100, 1)
    if passed_count == len(test_cases):
        feedback = f"Congratulations! Your solution passed all {len(test_cases)} test cases."
    else:
        feedback = f"Your solution passed {passed_count} of {len(test_cases)} test cases. Check edge cases and input parsing."

    sub = Submission(
        user_id=current_user.id,
        problem_id=id,
        language=req.language,
        source_code=req.source_code,
        status=overall_status,
        score=score_pct,
        passed_count=passed_count,
        total_count=len(test_cases),
        execution_time_ms=round(total_time_ms, 2),
        execution_result={"results": [r.dict() for r in results], "feedback": feedback}
    )
    db.add(sub)

    if passed_count == len(test_cases):
        noti = Notification(
            user_id=current_user.id,
            title="Problem Solved! 🏆",
            message=f"You successfully solved '{problem.title}' with a score of 100%!",
            type="achievement"
        )
        db.add(noti)

    db.commit()
    db.refresh(sub)

    return SubmitSolutionResponse(
        submission_id=sub.id,
        status=overall_status,
        score=score_pct,
        passed_count=passed_count,
        total_count=len(test_cases),
        results=results,
        feedback=feedback,
        rubric_score=int(score_pct)
    )

@router.get("/submissions")
def get_user_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    subs = db.scalars(
        select(Submission)
        .where(Submission.user_id == current_user.id)
        .order_by(Submission.submitted_at.desc())
        .limit(20)
    ).all()

    return [
        {
            "id": s.id,
            "problem_id": s.problem_id,
            "language": s.language,
            "status": s.status,
            "score": s.score,
            "passed_count": s.passed_count,
            "total_count": s.total_count,
            "execution_time_ms": s.execution_time_ms,
            "submitted_at": s.submitted_at
        }
        for s in subs
    ]

