-- Day 2: Academic Intelligence — semesters, subjects, grades
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    credit_hours INTEGER NOT NULL DEFAULT 3
        CHECK (credit_hours BETWEEN 1 AND 12)
);

CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    assessment_type VARCHAR(30) NOT NULL DEFAULT 'FINAL',
    marks NUMERIC(5,2) NOT NULL CHECK (marks BETWEEN 0 AND 100),
    letter_grade VARCHAR(3) NOT NULL,
    gpa_points NUMERIC(3,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_semesters_user ON semesters (user_id);
CREATE INDEX idx_subjects_semester ON subjects (semester_id);
CREATE INDEX idx_grades_subject ON grades (subject_id);
