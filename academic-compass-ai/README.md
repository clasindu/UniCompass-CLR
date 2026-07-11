# UNICompass-CLR

AI-Powered Personal Student Success Companion.

This repository is being built in phases. **Day 1** delivers a working scaffold:
a running Spring Boot backend + React frontend + local PostgreSQL, with
**Module 1 (Authentication)** and **Module 2 (Student Profile)** fully functional
end to end.

## What works right now (Day 1)

- Register a new student account (email + password, BCrypt-hashed)
- Log in and receive a JWT access token
- JWT-protected routing on both backend and frontend
- Create / view / edit the student profile (name, university, degree, career goal, interests)
- Add and remove skills with a proficiency level
- Log out

> Google OAuth and httpOnly-cookie refresh tokens are intentionally deferred
> (see Phase 2 guide, Day 6/7 hardening). Day 1 returns the access token in the
> response body and keeps it in memory for simplicity.

## Repository structure

```
academic-compass-ai/
├── backend/      # Spring Boot REST API (Java 21, Maven)
├── frontend/     # React + TypeScript SPA (Vite)
├── ai-service/   # Python FastAPI AI service (arrives Day 3)
├── database/     # (migrations live inside backend/ for now via Flyway)
├── docs/         # Phase 1 & 2 design documents
└── README.md
```

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 14+ running locally

## 1. Database setup

Create the database (the tables themselves are created automatically by Flyway
on backend startup):

```bash
createdb academic_compass
# or inside psql:  CREATE DATABASE academic_compass;
```

## 2. Run the backend

```bash
cd backend
cp .env.example .env          # adjust DB credentials if yours differ
# export the vars (or use a tool like direnv / an IDE run config):
export $(grep -v '^#' .env | xargs)
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run, Flyway applies
`V1__init_users.sql` and `V2__profile_and_skills.sql` (which also seeds a few
universities, degrees, and skills so the dropdowns aren't empty).

Quick smoke test:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"kasun@sltc.lk","password":"password123","fullName":"Kasun Perera"}'
```

## 3. Run the frontend

```bash
cd frontend
cp .env.example .env          # defaults to http://localhost:8080/api
npm install
npm run dev
```

The app starts on **http://localhost:5173**. Open it, register an account, and
you'll land on the Profile page — fill it in, add a skill, and check the
Dashboard.

## Day 1 smoke-test path

1. Go to `/register`, create an account → you're redirected to `/profile`
2. Set university, degree, career goal → **Save profile** → "Saved" appears
3. Add a skill (e.g. Java, level 4) → chip appears; remove it → chip disappears
4. Open **Dashboard** → shows your email and the upcoming-module placeholders
5. **Log out** → redirected to `/login`; visiting `/app/profile` now bounces you back to `/login`

## Tech stack (Day 1)

| Layer     | Stack                                                        |
|-----------|-------------------------------------------------------------|
| Frontend  | React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, React Query, Axios |
| Backend   | Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Flyway, JWT (jjwt), BCrypt |
| Database  | PostgreSQL (local) — Supabase in production                 |

## What's next

- **Day 2** — Academic (semesters/subjects/grades + GPA), Assignments, Exams
- **Day 3** — AI service scaffold + AI Learning Assistant (RAG pipeline)
- **Day 4** — AI Academic Advisor, Career Guidance, Smart Timetable
- **Day 5** — Wellness, Mentor Booking, Professional Booking
- **Day 6** — Frontend integration pass + bug fixing
- **Day 7** — Deploy (Vercel / Render / Supabase) + smoke test

See `docs/` for the full Phase 1 (design) and Phase 2 (development) documents.
