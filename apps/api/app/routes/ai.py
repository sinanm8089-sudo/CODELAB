import json
import asyncio
from typing import AsyncGenerator
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, AIConversation
from ..schemas import (
    TutorChatRequest, TutorChatResponse,
    GenericChatRequest, GenericChatResponse,
    GenerateRequest, GenerateResponse,
    ExplainCodeRequest, ExplainCodeResponse,
    ExplainErrorRequest, ExplainErrorResponse
)
from ..ai_service import (
    get_tutor_response,
    explain_code_snippet,
    explain_error_diagnostic,
    call_gemini
)
from ..security import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.get("/status")
async def ai_status():
    return {
        "status": "online",
        "engine": "CODELAB AI Code Intelligence",
        "developer": "Sinan Mohammed",
        "context_window": "1,048,576 tokens",
        "speed": "sub-second (~240ms)",
        "capabilities": [
            "interactive_tutoring",
            "line_by_line_explanation",
            "autonomous_error_diagnostics",
            "multilingual_malayalam_instruction",
            "algorithm_complexity_analysis"
        ]
    }

@router.post("/chat", response_model=GenericChatResponse)
async def generic_chat(
    req: GenericChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Secure, provider-neutral chat endpoint.
    Frontend talks only to /api/ai/chat without knowledge of underlying backend AI engine.
    """
    messages_payload = []
    if req.messages:
        messages_payload = [{"role": m.role or "user", "content": m.content or ""} for m in req.messages if m.content]
    elif req.message:
        messages_payload = [{"role": "user", "content": req.message}]
    else:
        messages_payload = [{"role": "user", "content": "Hello! How can I improve my code?"}]

    result = await get_tutor_response(
        messages=messages_payload,
        language=req.language or "python",
        mode=req.mode or "simple",
        explanation_language="english",
        context_code=req.context_code
    )

    try:
        convo = AIConversation(
            user_id=current_user.id,
            mode=req.mode or "simple",
            language=req.language or "python",
            messages=messages_payload + [{"role": "assistant", "content": result["response"]}]
        )
        db.add(convo)
        db.commit()
    except Exception:
        db.rollback()

    return GenericChatResponse(
        response=result.get("response", ""),
        engine="CODELAB AI Engine",
        model="CODELAB AI Intelligence",
        status="success"
    )

@router.post("/generate", response_model=GenerateResponse)
async def generate_code(
    req: GenerateRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Secure code generation endpoint.
    """
    lang = req.language or "python"
    task = req.task or "code_generation"
    sys_prompt = (
        f"You are the CODELAB AI Code Synthesis Engine (created by Sinan Mohammed). "
        f"Target language: {lang}. Task: {task}. "
        f"Generate clean, idiomatic, fully working code with helpful comments. "
        f"Provide the solution inside a standard markdown code block."
    )
    user_prompt = f"Prompt: {req.prompt}\n"
    if req.context_code:
        user_prompt += f"Context Code:\n```{lang}\n{req.context_code}\n```"

    ai_res = await call_gemini(sys_prompt, user_prompt)
    if not ai_res:
        # Fallback code synthesis
        ai_res = f"```{lang}\n# Solution for: {req.prompt}\ndef solve():\n    # Implementation synthesized by CODELAB AI\n    pass\n```\n\nCode synthesized for {lang}."

    return GenerateResponse(
        generated_code=ai_res,
        explanation=f"Generated for {lang} ({task})",
        engine="CODELAB AI Engine",
        model="CODELAB AI Intelligence"
    )

@router.post("/stream")
async def stream_chat(
    req: GenericChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    SSE streaming endpoint for real-time AI responses.
    """
    messages_payload = []
    if req.messages:
        messages_payload = [{"role": m.role or "user", "content": m.content or ""} for m in req.messages if m.content]
    elif req.message:
        messages_payload = [{"role": "user", "content": req.message}]
    else:
        messages_payload = [{"role": "user", "content": "Hello"}]

    result = await get_tutor_response(
        messages=messages_payload,
        language=req.language or "python",
        mode=req.mode or "simple",
        context_code=req.context_code
    )
    full_text = result.get("response", "")

    async def event_generator():
        # Stream response tokens/words securely without leaking backend models
        words = full_text.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + (" " if i + 3 < len(words) else "")
            payload = json.dumps({"chunk": chunk, "done": False, "model": "CODELAB AI Intelligence"})
            yield f"data: {payload}\n\n"
            await asyncio.sleep(0.02)
        done_payload = json.dumps({"chunk": "", "done": True, "model": "CODELAB AI Intelligence"})
        yield f"data: {done_payload}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/tutor", response_model=TutorChatResponse)
async def tutor_chat(
    req: TutorChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages_payload = []
    if req.messages:
        messages_payload = [{"role": m.role or "user", "content": m.content or ""} for m in req.messages if m.content]
    
    if not messages_payload and req.prompt:
        messages_payload = [{"role": "user", "content": req.prompt}]
        
    if not messages_payload:
        messages_payload = [{"role": "user", "content": "Hello! Teach me programming from zero."}]

    result = await get_tutor_response(
        messages=messages_payload,
        language=req.language or "python",
        mode=req.mode or "simple",
        explanation_language=req.explanation_language or "english",
        context_code=req.context_code
    )

    # Save to history safely
    try:
        convo = AIConversation(
            user_id=current_user.id,
            mode=req.mode or "simple",
            language=req.language or "python",
            messages=messages_payload + [{"role": "assistant", "content": result["response"]}]
        )
        db.add(convo)
        db.commit()
    except Exception:
        db.rollback()

    return result

@router.post("/explain-code", response_model=ExplainCodeResponse)
async def explain_code(
    req: ExplainCodeRequest,
    current_user: User = Depends(get_current_user)
):
    return await explain_code_snippet(
        language=req.language or "python",
        source_code=req.source_code,
        selected_line=req.selected_line,
        mode=req.mode or "line_by_line",
        explanation_language=req.explanation_language or "english"
    )

@router.post("/explain-error", response_model=ExplainErrorResponse)
async def explain_error(
    req: ExplainErrorRequest,
    current_user: User = Depends(get_current_user)
):
    return await explain_error_diagnostic(
        language=req.language or "python",
        source_code=req.source_code or "",
        stderr=req.stderr,
        stdout=req.stdout or "",
        exit_code=req.exit_code or 1,
        explanation_language=req.explanation_language or "english"
    )


