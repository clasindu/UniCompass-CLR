# UniCompass-CLR

A full-stack student success platform that combines academic tracking with AI-powered
study tools and a wellbeing/mentorship booking system. Built with grading logic tailored to the letter-grade scale.

> Three coordinated services — a Spring Boot API, a FastAPI AI microservice, and a
> React single-page app — backed by PostgreSQL and Google Gemini.

---

## Features

**Academic tracking**
- JWT authentication (register, login, refresh, logout) with BCrypt password hashing
- Student profile with skills and career goal
- Semester / subject / grade management with automatic GPA calculation
- Assignment tracker (kanban-style) with priority and difficulty
- Exam planner with date, time, and venue

**AI tools (Google Gemini)**
- AI Learning Assistant — upload a lecture PDF and get an auto-generated summary,
  flashcards, and multiple-choice quiz
- AI Academic Advisor — analyses your grades and produces a motivational,
  SLTC-aware improvement plan with study resources and retake help for repeats
- AI Career Guidance — skill-gap analysis and a phased learning roadmap for a
  target career
- AI Smart Timetable — builds a weekly study schedule (with time slots) that
  prioritises nearest deadlines and hardest work

**Wellbeing & mentorship**
- Unified booking system with demo providers
- Wellness: medical specialists (16 consultant types), psychology counselors,
  and fitness/health coaches — with a non-diagnostic "which specialist?" helper
- Mentors: university lecturers, seniors, and industry experts (career guidance)
- My Bookings view with cancel
- Verified Sri Lankan crisis helplines and clear health disclaimers throughout

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand, React Query, Axios |
| Backend | Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, Flyway |
| AI service | Python 3.12, FastAPI, Uvicorn, Google Gemini (google-genai), pypdf |
| Database | PostgreSQL |

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  React SPA  │──▶  |  Spring Boot API │───▶│  PostgreSQL  │
│  (Vite)     │     │  (auth, academic,│     │              │
│  :5173      │     │   bookings) :8081│     │              │
└──────┬──────┘     └──────────────────┘     └──────────────┘
       │
       │            ┌──────────────────┐     ┌──────────────┐
       └──────────▶│  FastAPI AI svc  │────▶│ Google Gemini│
                    │  (PDF, advisor,  │     │              │
                    │  career) :8000   │     │              │
                    └──────────────────┘     └──────────────┘
```

The frontend talks to the Spring Boot API for all core data (auth, grades,
assignments, exams, bookings) and directly to the FastAPI service for AI features.
Database schema is versioned with Flyway migrations (V1–V8).

---

## Project structure

```
academic-compass-ai/
├── backend/        # Spring Boot API (Java 21)
├── ai-service/     # FastAPI AI microservice (Python)
├── frontend/       # React + TypeScript + Vite SPA
├── database/       # database notes
└── docs/           # design documents
```

---

## Running locally

You run three services at once, each in its own terminal.

### Prerequisites
- Java 21, Maven
- Node.js 18+
- Python 3.12
- PostgreSQL (a database named `academic_compass`)
- A Google Gemini API key

### 1. Database
Create a PostgreSQL database named `academic_compass`. Flyway creates all tables
automatically on first backend start.

### 2. Backend (port 8081)
```bash
cd backend
# set environment variables (see backend/.env.example), then:
mvn spring-boot:run
```
Key env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`,
`SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`.

### 3. AI service (port 8000)
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# add your key to .env (see .env.example): GEMINI_API_KEY=...
uvicorn app.main:app --reload --port 8000
```
Uses the `gemini-flash-latest` model.

### 4. Frontend (port 5173)
```bash
cd frontend
npm install
# create .env (see .env.example):
#   VITE_API_BASE_URL=http://localhost:8081/api
#   VITE_AI_BASE_URL=http://localhost:8000
npm run dev
```

Then open http://localhost:5173, register an account, and explore.

---

## Environment variables

Each service has a `.env.example` showing the variables it needs. Real `.env`
files are gitignored and never committed. Never commit secrets.

**backend/.env**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/academic_compass
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your-password
JWT_SECRET=your-long-random-secret-at-least-32-chars
JWT_ACCESS_EXPIRY_MINUTES=15
JWT_REFRESH_EXPIRY_DAYS=7
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**ai-service/.env**
```
GEMINI_API_KEY=your-gemini-api-key
AI_SERVICE_PORT=8000
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:8081/api
VITE_AI_BASE_URL=http://localhost:8000
```

---

## Notes on responsible design

The wellbeing features are built with care: providers are clearly labelled as demo
data, health sections carry a "not a diagnosis — consult a professional" disclaimer,
the symptom helper suggests a specialist *type* without diagnosing, and real,
verified Sri Lankan crisis helplines are shown. The AI advisor recommends searchable
study resources (search terms and well-known platforms) rather than inventing
specific links.

---

## Author

Built by Chamath Lasindu Rajapaksha 
Demo-https://drive.google.com/file/d/1phdda6BEq76ryTaeW0gxR19LCOcCkE3j/view?usp=sharing

## License

This project is for educational and portfolio purposes.
