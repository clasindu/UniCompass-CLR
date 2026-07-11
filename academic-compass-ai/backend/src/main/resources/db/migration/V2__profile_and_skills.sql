CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100)
);

CREATE TABLE degrees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    field VARCHAR(100)
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(20) NOT NULL DEFAULT 'TECHNICAL'
        CHECK (category IN ('TECHNICAL', 'SOFT'))
);

CREATE TABLE student_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
    degree_id UUID REFERENCES degrees(id) ON DELETE SET NULL,
    career_goal VARCHAR(100),
    interests TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES student_profile(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    proficiency_level SMALLINT NOT NULL DEFAULT 1
        CHECK (proficiency_level BETWEEN 1 AND 5),
    CONSTRAINT uq_student_skill UNIQUE (student_profile_id, skill_id)
);

CREATE INDEX idx_student_skills_profile ON student_skills (student_profile_id);

-- Seed a few reference rows so the frontend dropdowns aren't empty on first run
INSERT INTO universities (name, country) VALUES
    ('SLTC Research University', 'Sri Lanka'),
    ('University of Colombo', 'Sri Lanka'),
    ('University of Moratuwa', 'Sri Lanka');

INSERT INTO degrees (name, field) VALUES
    ('Software Engineering', 'Computing'),
    ('Computer Science', 'Computing'),
    ('Information Technology', 'Computing');

INSERT INTO skills (name, category) VALUES
    ('Java', 'TECHNICAL'),
    ('React', 'TECHNICAL'),
    ('SQL', 'TECHNICAL'),
    ('Spring Boot', 'TECHNICAL'),
    ('Docker', 'TECHNICAL'),
    ('Communication', 'SOFT'),
    ('Teamwork', 'SOFT');
