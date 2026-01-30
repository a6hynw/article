@echo off
REM Article Discovery AI - Quick Start for Windows

echo ========================================
echo Article Discovery AI - Quick Start
echo ========================================
echo.

REM Check if this is the root directory
if not exist "backend" (
    echo ERROR: Please run this script from the project root directory (where backend/ and frontend/ folders are)
    pause
    exit /b 1
)

echo Step 1: Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

echo Step 2: Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   python app.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open your browser to: http://localhost:5173
echo.
echo Press any key to exit...
pause
