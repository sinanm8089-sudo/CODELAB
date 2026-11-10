from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth & User -----------------
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[str] = "student"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    role: str
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    profile_image: Optional[str] = None

# ----------------- Preferences -----------------
class UserPreferenceSchema(BaseModel):
    theme: str = "dark"
    accent_color: str = "#8B7BFF"
    wallpaper: str = "charcoal"
    wallpaper_blur: int = 0
    wallpaper_opacity: float = 1.0
    audio_preferences: Dict[str, Any] = Field(default_factory=lambda: {
        "enabled": False, "volume": 0.5, "preset": "rain", "custom_url": ""
    })
    editor_preferences: Dict[str, Any] = Field(default_factory=lambda: {
        "fontSize": 14, "tabSize": 4, "minimap": True, "wordWrap": "on", "fontFamily": "JetBrains Mono"
    })
    learning_preferences: Dict[str, Any] = Field(default_factory=lambda: {
        "learning_language": "python", "explanation_language": "english", "difficulty": "beginner", "style": "hands-on", "daily_target_minutes": 30
    })
    dashboard_layout: Dict[str, Any] = Field(default_factory=lambda: {
        "enabled_widgets": ["streak", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"],
        "widget_order": ["streak", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"]
    })

# ----------------- Projects -----------------
class ProjectFileSchema(BaseModel):
    id: Optional[int] = None
    filename: str
    content: str = ""
    language: str = "python"

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    language: str = "python"
    description: Optional[str] = ""
    initial_content: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    language: str
    description: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    files_count: Optional[int] = 1

    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    files: List[ProjectFileSchema] = []

# ----------------- Execution & Debugger -----------------
class ExecuteRequest(BaseModel):
    language: str
    source_code: str
    stdin: Optional[str] = ""

class ExecuteResponse(BaseModel):
    status: str  # success, error, timeout
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float
    error_details: Optional[Dict[str, Any]] = None

class DebugRequest(BaseModel):
    language: str
    source_code: str
    stdin: Optional[str] = ""

class DebugStep(BaseModel):
    step_number: int
    line: int
    event: str  # call, line, return
    variables: Dict[str, Any]
    call_stack: List[str]
    stdout_so_far: str

class DebugResponse(BaseModel):
    status: str
    steps: List[DebugStep] = []
    total_steps: int = 0
    error: Optional[str] = None

# ----------------- AI -----------------
class MessageItem(BaseModel):
    role: Optional[str] = "user"  # user, assistant, system
    content: Optional[str] = ""

class TutorChatRequest(BaseModel):
    messages: Optional[List[MessageItem]] = []
    prompt: Optional[str] = None
    language: Optional[str] = "python"
    mode: Optional[str] = "simple"  # simple, detailed, real_world, visual, qna, exam, code_demo
    explanation_language: Optional[str] = "english"  # english, malayalam, etc.
    context_code: Optional[str] = None

class TutorChatResponse(BaseModel):
    response: str
    model: str = "CODELAB AI Intelligence"
    fallback_used: bool = False
    action_suggestions: List[str] = []

class GenericChatRequest(BaseModel):
    message: Optional[str] = None
    messages: Optional[List[MessageItem]] = []
    language: Optional[str] = "python"
    mode: Optional[str] = "simple"
    context_code: Optional[str] = None

class GenericChatResponse(BaseModel):
    response: str
    engine: str = "CODELAB AI Engine"
    model: str = "CODELAB AI Intelligence"
    status: str = "success"

class GenerateRequest(BaseModel):
    prompt: str
    language: Optional[str] = "python"
    task: Optional[str] = "code_generation"  # code_generation, refactor, test_cases, explain
    context_code: Optional[str] = None

class GenerateResponse(BaseModel):
    generated_code: str
    explanation: Optional[str] = None
    engine: str = "CODELAB AI Engine"
    model: str = "CODELAB AI Intelligence"

class ExplainCodeRequest(BaseModel):
    language: Optional[str] = "python"
    source_code: str
    selected_line: Optional[int] = None
    selected_code: Optional[str] = None
    mode: Optional[str] = "line_by_line"  # line_by_line, overview, beginner
    explanation_language: Optional[str] = "english"

class ExplainCodeResponse(BaseModel):
    title: str = "Code Analysis"
    explanation: str = ""
    high_level_purpose: Optional[str] = None
    line_number: Optional[int] = None
    breakdown: Optional[Union[List[Any], Dict[str, Any]]] = []
    line_explanations: Optional[Union[List[Any], Dict[str, Any]]] = []
    concept: Optional[str] = None
    model: str = "CODELAB AI Intelligence"
    fallback_used: bool = False

class ExplainErrorRequest(BaseModel):
    language: Optional[str] = "python"
    source_code: Optional[str] = ""
    stderr: str
    stdout: Optional[str] = ""
    exit_code: Optional[int] = 1
    explanation_language: Optional[str] = "english"

class ExplainErrorResponse(BaseModel):
    error_title: str = "Error Analysis"
    severity: str = "error"  # error, warning, syntax_error, runtime_error
    line_number: Optional[int] = None
    meaning: str = ""
    cause: str = ""
    root_cause: Optional[str] = None
    summary: Optional[str] = None
    mental_model: Optional[str] = None
    how_to_fix: str = ""
    fix_code: Optional[str] = None
    corrected_code: Optional[str] = None
    concept_to_learn: Optional[str] = None
    model: str = "CODELAB AI Intelligence"
    fallback_used: bool = False

# ----------------- Learning & Lessons -----------------
class LessonListResponse(BaseModel):
    id: int
    order_index: int
    title: str
    category: str
    difficulty: str
    estimated_minutes: int
    completed: bool = False
    quiz_score: Optional[int] = None

    class Config:
        from_attributes = True

class LessonDetailResponse(LessonListResponse):
    definition: str
    analogy: str
    visual_diagram: str
    syntax_explanation: str
    example_codes: Dict[str, str]
    line_by_line: Dict[str, str]
    common_mistakes: List[Dict[str, str]]
    quiz: Dict[str, Any]

class QuizSubmitRequest(BaseModel):
    selected_index: int

class QuizSubmitResponse(BaseModel):
    correct: bool
    correct_index: int
    explanation: str
    score: int
    lesson_completed: bool

# ----------------- Practice & Examinations -----------------
class TestCaseSchema(BaseModel):
    id: Optional[int] = None
    input_data: str
    expected_output: str
    is_hidden: bool = False
    explanation: Optional[str] = None

class ProblemListResponse(BaseModel):
    id: int
    title: str
    category: str
    difficulty: str
    time_limit_sec: float
    solved: bool = False

    class Config:
        from_attributes = True

class ProblemDetailResponse(ProblemListResponse):
    description: str
    input_format: str
    output_format: str
    constraints: str
    sample_input: str
    sample_output: str
    sample_explanation: str
    starter_codes: Dict[str, str]
    sample_test_cases: List[TestCaseSchema] = []

class SubmitSolutionRequest(BaseModel):
    language: str
    source_code: str

class TestCaseResult(BaseModel):
    test_case_number: int
    passed: bool
    is_hidden: bool
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    actual_output: Optional[str] = None
    error: Optional[str] = None
    execution_time_ms: float

class SubmitSolutionResponse(BaseModel):
    submission_id: int
    status: str  # passed, wrong_answer, runtime_error, compilation_error, time_limit_exceeded
    score: float
    passed_count: int
    total_count: int
    results: List[TestCaseResult]
    feedback: str
    rubric_score: int

class SubmissionResponse(BaseModel):
    id: int
    problem_id: Optional[int] = None
    language: str
    status: str
    score: float
    passed_count: int
    total_count: int
    execution_time_ms: float
    submitted_at: datetime

    class Config:
        from_attributes = True

# ----------------- Study Sessions & Analytics -----------------
class LogStudySessionRequest(BaseModel):
    duration_seconds: int = Field(..., ge=1)
    session_type: str = "pomodoro"

class AnalyticsOverviewResponse(BaseModel):
    student_id: str
    student_name: str
    current_streak_days: int
    total_study_minutes: int
    programs_executed_count: int
    lessons_completed_count: int
    total_lessons_count: int
    completion_percentage: float
    problems_solved_count: int
    total_problems_count: int
    language_breakdown: Dict[str, int]
    weak_concepts: List[str]
    recent_activity: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
