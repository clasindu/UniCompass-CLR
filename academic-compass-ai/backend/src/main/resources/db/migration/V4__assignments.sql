-- Day 2: Assignment Management
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    difficulty INTEGER NOT NULL DEFAULT 3
        CHECK (difficulty BETWEEN 1 AND 5),
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED'
        CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED')),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_assignments_user_deadline ON assignments (user_id, deadline);
