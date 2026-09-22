@echo off
setlocal EnableExtensions
title BytePath Development Server
color 0A

set "FRONTEND_DIR=%~dp0frontend"
set "BACKEND_DIR=%~dp0backend"

if not exist "%FRONTEND_DIR%\package.json" (
  echo ERROR: BytePath frontend was not found at "%FRONTEND_DIR%".
  pause
  exit /b 1
)

pushd "%FRONTEND_DIR%"

rem Vite reads this value from .env. The Spring backend needs the same public
rem client ID in its process environment in order to verify Google ID tokens.
for /f "tokens=1,* delims==" %%A in ('findstr /b /c:"VITE_GOOGLE_CLIENT_ID=" ".env" 2^>nul') do (
  if /i "%%A"=="VITE_GOOGLE_CLIENT_ID" set "GOOGLE_CLIENT_ID=%%B"
)

if not defined GOOGLE_CLIENT_ID (
  echo WARNING: VITE_GOOGLE_CLIENT_ID is missing from frontend\.env.
  echo          Google sign-in will remain unavailable until it is configured.
)

netstat -ano | findstr /r /c:":8081 .*LISTENING" >nul
if errorlevel 1 (
  if exist "%BACKEND_DIR%\target\bytepath-backend-1.0.0.jar" (
    echo Starting the authentication backend on http://localhost:8081 ...
    powershell -NoProfile -Command "Start-Process -FilePath 'java' -ArgumentList '-Dgoogle.client-id=%GOOGLE_CLIENT_ID%', '-jar', 'target\bytepath-backend-1.0.0.jar' -WorkingDirectory '%BACKEND_DIR%' -WindowStyle Hidden"
  ) else (
    where mvn >nul 2>nul
    if errorlevel 1 (
      echo WARNING: Neither Maven nor backend jar was found, backend could not be started.
    ) else (
      echo Starting the authentication backend on http://localhost:8081 ...
      powershell -NoProfile -Command "Start-Process -FilePath 'mvn' -ArgumentList 'spring-boot:run' -WorkingDirectory '%BACKEND_DIR%' -WindowStyle Hidden"
    )
  )
) else (
  echo Authentication backend is already running on port 8081.
)

echo.
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed. Make sure Node.js is installed.
  popd
  pause
  exit /b 1
)


echo.
echo Starting BytePath at http://localhost:5173 ...
echo Wait for the backend startup message before testing Google sign-in.
echo Press Ctrl+C to stop the frontend server.
echo.
call npm run dev -- --port 5173 --strictPort
popd
pause
