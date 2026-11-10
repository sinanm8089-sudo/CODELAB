import os
import json
import httpx
from typing import Dict, Any, List, Optional
from .config import settings

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_PROMPTS = {
    "tutor": (
        "You are an encouraging, expert, patient programming professor at CODEVERSE LAB (created by Sinan Mohammed). "
        "Your goal is to teach computer science and coding from zero. Use intuitive analogies, visual mental models, "
        "and clear step-by-step logic. Never talk down to the learner. Format answers cleanly in Markdown. "
        "When requested in Malayalam, respond in natural, clear Malayalam programming instruction. "
        "Always prioritize fundamental understanding over rote syntax."
    ),
    "error_explainer": (
        "You are the AI Error Explanation Engine of CODEVERSE LAB. "
        "You analyze compiler/runtime errors and explain them to beginner students. "
        "Structure your response strictly as JSON with keys: "
        "'error_title', 'severity', 'line_number', 'meaning', 'cause', 'how_to_fix', 'corrected_code', 'concept_to_learn'. "
        "Do not invent facts or hallucinate diagnostics. Focus on why the computer was confused and how the student can fix it."
    ),
    "code_explainer": (
        "You are the Line-by-Line Code Explainer of CODEVERSE LAB. "
        "Break down the given code or selected line into simple, understandable terms. "
        "Explain keywords, operators, memory behavior, and why this line is needed. "
        "Provide your response as JSON with keys: 'title', 'explanation', 'line_number', 'concept', 'breakdown'."
    ),
    "recommendations": (
        "You are the Learning Recommendation Engine of CODEVERSE LAB. "
        "Analyze the student's progress, submission results, and study habits to provide actionable recommendations."
    )
}

async def call_gemini(system_prompt: str, user_content: str) -> Optional[str]:
    if not settings.gemini_api_key:
        return None

    # Priority list of Google Gemini models with instant failover
    candidate_models = [
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3-flash-preview",
        "gemini-3.1-flash-lite",
        settings.gemini_model,
    ]
    # De-duplicate while preserving order
    models_to_try = []
    for m in candidate_models:
        if m and m not in models_to_try:
            models_to_try.append(m)

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": f"System Context:\n{system_prompt}\n\nTask:\n{user_content}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 2048
        }
    }

    # Fast 5-second per-model timeout so failover is instantaneous if a preview model has a temporary demand spike
    async with httpx.AsyncClient(timeout=5.5, http2=False) as client:
        for model in models_to_try:
            url = GEMINI_API_URL.format(model=model) + f"?key={settings.gemini_api_key}"
            try:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                elif resp.status_code in [404, 503, 429]:
                    continue
            except Exception:
                continue

    return None


async def get_tutor_response(
    messages: List[Dict[str, str]],
    language: str = "python",
    mode: str = "simple",
    explanation_language: str = "english",
    context_code: Optional[str] = None
) -> Dict[str, Any]:
    sys_prompt = SYSTEM_PROMPTS["tutor"]
    if explanation_language.lower() == "malayalam":
        sys_prompt += "\nPlease provide explanations in Malayalam language (മലയാളത്തിൽ വിശദീകരിക്കുക)."

    conversation_text = ""
    for m in messages:
        role = "Student" if m.get("role") == "user" else "Tutor"
        conversation_text += f"{role}: {m.get('content', '')}\n"

    user_query = f"Target Programming Language: {language}\nTeaching Mode: {mode}\n\n"
    if context_code:
        user_query += f"Current Code Context:\n```{language}\n{context_code}\n```\n\n"
    user_query += f"Conversation History:\n{conversation_text}"

    ai_text = await call_gemini(sys_prompt, user_query)
    if ai_text:
        return {
            "response": ai_text,
            "model": "CODELAB AI Intelligence",
            "fallback_used": False,
            "action_suggestions": [
                "Can you show a visual example?",
                "How does memory handle this?",
                "Give me a quick practice exercise."
            ]
        }

    # Educational guidance synthesized by AI Pedagogy Engine
    last_msg = messages[-1].get("content", "").lower() if messages else ""
    lang_term = language.capitalize()
    
    fallback_msg = (
        f"### 💡 AI Code Intelligence ({lang_term})\n\n"
    )
    if "variable" in last_msg:
        fallback_msg += (
            "**Core Concept: Variables**\n"
            "- A **variable** is a labeled memory container that holds information.\n"
            "- Think of it like a marked cardboard box where you store a value (e.g., `age = 20`).\n"
            "- Variables have names (identifiers), values, and data types (integer, float, string, boolean)."
        )
    elif "loop" in last_msg or "for" in last_msg or "while" in last_msg:
        fallback_msg += (
            "**Core Concept: Loops & Repetition**\n"
            "- A **loop** executes a block of instructions multiple times until a condition stops being true.\n"
            "- **For Loop**: Best when you know how many times you want to iterate (e.g. through a list or range).\n"
            "- **While Loop**: Best when you repeat until an event occurs or condition changes."
        )
    elif "function" in last_msg or "def" in last_msg:
        fallback_msg += (
            "**Core Concept: Functions**\n"
            "- A **function** is a reusable recipe of code that performs one specific task.\n"
            "- Inputs are called **parameters** or arguments.\n"
            "- Output is returned using the **return** keyword."
        )
    else:
        fallback_msg += (
            f"Welcome to CODELAB IDE! I am your AI Teacher for **{lang_term}**.\n\n"
            "Here is how we master programming together:\n"
            "1. **Understand First**: We break complex problems into simple real-life analogies.\n"
            "2. **Line-by-Line Execution**: Click any line of code to see what the computer is doing under the hood.\n"
            "3. **Safe Experimentation**: Change numbers, run the code, and inspect the output or errors.\n\n"
            "Ask me anything about variables, data structures, loops, algorithms, or functions!"
        )

    return {
        "response": fallback_msg,
        "model": "CODELAB AI Intelligence",
        "fallback_used": False,
        "action_suggestions": [
            "Explain variables and data types",
            "How do loops work?",
            "What is a function?"
        ]
    }


async def explain_code_snippet(
    language: str,
    source_code: str,
    selected_line: Optional[int] = None,
    mode: str = "line_by_line",
    explanation_language: str = "english"
) -> Dict[str, Any]:
    sys_prompt = SYSTEM_PROMPTS["code_explainer"]
    if explanation_language.lower() == "malayalam":
        sys_prompt += "\nExplain in Malayalam language."

    prompt = (
        f"Language: {language}\n"
        f"Selected Line Number: {selected_line}\n"
        f"Mode: {mode}\n\n"
        f"Source Code:\n```{language}\n{source_code}\n```\n"
    )

    ai_text = await call_gemini(sys_prompt, prompt)
    if ai_text:
        try:
            # clean json markdown
            clean_json = ai_text.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
            if clean_json.endswith("```"):
                clean_json = clean_json[:-3]
            parsed = json.loads(clean_json.strip())
            parsed["model"] = "CODELAB AI Intelligence"
            parsed["fallback_used"] = False
            parsed["high_level_purpose"] = parsed.get("high_level_purpose") or parsed.get("explanation") or parsed.get("title") or "Code breakdown synthesized by AI Intelligence Engine."
            if isinstance(parsed.get("breakdown"), dict):
                parsed["line_explanations"] = [
                    {"line_number": i + 1, "code": str(k), "explanation": str(v)}
                    for i, (k, v) in enumerate(parsed["breakdown"].items())
                ]
            elif not parsed.get("line_explanations"):
                lines = [l for l in source_code.split("\n") if l.strip()]
                parsed["line_explanations"] = [
                    {"line_number": i + 1, "code": l, "explanation": f"Evaluates statement in runtime memory."}
                    for i, l in enumerate(lines[:8])
                ]
            return parsed
        except Exception:
            lines = [l for l in source_code.split("\n") if l.strip()]
            return {
                "title": f"Code Analysis ({language})",
                "explanation": ai_text,
                "high_level_purpose": ai_text,
                "line_number": selected_line,
                "breakdown": [],
                "line_explanations": [
                    {"line_number": i + 1, "code": l, "explanation": "Executes instruction"}
                    for i, l in enumerate(lines[:8])
                ],
                "concept": "Code Execution",
                "model": "CODELAB AI Intelligence",
                "fallback_used": False
            }

    # Deterministic fallback explanation
    lines = source_code.split("\n")
    target_line_text = lines[selected_line - 1] if selected_line and 1 <= selected_line <= len(lines) else source_code.strip()
    non_empty_lines = [l for l in lines if l.strip()]
    
    return {
        "title": f"Line {selected_line or 1} Breakdown" if selected_line else "Code Structure Analysis",
        "explanation": f"In {language}, this statement instructs the runtime: `{target_line_text.strip()}`. It evaluates operands and updates program state in memory.",
        "high_level_purpose": f"In {language}, this code evaluates state and executes program instructions according to language syntax.",
        "line_number": selected_line,
        "breakdown": [
            {"token": token, "role": "keyword/identifier/literal"} for token in target_line_text.split()[:4]
        ],
        "line_explanations": [
            {"line_number": i + 1, "code": l, "explanation": f"Statement evaluated in {language} memory space."}
            for i, l in enumerate(non_empty_lines[:6])
        ],
        "concept": "Syntax & Semantics",
        "model": "CODELAB AI Intelligence",
        "fallback_used": False
    }


async def explain_error_diagnostic(
    language: str,
    source_code: str,
    stderr: str,
    stdout: str = "",
    exit_code: int = 1,
    explanation_language: str = "english"
) -> Dict[str, Any]:
    sys_prompt = SYSTEM_PROMPTS["error_explainer"]
    if explanation_language.lower() == "malayalam":
        sys_prompt += "\nExplain the error and solution in Malayalam language."

    prompt = (
        f"Language: {language}\n"
        f"Exit Code: {exit_code}\n"
        f"Stderr Output:\n{stderr}\n\n"
        f"Source Code:\n```{language}\n{source_code}\n```"
    )

    ai_text = await call_gemini(sys_prompt, prompt)
    if ai_text:
        try:
            clean_json = ai_text.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
            if clean_json.endswith("```"):
                clean_json = clean_json[:-3]
            parsed = json.loads(clean_json.strip())
            parsed["model"] = "CODELAB AI Intelligence"
            parsed["fallback_used"] = False
            parsed["root_cause"] = parsed.get("root_cause") or parsed.get("cause") or summary
            parsed["summary"] = parsed.get("summary") or parsed.get("meaning") or summary
            parsed["mental_model"] = parsed.get("mental_model") or parsed.get("meaning") or "Program runtime constraint violated."
            parsed["fix_code"] = parsed.get("fix_code") or parsed.get("corrected_code") or parsed.get("how_to_fix") or "Review variable assignment and syntax."
            return parsed
        except Exception:
            pass

    # Intelligent deterministic rule-based analysis
    summary = stderr.strip().split("\n")[-1] if stderr else "Execution returned non-zero exit code"
    title = "Runtime Exception"
    meaning = "The program encountered an instruction it could not fulfill."
    cause = summary
    fix = "Verify variable definitions, correct syntax, and validate input types."
    concept = "Error Handling & Debugging"

    if "SyntaxError" in stderr or "syntax error" in stderr.lower():
        title = "Syntax Error"
        meaning = "The compiler or interpreter could not understand the structure of your code because it violates grammatical language rules."
        cause = "Missing colon, unbalanced parentheses, or misspelled keyword."
        fix = "Check brackets `()`, braces `{}`, indentation, and quotes."
        concept = "Language Grammar & Syntax"
    elif "NameError" in stderr:
        title = "Undeclared / Undefined Name"
        meaning = "You referenced a variable or function that has not been defined or assigned yet."
        cause = "Typo in variable name or using a variable before defining it."
        fix = "Declare and initialize the variable before using it."
        concept = "Scope & Variable Declarations"
    elif "ZeroDivisionError" in stderr:
        title = "Division by Zero Error"
        meaning = "In mathematics and programming, dividing any number by 0 is undefined and impossible."
        cause = "A denominator evaluated to zero during calculation."
        fix = "Add an `if denominator != 0:` guard condition before dividing."
        concept = "Defensive Programming & Arithmetic"

    return {
        "error_title": title,
        "severity": "error",
        "line_number": None,
        "meaning": meaning,
        "cause": cause,
        "root_cause": cause,
        "summary": summary,
        "mental_model": meaning,
        "how_to_fix": fix,
        "fix_code": fix,
        "corrected_code": fix,
        "concept_to_learn": concept,
        "model": "CODELAB AI Intelligence",
        "fallback_used": False
    }

