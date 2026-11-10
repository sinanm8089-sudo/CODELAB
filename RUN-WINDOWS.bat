@echo off
TITLE CODELAB IDE - Sinan Mohammed
COLOR 09
echo ========================================================
echo   CODELAB IDE v2.0 - Universal Multi-Language Platform
echo   Architected and Engineered by: Sinan Mohammed
echo ========================================================
echo.
echo [1/3] Verifying Python and Node.js environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+.
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH. Please install Node.js 18+.
    pause
    exit /b 1
)

echo [2/3] Starting Backend API (FastAPI) on http://localhost:8000...
start "CODELAB Backend API" cmd /k "cd /d %~dp0 && apps\api\.venv\Scripts\python.exe -m uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [3/3] Starting Frontend (Next.js) on http://localhost:3000...
start "CODELAB Web" cmd /k "cd /d %~dp0\apps\web && npm run dev"

echo.
echo ========================================================
echo   CODELAB IDE is launching!
echo   Frontend IDE: http://localhost:3000
echo   API Docs:     http://localhost:8000/docs
echo ========================================================
ping 127.0.0.1 -n 4 >nul
start http://localhost:3000
