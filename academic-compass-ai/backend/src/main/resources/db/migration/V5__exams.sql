-- Day 2: Exam Planner
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    exam_date DATE NOT NULL,
    exam_type VARCHAR(10) NOT NULL DEFAULT 'FINAL'
        CHECK (exam_type IN ('MIDTERM', 'FINAL', 'QUIZ')),
    preparation_status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED'
        CHECK (preparation_status IN ('NOT_STARTED', 'IN_PROGRESS', 'READY')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_exams_user_date ON exams (user_id, exam_date);
