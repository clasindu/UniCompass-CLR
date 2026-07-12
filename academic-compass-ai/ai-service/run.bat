@echo off
call venv\Scripts\activate.bat
echo Starting AI service on http://localhost:8000 ...
uvicorn app.main:app --reload --port 8000
