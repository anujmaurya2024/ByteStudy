@echo off
title Pathfy – Academic Planner Dev Server
color 0A

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Pathfy – B.Tech CS & IT Academic Planner      ║
echo ║   Setting up and launching dev server...         ║
echo ╚══════════════════════════════════════════════════╝
echo.

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
call npm run dev
pause
