# ========================================================
#   CODELAB IDE v2.0 - Universal Launch Script
#   Architected and Engineered by: Sinan Mohammed
# ========================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CODELAB IDE v2.0 - Launching Engineering Environment" -ForegroundColor White
Write-Host "  Architected by: Sinan Mohammed" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Check Python
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "[ERROR] Python 3.10+ not detected in PATH." -ForegroundColor Red
    exit 1
}

# 2. Check Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[ERROR] Node.js 18+ not detected in PATH." -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Environment Verified: Python and Node.js active." -ForegroundColor Green

# 3. Start Backend in separate window
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "[2/3] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir`" && apps\api\.venv\Scripts\python.exe -m uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# 4. Start Frontend in separate window
Write-Host "[3/3] Launching Next.js Web on http://localhost:3000..." -ForegroundColor Yellow
$webProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$scriptDir\apps\web`" && npm run dev" -PassThru

Start-Sleep -Seconds 4
Write-Host "CODELAB IDE is active! Opening browser at http://localhost:3000" -ForegroundColor Green
Start-Process "http://localhost:3000"
