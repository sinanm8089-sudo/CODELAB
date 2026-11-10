# CODEVERSE LAB - Security Architecture & Threat Model

**Developer:** Sinan Mohammed  
**Product:** CODEVERSE LAB  

---

## 1. Untrusted Code Execution Boundary
Learner-submitted programs are treated as untrusted and potentially hostile:
1. **Time Limits (Infinite Loop Mitigation):** Every execution subprocess is constrained by strict timeouts (`settings.max_execution_time_sec = 5.0`). If a program enters an infinite loop, the subprocess is killed immediately, returning exit code -1 and clear educational feedback.
2. **Buffer Limits (Output Bomb Mitigation):** Terminal stdout and stderr streams are capped at 64 KB (`settings.max_output_bytes = 65536`) to protect browser memory and network buffers from unbounded output flood attacks (e.g. `while True: print("A")`).
3. **Payload Size Checks:** Source code uploads are capped at 64 KB (`settings.max_code_bytes`).
4. **Isolated Working Directories:** Every execution occurs in a disposable temporary directory (`tempfile.mkdtemp(prefix="codeverse_run_")`), which is guaranteed to be deleted in a `finally` block upon completion.
5. **Containerized Runner:** When deployed in Docker, execution workers run with non-root user permissions (`USER sandbox`), dropped capabilities, read-only root filesystems, and memory limits.

---

## 2. Authentication & Credential Storage
- **Password Protection:** Plaintext passwords are never stored. Passwords are encrypted using salted bcrypt (`passlib[bcrypt]`).
- **Token Security:** Authentication tokens use HMAC-SHA256 JWT tokens containing expiration timestamps.
- **Authorization Enforcement:** FastAPI dependencies (`get_current_user`, `require_role`) strictly guard private endpoints. Students can only view, modify, and delete their own projects and private submissions.

---

## 3. SQL Injection & Database Protection
- All database operations are constructed using SQLAlchemy ORM parameterized queries (`select(Model).where(...)`), completely eliminating SQL injection vectors.
- Educational SQL playground queries execute inside an isolated, in-memory SQLite sandbox (`sqlite3.connect(":memory:")`), strictly isolated from the production application database.

---

## 4. AI Provider Privacy
- Source code sent to the Google Gemini Flash adapter is stripped of database credentials and session tokens.
- When `GEMINI_API_KEY` is not present, the system defaults to safe offline deterministic educational explanations rather than simulating fake responses.

