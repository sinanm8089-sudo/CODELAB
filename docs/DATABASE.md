# CODEVERSE LAB - Database Architecture

**Developer:** Sinan Mohammed  
**DBMS:** PostgreSQL (Production) / SQLite (Local Development)  
**ORM:** SQLAlchemy 2.0  

---

## 1. Schema Tables & Relationships

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Unique user ID |
| `student_id` | VARCHAR(50) | UNIQUE, INDEX | Official ID format: `STU-YYYY-XXXXX` |
| `name` | VARCHAR(100) | NOT NULL | Student's full name |
| `email` | VARCHAR(150) | UNIQUE, INDEX | Student email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `profile_image` | TEXT | NULLABLE | Profile avatar image URL / base64 |
| `role` | VARCHAR(20) | NOT NULL | `student`, `teacher`, `admin` |
| `created_at` | TIMESTAMP | DEFAULT NOW | Account creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Last profile update timestamp |

### `user_preferences`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY | Preference record ID |
| `user_id` | INTEGER | UNIQUE, FK `users.id` | Foreign key referencing user |
| `theme` | VARCHAR(20) | DEFAULT 'dark' | Theme: `dark`, `light`, `system` |
| `accent_color` | VARCHAR(20) | DEFAULT '#8B7BFF' | Hex accent color |
| `wallpaper` | VARCHAR(255) | DEFAULT 'charcoal'| Preset name or image URL |
| `wallpaper_blur` | INTEGER | DEFAULT 0 | Blur level in pixels (0-20) |
| `wallpaper_opacity` | REAL | DEFAULT 1.0 | Opacity multiplier (0.2-1.0) |
| `audio_preferences` | JSONB | NOT NULL | Audio volume, preset, custom URL |
| `editor_preferences` | JSONB | NOT NULL | Monaco font size, tab size, minimap |
| `learning_preferences`| JSONB | NOT NULL | Preferred code & explanation language |
| `dashboard_layout` | JSONB | NOT NULL | Enabled widgets and display order |

### `lessons` & `learning_progress`
- `lessons`: Stores 25 structured curriculum lessons with category, analogy, diagram, syntax, example codes, and interactive quiz.
- `learning_progress`: Tracks student completion status (`completed=True`), quiz score, and completion timestamp.

### `practice_problems` & `test_cases`
- `practice_problems`: Problem catalog with description, input/output formats, constraints, sample cases, and time limits.
- `test_cases`: Both public sample cases and hidden test cases for examination grading.

### `submissions`
- Records every code execution and problem submission with status (`passed`, `wrong_answer`, `runtime_error`, `time_limit_exceeded`), rubric score, execution time in ms, and detailed results.

### `study_sessions`
- Logs completed Pomodoro and custom focus cycles in seconds for genuine study duration telemetry.

