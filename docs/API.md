# CODEVERSE LAB - REST API Reference

**Developer:** Sinan Mohammed  
**Base URL:** `http://localhost:8000`  
**Interactive Docs:** `http://localhost:8000/docs` (Swagger UI)  

---

## 1. Authentication Endpoints
- `POST /api/auth/register`
  - Body: `{ name: string, email: string, password: string, role?: string }`
  - Response: `{ access_token: string, token_type: "bearer", user: { id, student_id, name, email, role } }`
- `POST /api/auth/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ access_token: string, token_type: "bearer", user: { ... } }`
- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: Current user object with Student ID (`STU-YYYY-XXXXX`)
- `PATCH /api/auth/me`
  - Body: `{ name?: string, profile_image?: string }`

---

## 2. Personalization Endpoints
- `GET /api/preferences`
  - Response: User's saved theme, accent_color, wallpaper, blur, audio settings, editor settings, learning preferences, and dashboard layout
- `PUT /api/preferences`
  - Body: Complete preferences object
- `POST /api/preferences/reset`
  - Restores default settings

---

## 3. Code Execution & Debugging Endpoints
- `POST /api/execution/run`
  - Body: `{ language: string, source_code: string, stdin?: string }`
  - Response: `{ status: "success"|"error"|"timeout", stdout: string, stderr: string, exit_code: int, execution_time_ms: float, error_details: object }`
- `POST /api/execution/debug`
  - Body: `{ language: "python", source_code: string, stdin?: string }`
  - Response: `{ status: "success", steps: [ { step_number, line, event, variables, call_stack, stdout_so_far } ], total_steps: int }`

---

## 4. AI Engine Endpoints
- `POST /api/ai/tutor`
  - Body: `{ messages: [ { role, content } ], language: string, mode: string, explanation_language: string, context_code?: string }`
  - Response: `{ response: string, model: string, fallback_used: bool, action_suggestions: string[] }`
- `POST /api/ai/explain-code`
  - Body: `{ language: string, source_code: string, selected_line?: int, mode?: string, explanation_language?: string }`
  - Response: `{ title: string, explanation: string, line_number: int, breakdown: [], concept: string }`
- `POST /api/ai/explain-error`
  - Body: `{ language: string, source_code: string, stderr: string, stdout?: string, exit_code?: int }`
  - Response: `{ error_title: string, severity: string, line_number: int, meaning: string, cause: string, how_to_fix: string, concept_to_learn: string }`

---

## 5. Learning Academy Endpoints
- `GET /api/learning/lessons`
  - Response: List of all 25 lessons with user completion status
- `GET /api/learning/lessons/{id}`
  - Response: Complete lesson breakdown (definition, analogy, visual diagram, syntax, examples, line-by-line, mistakes, quiz)
- `POST /api/learning/lessons/{id}/quiz`
  - Body: `{ selected_index: int }`
  - Response: `{ correct: bool, correct_index: int, explanation: string, score: int, lesson_completed: bool }`

---

## 6. Algorithms Endpoints
- `GET /api/algorithms`
  - Response: Catalog of sorting, searching, and graph algorithms with complexities
- `GET /api/algorithms/{id}`
  - Response: Specific algorithm details, pseudocode, and multi-language implementations

---

## 7. Practical Examination Endpoints
- `GET /api/practice/problems`
  - Response: Problems list with solved status
- `GET /api/practice/problems/{id}`
  - Response: Problem description, constraints, input/output formats, and sample cases
- `POST /api/practice/problems/{id}/submit`
  - Body: `{ language: string, source_code: string }`
  - Response: `{ submission_id: int, status: string, score: float, passed_count: int, total_count: int, results: [], feedback: string, rubric_score: int }`

---

## 8. Focus & Analytics Endpoints
- `POST /api/focus/sessions`
  - Body: `{ duration_seconds: int, session_type: string }`
- `GET /api/focus/summary`
  - Response: Total study minutes, today's minutes, session history
- `GET /api/analytics/overview`
  - Response: Telemetry summary (streak, completion %, runs, weak concepts, recommendations)

