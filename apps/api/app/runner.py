import os
import sys
import time
import shutil
import tempfile
import subprocess
import sqlite3
import re
from typing import Dict, Any, Optional
from .config import settings

def parse_error_diagnostics(language: str, stderr: str, source_code: str) -> Optional[Dict[str, Any]]:
    if not stderr or not stderr.strip():
        return None
    
    line_number = None
    error_type = "Runtime Error"
    summary = stderr.strip().split("\n")[-1]

    if language.lower() in ["python", "py"]:
        # Python traceback: File "...", line 5, in ...
        match = re.findall(r'line (\d+)', stderr)
        if match:
            line_number = int(match[-1])
        if "SyntaxError" in stderr:
            error_type = "Syntax Error"
        elif "NameError" in stderr:
            error_type = "Undefined Name / Variable"
        elif "TypeError" in stderr:
            error_type = "Type Error"
        elif "IndexError" in stderr:
            error_type = "Index Out of Range"
        elif "ZeroDivisionError" in stderr:
            error_type = "Division by Zero"
        elif "IndentationError" in stderr:
            error_type = "Indentation Error"

    elif language.lower() in ["javascript", "typescript", "js", "ts"]:
        # Node error: ...:5:10
        match = re.search(r':(\d+):\d+', stderr)
        if match:
            line_number = int(match.group(1))
        if "SyntaxError" in stderr:
            error_type = "Syntax Error"
        elif "ReferenceError" in stderr:
            error_type = "Reference Error (Undefined Variable)"
        elif "TypeError" in stderr:
            error_type = "Type Error"

    elif language.lower() in ["c", "cpp", "c++"]:
        match = re.search(r':(\d+):\d+:\s*(error|warning):', stderr)
        if match:
            line_number = int(match.group(1))
            error_type = "Compilation Error"
        elif "undefined reference" in stderr:
            error_type = "Linker Error (Undefined Reference)"

    code_lines = source_code.split("\n")
    affected_code = code_lines[line_number - 1] if line_number and 1 <= line_number <= len(code_lines) else None

    return {
        "error_type": error_type,
        "line_number": line_number,
        "summary": summary,
        "affected_code": affected_code
    }


def execute_sql(source_code: str) -> Dict[str, Any]:
    start_time = time.perf_counter()
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    # Pre-seed sample educational schema
    cursor.executescript("""
        CREATE TABLE students (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            major TEXT NOT NULL,
            gpa REAL,
            enrollment_year INTEGER
        );
        INSERT INTO students VALUES 
            (1, 'Alice Johnson', 'Computer Science', 3.85, 2024),
            (2, 'Bob Smith', 'Electrical Engineering', 3.42, 2023),
            (3, 'Charlie Brown', 'Data Science', 3.91, 2024),
            (4, 'Diana Prince', 'Computer Science', 3.75, 2025),
            (5, 'Evan Wright', 'Software Engineering', 3.20, 2023);

        CREATE TABLE courses (
            course_code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            credits INTEGER NOT NULL
        );
        INSERT INTO courses VALUES
            ('CS101', 'Intro to Programming', 4),
            ('CS201', 'Data Structures & Algorithms', 4),
            ('DS301', 'Machine Learning Fundamentals', 3),
            ('DB101', 'Database Systems', 3);

        CREATE TABLE enrollments (
            student_id INTEGER,
            course_code TEXT,
            grade TEXT,
            PRIMARY KEY (student_id, course_code)
        );
        INSERT INTO enrollments VALUES
            (1, 'CS101', 'A'), (1, 'CS201', 'A'),
            (2, 'CS101', 'B+'), (3, 'DS301', 'A'),
            (4, 'CS101', 'A-'), (5, 'DB101', 'B');
    """)

    stdout_lines = []
    stderr = ""
    exit_code = 0
    status = "success"

    try:
        # Split statements by semicolon
        statements = [s.strip() for s in source_code.split(";") if s.strip()]
        for stmt in statements:
            cursor.execute(stmt)
            if cursor.description:
                headers = [desc[0] for desc in cursor.description]
                rows = cursor.fetchall()
                # Format nice ASCII table
                col_widths = [max(len(h), max((len(str(r[i])) for r in rows), default=0)) for i, h in enumerate(headers)]
                header_row = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
                sep_row = "-+-".join("-" * col_widths[i] for i in range(len(headers)))
                
                table_output = [header_row, sep_row]
                for row in rows:
                    table_output.append(" | ".join(str(val).ljust(col_widths[i]) for i, val in enumerate(row)))
                table_output.append(f"\n({len(rows)} row{'s' if len(rows) != 1 else ''} returned)\n")
                stdout_lines.append("\n".join(table_output))
            else:
                conn.commit()
                stdout_lines.append(f"Query OK, {cursor.rowcount} rows affected.")
    except Exception as e:
        stderr = f"SQL Error: {str(e)}"
        exit_code = 1
        status = "error"
    finally:
        conn.close()

    duration = (time.perf_counter() - start_time) * 1000
    return {
        "status": status,
        "stdout": "\n".join(stdout_lines),
        "stderr": stderr,
        "exit_code": exit_code,
        "execution_time_ms": round(duration, 2),
        "error_details": parse_error_diagnostics("sql", stderr, source_code) if stderr else None
    }


def execute_code(language: str, source_code: str, stdin: str = "") -> Dict[str, Any]:
    lang = language.lower().strip()
    if lang == "sql":
        return execute_sql(source_code)
    
    if lang in ["html", "css"]:
        return {
            "status": "success",
            "stdout": "Live HTML/CSS preview is active in the Browser Preview tab.",
            "stderr": "",
            "exit_code": 0,
            "execution_time_ms": 1.0,
            "error_details": None
        }

    temp_dir = tempfile.mkdtemp(prefix="codeverse_run_")
    start_time = time.perf_counter()

    try:
        if lang in ["python", "py"]:
            file_path = os.path.join(temp_dir, "main.py")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(source_code)
            cmd = [sys.executable, file_path]

        elif lang in ["javascript", "js", "typescript", "ts"]:
            file_path = os.path.join(temp_dir, "main.js")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(source_code)
            cmd = ["node", file_path]

        elif lang == "c":
            src_path = os.path.join(temp_dir, "main.c")
            exe_path = os.path.join(temp_dir, "main.exe" if os.name == "nt" else "main")
            with open(src_path, "w", encoding="utf-8") as f:
                f.write(source_code)

            # Check for gcc / clang
            compiler = shutil.which("gcc") or shutil.which("clang")
            if not compiler:
                return {
                    "status": "error",
                    "stdout": "",
                    "stderr": "C compiler (gcc/clang) is not installed in the host environment PATH.\nTo run native C code on Windows, install MinGW-w64 (via 'winget install -e --id MSYS2.MSYS2' or 'w64devkit') or start Docker Compose with the isolated runner container.",
                    "exit_code": 127,
                    "execution_time_ms": 0.0,
                    "error_details": {
                        "error_type": "Environment Requirement",
                        "summary": "Host GCC compiler not found in PATH",
                        "line_number": 1,
                        "affected_code": source_code.split("\n")[0] if source_code else ""
                    }
                }
            compile_proc = subprocess.run([compiler, "-O2", src_path, "-o", exe_path], capture_output=True, text=True, timeout=10)
            if compile_proc.returncode != 0:
                duration = (time.perf_counter() - start_time) * 1000
                return {
                    "status": "error",
                    "stdout": compile_proc.stdout,
                    "stderr": compile_proc.stderr,
                    "exit_code": compile_proc.returncode,
                    "execution_time_ms": round(duration, 2),
                    "error_details": parse_error_diagnostics("c", compile_proc.stderr, source_code)
                }
            cmd = [exe_path]

        elif lang in ["cpp", "c++"]:
            src_path = os.path.join(temp_dir, "main.cpp")
            exe_path = os.path.join(temp_dir, "main.exe" if os.name == "nt" else "main")
            with open(src_path, "w", encoding="utf-8") as f:
                f.write(source_code)

            compiler = shutil.which("g++") or shutil.which("clang++")
            if not compiler:
                return {
                    "status": "error",
                    "stdout": "",
                    "stderr": "C++ compiler (g++/clang++) is not installed in the host environment PATH.\nTo run native C++ code on Windows, install MinGW-w64 or launch Docker Compose with the containerized runner.",
                    "exit_code": 127,
                    "execution_time_ms": 0.0,
                    "error_details": {
                        "error_type": "Environment Requirement",
                        "summary": "Host G++ compiler not found in PATH",
                        "line_number": 1,
                        "affected_code": source_code.split("\n")[0] if source_code else ""
                    }
                }
            compile_proc = subprocess.run([compiler, "-O2", src_path, "-o", exe_path], capture_output=True, text=True, timeout=10)
            if compile_proc.returncode != 0:
                duration = (time.perf_counter() - start_time) * 1000
                return {
                    "status": "error",
                    "stdout": compile_proc.stdout,
                    "stderr": compile_proc.stderr,
                    "exit_code": compile_proc.returncode,
                    "execution_time_ms": round(duration, 2),
                    "error_details": parse_error_diagnostics("cpp", compile_proc.stderr, source_code)
                }
            cmd = [exe_path]

        elif lang == "java":
            src_path = os.path.join(temp_dir, "Main.java")
            with open(src_path, "w", encoding="utf-8") as f:
                f.write(source_code)
            javac = shutil.which("javac")
            if not javac:
                return {
                    "status": "error",
                    "stdout": "",
                    "stderr": "Java SDK (javac) is not installed in the host environment PATH.\nTo run Java code, install OpenJDK (e.g., 'winget install Microsoft.OpenJDK.21') or use Docker runner.",
                    "exit_code": 127,
                    "execution_time_ms": 0.0,
                    "error_details": {
                        "error_type": "Environment Requirement",
                        "summary": "Host JDK not found in PATH",
                        "line_number": 1,
                        "affected_code": ""
                    }
                }
            compile_proc = subprocess.run([javac, src_path], capture_output=True, text=True, timeout=10)
            if compile_proc.returncode != 0:
                duration = (time.perf_counter() - start_time) * 1000
                return {
                    "status": "error",
                    "stdout": compile_proc.stdout,
                    "stderr": compile_proc.stderr,
                    "exit_code": compile_proc.returncode,
                    "execution_time_ms": round(duration, 2),
                    "error_details": parse_error_diagnostics("java", compile_proc.stderr, source_code)
                }
            cmd = ["java", "-cp", temp_dir, "Main"]

        elif lang in ["bash", "sh"]:
            src_path = os.path.join(temp_dir, "script.sh")
            with open(src_path, "w", encoding="utf-8") as f:
                f.write(source_code)
            bash_bin = shutil.which("bash") or shutil.which("sh")
            if bash_bin:
                cmd = [bash_bin, src_path]
            else:
                # Windows fallback to powershell
                ps_path = os.path.join(temp_dir, "script.ps1")
                with open(ps_path, "w", encoding="utf-8") as f:
                    f.write(source_code)
                cmd = ["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_path]

        else:
            return {
                "status": "error",
                "stdout": "",
                "stderr": f"Execution environment for '{language}' is configured for Docker container runner mode. Supported direct host languages: Python, JavaScript, TypeScript, SQL, Bash, C, C++, Java.",
                "exit_code": 1,
                "execution_time_ms": 0.0,
                "error_details": None
            }

        # Run with strict timeout
        process = subprocess.run(
            cmd,
            input=stdin,
            capture_output=True,
            text=True,
            timeout=settings.max_execution_time_sec,
            cwd=temp_dir
        )
        duration = (time.perf_counter() - start_time) * 1000
        stdout = process.stdout[:settings.max_output_bytes]
        stderr = process.stderr[:settings.max_output_bytes]

        status = "success" if process.returncode == 0 else "error"
        error_details = parse_error_diagnostics(lang, stderr, source_code) if process.returncode != 0 else None

        return {
            "status": status,
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": process.returncode,
            "execution_time_ms": round(duration, 2),
            "error_details": error_details
        }

    except subprocess.TimeoutExpired:
        duration = (time.perf_counter() - start_time) * 1000
        return {
            "status": "timeout",
            "stdout": "",
            "stderr": f"Execution timed out after {settings.max_execution_time_sec} seconds. Your code may have an infinite loop or blocked on unprovided input.",
            "exit_code": -1,
            "execution_time_ms": round(duration, 2),
            "error_details": {
                "error_type": "Time Limit Exceeded",
                "summary": "Infinite loop or timeout detected",
                "line_number": None,
                "affected_code": None
            }
        }
    except Exception as e:
        duration = (time.perf_counter() - start_time) * 1000
        return {
            "status": "error",
            "stdout": "",
            "stderr": f"Execution error: {str(e)}",
            "exit_code": 1,
            "execution_time_ms": round(duration, 2),
            "error_details": None
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

