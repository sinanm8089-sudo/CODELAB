from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, Submission
from ..schemas import ExecuteRequest, ExecuteResponse, DebugRequest, DebugResponse
from ..runner import execute_code
from ..debugger import trace_execution
from ..config import settings
from ..security import get_current_user

router = APIRouter(prefix="/api/execution", tags=["Execution"])

@router.post("/run", response_model=ExecuteResponse)
def run_code(
    req: ExecuteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if len(req.source_code.encode("utf-8")) > settings.max_code_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Source code exceeds maximum permitted size of {settings.max_code_bytes // 1024} KB"
        )

    result = execute_code(req.language, req.source_code, req.stdin or "")

    # Record execution in submissions history for real analytics
    sub = Submission(
        user_id=current_user.id,
        language=req.language,
        source_code=req.source_code,
        status="passed" if result["status"] == "success" else "error",
        score=100.0 if result["status"] == "success" else 0.0,
        passed_count=1 if result["status"] == "success" else 0,
        total_count=1,
        execution_time_ms=result["execution_time_ms"],
        execution_result=result
    )
    db.add(sub)
    db.commit()

    return result

@router.post("/debug", response_model=DebugResponse)
def debug_code(
    req: DebugRequest,
    current_user: User = Depends(get_current_user)
):
    lang = req.language.lower().strip()
    if lang not in ["python", "py"]:
        return {
            "status": "error",
            "steps": [],
            "total_steps": 0,
            "error": f"Interactive execution tracer currently supports Python. For {req.language}, compile/run via the primary Execution terminal."
        }

    trace_result = trace_execution(req.source_code)
    return trace_result

