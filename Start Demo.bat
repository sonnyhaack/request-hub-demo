@echo off
setlocal

cd /d "%~dp0"

echo Starting Request Hub Demo...
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Please install Python and try again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Please install Node.js and try again.
  pause
  exit /b 1
)

if not exist "backend\.venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  python -m venv backend\.venv
  if errorlevel 1 (
    echo Failed to create Python virtual environment.
    pause
    exit /b 1
  )
)

echo Installing backend dependencies...
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if errorlevel 1 (
  echo Failed to install backend dependencies.
  pause
  exit /b 1
)

echo Preparing database...
pushd backend
call .venv\Scripts\python.exe manage.py migrate --noinput
if errorlevel 1 (
  popd
  echo Failed to run database migrations.
  pause
  exit /b 1
)

for /f %%i in (' .venv\Scripts\python.exe manage.py shell -c "from apps.requests.models import Request; print(Request.objects.count())" 2^>nul ') do set REQUEST_COUNT=%%i
if "%REQUEST_COUNT%"=="0" (
  call .venv\Scripts\python.exe manage.py loaddata fixtures\sample_requests.json
)
if errorlevel 1 (
  popd
  echo Failed to load sample data.
  pause
  exit /b 1
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  start "Request Hub Backend" cmd /k ".venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"
) else (
  echo Backend is already running on port 8000.
)
popd

if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  pushd frontend
  call npm install
  if errorlevel 1 (
    popd
    echo Failed to install frontend dependencies.
    pause
    exit /b 1
  )
  popd
)

pushd frontend
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  start "Request Hub Frontend" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"
) else (
  echo Frontend is already running on port 5173.
)
popd

echo Opening the demo in your browser...
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:5173/"

echo.
echo Request Hub Demo is starting.
echo Keep the two server windows open while reviewing the app.
echo You can close them when you are done.
pause
