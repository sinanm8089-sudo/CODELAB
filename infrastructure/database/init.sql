-- CODEVERSE LAB - PostgreSQL Initialization Script
-- Product Owner & Developer: Sinan Mohammed

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    role VARCHAR(20) DEFAULT 'student' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    accent_color VARCHAR(20) DEFAULT '#8B7BFF',
    wallpaper VARCHAR(255) DEFAULT 'charcoal',
    wallpaper_blur INTEGER DEFAULT 0,
    wallpaper_opacity REAL DEFAULT 1.0,
    audio_preferences JSONB DEFAULT '{"enabled": false, "volume": 0.5, "preset": "rain", "custom_url": ""}'::jsonb,
    editor_preferences JSONB DEFAULT '{"fontSize": 14, "tabSize": 4, "minimap": true, "wordWrap": "on", "fontFamily": "JetBrains Mono"}'::jsonb,
    learning_preferences JSONB DEFAULT '{"learning_language": "python", "explanation_language": "english", "difficulty": "beginner", "style": "hands-on", "daily_target_minutes": 30}'::jsonb,
    dashboard_layout JSONB DEFAULT '{"enabled_widgets": ["streak", "active_lesson", "quick_ide", "timer", "algo_daily", "recent_projects", "ai_tutor"]}'::jsonb,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename VARCHAR(150) NOT NULL,
    content TEXT DEFAULT '',
    language VARCHAR(50) DEFAULT 'python'
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    order_index INTEGER UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) DEFAULT 'Foundations',
    difficulty VARCHAR(20) DEFAULT 'Beginner',
    estimated_minutes INTEGER DEFAULT 15,
    definition TEXT NOT NULL,
    analogy TEXT NOT NULL,
    visual_diagram TEXT DEFAULT '',
    syntax_explanation TEXT DEFAULT '',
    example_codes JSONB DEFAULT '{}'::jsonb,
    line_by_line JSONB DEFAULT '{}'::jsonb,
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    quiz JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS practice_problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) DEFAULT 'Fundamentals',
    difficulty VARCHAR(20) DEFAULT 'Easy',
    description TEXT NOT NULL,
    input_format TEXT DEFAULT '',
    output_format TEXT DEFAULT '',
    constraints TEXT DEFAULT '',
    sample_input TEXT DEFAULT '',
    sample_output TEXT DEFAULT '',
    sample_explanation TEXT DEFAULT '',
    time_limit_sec REAL DEFAULT 2.0,
    starter_codes JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL REFERENCES practice_problems(id) ON DELETE CASCADE,
    input_data TEXT DEFAULT '',
    expected_output TEXT DEFAULT '',
    is_hidden BOOLEAN DEFAULT FALSE,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER REFERENCES practice_problems(id) ON DELETE SET NULL,
    language VARCHAR(50) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    score REAL DEFAULT 0.0,
    passed_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    execution_time_ms REAL DEFAULT 0.0,
    execution_result JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_seconds INTEGER DEFAULT 0,
    session_type VARCHAR(50) DEFAULT 'pomodoro',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);

