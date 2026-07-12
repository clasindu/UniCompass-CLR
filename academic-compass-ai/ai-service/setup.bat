@echo off
echo ============================================
echo   Academic Compass AI Service - First Setup
echo ============================================
echo.
echo Creating Python virtual environment...
python -m venv venv
echo.
echo Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo.
echo ============================================
echo   Setup complete!
echo.
echo   NEXT: copy .env.example to .env and paste
echo   your Gemini API key into it.
echo.
echo   Then run:  run.bat
echo ============================================
pause
