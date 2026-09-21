@echo off
title Pathfy – Academic Planner Dev Server
color 0A

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Pathfy – B.Tech CS & IT Academic Planner      ║
echo ║   Setting up and launching dev server...         ║
echo ╚══════════════════════════════════════════════════╝
echo.

for /f "tokens=1,* delims==" %%A in ('findstr /b /c:"VITE_GOOGLE_CLIENT_ID=" ".env" 2^>nul') do (
  if /i "%%A"=="VITE_GOOGLE_CLIENT_ID" set "GOOGLE_CLIENT_ID=%%B"
)

netstat -ano | findstr /r /c:":8081 .*LISTENING" >nul
if errorlevel 1 (
  echo [0/3] Starting Spring Boot backend on port 8081...
  if exist "%~dp0backend\target\bytepath-backend-1.0.0.jar" (
    powershell -NoProfile -Command "Start-Process -FilePath 'java' -ArgumentList '-Dgoogle.client-id=%GOOGLE_CLIENT_ID%', '-jar', 'target\bytepath-backend-1.0.0.jar' -WorkingDirectory '%~dp0backend' -WindowStyle Hidden"
  )
)

echo [1/2] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)

echo.
echo [2/2] Starting Vite dev server...
echo       App will open at: http://localhost:5173
echo       Press Ctrl+C to stop.
echo.
call npm run dev -- --port 5173 --strictPort
pause
